import mongoose from "mongoose";
import type { FileRecord, CreateFileDTO, FileQueryDTO } from "./files.types";

const COLLECTION = "files";

const fileSchema = new mongoose.Schema<FileRecord>(
	{
		uploaderId: { type: String, required: true, index: true },
		url: { type: String, required: true },
		fileKey: { type: String, required: true },
		mimeType: { type: String, required: true },
		size: { type: Number, required: true, min: 0 },
	},
	{ timestamps: { createdAt: true, updatedAt: false }, collection: COLLECTION },
);

export const FileModel = mongoose.models[COLLECTION] || mongoose.model<FileRecord>(COLLECTION, fileSchema);

export class FilesRepository {
	async findAll(query: FileQueryDTO): Promise<FileRecord[]> {
		const filter: Record<string, unknown> = {};
		if (query.uploaderId) filter.uploaderId = query.uploaderId;
		if (query.mimeType) filter.mimeType = query.mimeType;
		return FileModel.find(filter).sort({ createdAt: -1 }).lean();
	}

	async findById(id: string): Promise<FileRecord | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return FileModel.findById(id).lean();
	}

	async create(data: CreateFileDTO): Promise<FileRecord> {
		const file = await FileModel.create(data);
		return file.toObject();
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await FileModel.findByIdAndDelete(id);
		return result !== null;
	}

	async deleteByUploader(uploaderId: string): Promise<number> {
		const result = await FileModel.deleteMany({ uploaderId });
		return result.deletedCount;
	}
}