import type { FileType, IFile, OwnerType } from "./files.types";

export interface PaginationOptions {
	page: number;
	limit: number;
	ownerType?: OwnerType;
	ownerId?: string;
	fileType?: FileType;
}

export interface IFileRepository {
	findAll(
		options: PaginationOptions,
	): Promise<{ docs: IFile[]; totalDocs: number }>;
	findById(id: string): Promise<IFile | null>;
	create(
		data: Omit<IFile, "_id" | "createdAt" | "updatedAt" | "isDeleted">,
	): Promise<IFile>;
	update(id: string, data: Partial<IFile>): Promise<IFile | null>;
	delete(id: string): Promise<boolean>;
}

export class FileRepository implements IFileRepository {
	private store: IFile[] = [
		{
			_id: "1",
			ownerType: "app",
			ownerId: "app123",
			fileType: "icon",
			url: "/uploads/app123/icon.png",
			size: 102400,
			isDeleted: false,
			createdAt: new Date("2024-01-15"),
			updatedAt: new Date("2024-01-15"),
		},
		{
			_id: "2",
			ownerType: "user",
			ownerId: "user456",
			fileType: "avatar",
			url: "/uploads/user456/avatar.jpg",
			size: 51200,
			isDeleted: false,
			createdAt: new Date("2024-01-16"),
			updatedAt: new Date("2024-01-16"),
		},
		{
			_id: "3",
			ownerType: "developer",
			ownerId: "dev789",
			fileType: "apk",
			url: "/uploads/dev789/app.apk",
			size: 52428800,
			isDeleted: false,
			createdAt: new Date("2024-01-17"),
			updatedAt: new Date("2024-01-17"),
		},
		{
			_id: "4",
			ownerType: "app",
			ownerId: "app123",
			fileType: "screenshot",
			url: "/uploads/app123/screen1.png",
			size: 204800,
			isDeleted: false,
			createdAt: new Date("2024-01-18"),
			updatedAt: new Date("2024-01-18"),
		},
		{
			_id: "5",
			ownerType: "user",
			ownerId: "user101",
			fileType: "banner",
			url: "/uploads/user101/banner.png",
			size: 153600,
			isDeleted: false,
			createdAt: new Date("2024-01-19"),
			updatedAt: new Date("2024-01-19"),
		},
	];

	async findAll(
		options: PaginationOptions,
	): Promise<{ docs: IFile[]; totalDocs: number }> {
		let filtered = this.store.filter((f) => !f.isDeleted);

		if (options.ownerType) {
			filtered = filtered.filter((f) => f.ownerType === options.ownerType);
		}
		if (options.ownerId) {
			filtered = filtered.filter((f) => f.ownerId === options.ownerId);
		}
		if (options.fileType) {
			filtered = filtered.filter((f) => f.fileType === options.fileType);
		}

		const totalDocs = filtered.length;
		const start = (options.page - 1) * options.limit;
		const end = start + options.limit;
		const docs = filtered.slice(start, end);

		return { docs, totalDocs };
	}

	async findById(id: string): Promise<IFile | null> {
		return this.store.find((f) => f._id === id && !f.isDeleted) ?? null;
	}

	async create(
		data: Omit<IFile, "_id" | "createdAt" | "updatedAt" | "isDeleted">,
	): Promise<IFile> {
		const file: IFile = {
			_id: Date.now().toString(),
			...data,
			isDeleted: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		this.store.push(file);
		return file;
	}

	async update(id: string, data: Partial<IFile>): Promise<IFile | null> {
		const index = this.store.findIndex((f) => f._id === id && !f.isDeleted);
		if (index === -1) return null;

		const existing = this.store[index] as IFile;
		const updated: IFile = {
			...existing,
			...data,
			updatedAt: new Date(),
		};
		this.store[index] = updated;
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		const index = this.store.findIndex((f) => f._id === id && !f.isDeleted);
		if (index === -1) return false;
		(this.store[index] as IFile).isDeleted = true;
		return true;
	}
}
