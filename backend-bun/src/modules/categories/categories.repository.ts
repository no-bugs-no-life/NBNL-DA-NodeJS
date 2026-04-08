import type { ICategory } from "./categories.types";

export interface PaginationOptions {
	page: number;
	limit: number;
}

export interface ICategoryRepository {
	findAll(
		options: PaginationOptions,
	): Promise<{ docs: ICategory[]; totalDocs: number }>;
	findById(id: string): Promise<ICategory | null>;
	findBySlug(slug: string): Promise<ICategory | null>;
	create(
		data: Omit<ICategory, "_id" | "createdAt" | "updatedAt">,
	): Promise<ICategory>;
	update(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
	delete(id: string): Promise<boolean>;
}

export class CategoryRepository implements ICategoryRepository {
	private store: ICategory[] = [
		{
			_id: "1",
			name: "Game",
			iconUrl: "https://cdn.example.com/icons/game.png",
			parentId: null,
		},
		{
			_id: "2",
			name: "Ứng dụng",
			iconUrl: "https://cdn.example.com/icons/app.png",
			parentId: null,
		},
		{
			_id: "3",
			name: "Công cụ",
			iconUrl: "https://cdn.example.com/icons/tool.png",
			parentId: null,
		},
	];

	async findAll(
		options: PaginationOptions,
	): Promise<{ docs: ICategory[]; totalDocs: number }> {
		const { page, limit } = options;
		const start = (page - 1) * limit;
		const end = start + limit;
		const docs = this.store.slice(start, end);
		return { docs, totalDocs: this.store.length };
	}

	async findById(id: string): Promise<ICategory | null> {
		return this.store.find((c) => c._id === id) ?? null;
	}

	async findBySlug(slug: string): Promise<ICategory | null> {
		return (
			this.store.find(
				(c) => c.name.toLowerCase().replace(/\s+/g, "-") === slug,
			) ?? null
		);
	}

	async create(
		data: Omit<ICategory, "_id" | "createdAt" | "updatedAt">,
	): Promise<ICategory> {
		const category: ICategory = {
			_id: Date.now().toString(),
			name: data.name,
			iconUrl: data.iconUrl,
			parentId: data.parentId ?? null,
		};
		this.store.push(category);
		return category;
	}

	async update(
		id: string,
		data: Partial<ICategory>,
	): Promise<ICategory | null> {
		const index = this.store.findIndex((c) => c._id === id);
		if (index === -1) return null;

		const existing = this.store[index] as ICategory;
		const updated: ICategory = {
			_id: existing._id,
			name: data.name ?? existing.name,
			iconUrl: data.iconUrl ?? existing.iconUrl,
			parentId: data.parentId !== undefined ? data.parentId : existing.parentId,
		};
		this.store[index] = updated;
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		const index = this.store.findIndex((c) => c._id === id);
		if (index === -1) return false;
		this.store.splice(index, 1);
		return true;
	}
}
