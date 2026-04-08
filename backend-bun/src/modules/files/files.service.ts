import { notFound } from "@/shared/errors";
import type { IFileRepository } from "./files.repository";
import type { CreateFileRequest, UpdateFileRequest } from "./files.schema";
import type {
	FilePublic,
	FileType,
	OwnerType,
	PaginatedFiles,
} from "./files.types";
import { toPublicFile } from "./files.types";

export class FilesService {
	constructor(private readonly repository: IFileRepository) {}

	async getFiles(
		page: number,
		limit: number,
		filters: {
			ownerType?: OwnerType;
			ownerId?: string;
			fileType?: FileType;
		} = {},
	): Promise<PaginatedFiles> {
		const { docs, totalDocs } = await this.repository.findAll({
			page,
			limit,
			...filters,
		});
		return {
			docs: docs.map(toPublicFile),
			totalDocs,
			limit,
			totalPages: Math.ceil(totalDocs / limit),
			page,
		};
	}

	async getFileById(id: string): Promise<FilePublic> {
		const file = await this.repository.findById(id);
		if (!file) throw notFound("Không tìm thấy file");
		return toPublicFile(file);
	}

	async createFile(
		data: CreateFileRequest & {
			size?: number;
			mimeType?: string;
			fileKey?: string;
			uploader?: string;
		},
	): Promise<FilePublic> {
		const fileData = {
			ownerType: data.ownerType,
			ownerId: data.ownerId ?? "",
			fileType: data.fileType,
			url: data.url,
			size: data.size ?? 0,
			mimeType: data.mimeType,
			fileKey: data.fileKey,
			uploader: data.uploader,
		};
		const file = await this.repository.create(fileData);
		return toPublicFile(file);
	}

	async updateFile(id: string, data: UpdateFileRequest): Promise<FilePublic> {
		const existing = await this.repository.findById(id);
		if (!existing) throw notFound("Không tìm thấy file");

		const updated = await this.repository.update(id, data);
		if (!updated) throw notFound("Không tìm thấy file");
		return toPublicFile(updated);
	}

	async deleteFile(id: string): Promise<void> {
		const deleted = await this.repository.delete(id);
		if (!deleted) throw notFound("Không tìm thấy file");
	}
}
