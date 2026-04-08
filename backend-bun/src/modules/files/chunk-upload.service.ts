import {
	appendFile,
	mkdir,
	readFile,
	readdir,
	rm,
	stat,
} from "node:fs/promises";
import path from "node:path";
import { Types } from "mongoose";
import type { FilePublic, FileType, OwnerType } from "./files.types";
import type { FilesService } from "./files.service";

const CHUNK_SIZE = 5 * 1024 * 1024;
const MAX_MERGE_RETRIES = 3;

type UploadStatus = "creating" | "completed" | "failed";

interface UploadSession {
	id: string;
	ownerType: OwnerType;
	ownerId: string;
	fileType: FileType;
	originalName: string;
	mimeType: string;
	totalChunks: number;
	totalSize: number;
	status: UploadStatus;
}

interface InitUploadInput {
	ownerType: OwnerType;
	ownerId: string;
	fileType: FileType;
	originalName: string;
	mimeType?: string;
	totalSize: number;
}

interface CompleteUploadResult {
	file: FilePublic;
	absoluteUrl: string;
	uploadId: string;
	status: UploadStatus;
}

export class ChunkUploadService {
	private readonly uploadRoot = path.join(process.cwd(), "uploads");
	private readonly tempRoot = path.join(this.uploadRoot, "temp");
	private readonly sessions = new Map<string, UploadSession>();

	constructor(private readonly filesService: FilesService) {}

	getChunkSize() {
		return CHUNK_SIZE;
	}

	async initUpload(input: InitUploadInput) {
		const uploadId = new Types.ObjectId().toString();
		const totalChunks = Math.max(1, Math.ceil(input.totalSize / CHUNK_SIZE));
		const session: UploadSession = {
			id: uploadId,
			ownerType: input.ownerType,
			ownerId: input.ownerId || "unknown",
			fileType: input.fileType,
			originalName: input.originalName,
			mimeType: input.mimeType || "application/octet-stream",
			totalChunks,
			totalSize: input.totalSize,
			status: "creating",
		};

		this.sessions.set(uploadId, session);
		await mkdir(this.getTempDir(uploadId), { recursive: true });
		return { uploadId, chunkSize: CHUNK_SIZE, totalChunks, status: session.status };
	}

	async saveChunk(uploadId: string, chunkIndex: number, chunkFile: File) {
		const session = this.requireSession(uploadId);
		this.assertCreating(session);
		this.assertChunkIndex(session, chunkIndex);
		await Bun.write(this.getChunkPath(uploadId, chunkIndex), chunkFile);
	}

	async completeUpload(uploadId: string, requestUrl: string): Promise<CompleteUploadResult> {
		const session = this.requireSession(uploadId);
		this.assertCreating(session);
		await this.ensureAllChunksReady(session);

		for (let attempt = 1; attempt <= MAX_MERGE_RETRIES; attempt += 1) {
			try {
				const file = await this.mergeAndPersist(session, requestUrl);
				await this.cleanup(uploadId);
				this.sessions.delete(uploadId);
				return { ...file, uploadId, status: "completed" };
			} catch (error) {
				if (attempt < MAX_MERGE_RETRIES) continue;
				session.status = "failed";
				await this.cleanup(uploadId);
				throw error;
			}
		}

		throw new Error("Failed to complete upload");
	}

	private getTempDir(uploadId: string) {
		return path.join(this.tempRoot, uploadId);
	}

	private getChunkPath(uploadId: string, chunkIndex: number) {
		return path.join(this.getTempDir(uploadId), String(chunkIndex));
	}

	private requireSession(uploadId: string) {
		const session = this.sessions.get(uploadId);
		if (!session) throw new Error("Upload session not found");
		return session;
	}

	private assertCreating(session: UploadSession) {
		if (session.status !== "creating") {
			throw new Error("Upload session is not in creating state");
		}
	}

	private assertChunkIndex(session: UploadSession, chunkIndex: number) {
		if (chunkIndex < 0 || chunkIndex >= session.totalChunks) {
			throw new Error("Invalid chunk index");
		}
	}

	private async ensureAllChunksReady(session: UploadSession) {
		const chunkFiles = await readdir(this.getTempDir(session.id));
		if (chunkFiles.length !== session.totalChunks) {
			throw new Error("Missing chunks for upload");
		}

		for (let idx = 0; idx < session.totalChunks; idx += 1) {
			await stat(this.getChunkPath(session.id, idx));
		}
	}

	private async mergeAndPersist(session: UploadSession, requestUrl: string) {
		const targetDir = path.join(this.uploadRoot, session.ownerType, session.ownerId);
		await mkdir(targetDir, { recursive: true });

		const storedName = this.buildStoredFilename(session.originalName);
		const targetPath = path.join(targetDir, storedName);
		await this.concatChunks(session, targetPath);

		const url = `/uploads/${session.ownerType}/${session.ownerId}/${storedName}`;
		const file = await this.filesService.createFile({
			ownerType: session.ownerType,
			ownerId: session.ownerId,
			fileType: session.fileType,
			url,
			size: session.totalSize,
			mimeType: session.mimeType,
		});

		return {
			file,
			absoluteUrl: new URL(url, requestUrl).toString(),
		};
	}

	private buildStoredFilename(originalName: string) {
		const ext = path.extname(originalName || "").toLowerCase() || ".bin";
		return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
	}

	private async concatChunks(session: UploadSession, targetPath: string) {
		await rm(targetPath, { force: true });

		for (let idx = 0; idx < session.totalChunks; idx += 1) {
			const chunkData = await readFile(this.getChunkPath(session.id, idx));
			await appendFile(targetPath, chunkData);
		}
	}

	private async cleanup(uploadId: string) {
		await rm(this.getTempDir(uploadId), { recursive: true, force: true });
	}
}
