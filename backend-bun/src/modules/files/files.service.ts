import { AppError } from "@/shared/errors";
import type { FileRecord, CreateFileDTO, FileQueryDTO } from "./files.types";
import { FilesRepository } from "./files.repository";

export class FilesService {
	private repo: FilesRepository;

	constructor(repo?: FilesRepository) {
		this.repo = repo || new FilesRepository();
	}

	async findAll(query: FileQueryDTO): Promise<FileRecord[]> {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<FileRecord> {
		const file = await this.repo.findById(id);
		if (!file) throw AppError.notFound("File not found");
		return file;
	}

	async create(data: CreateFileDTO): Promise<FileRecord> {
		return this.repo.create(data);
	}

	async delete(id: string): Promise<void> {
		const file = await this.repo.findById(id);
		if (!file) throw AppError.notFound("File not found");
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete file");
	}

	async deleteByUploader(uploaderId: string): Promise<number> {
		return this.repo.deleteByUploader(uploaderId);
	}
}