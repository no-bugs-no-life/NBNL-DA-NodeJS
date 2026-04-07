import type { ICategory } from "./categories.types";

export interface ICategoryRepository {
	findAll(): Promise<ICategory[]>;
	findById(id: string): Promise<ICategory | null>;
	findBySlug(slug: string): Promise<ICategory | null>;
	create(data: Omit<ICategory, "id" | "createdAt" | "updatedAt">): Promise<ICategory>;
	update(id: string, data: Partial<ICategory>): Promise<ICategory | null>;
	delete(id: string): Promise<boolean>;
}

export class CategoryRepository implements ICategoryRepository {
	private store: ICategory[] = [
		{
			id: "1",
			name: "Game",
			slug: "game",
			iconUrl: "https://cdn.example.com/icons/game.png",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
		{
			id: "2",
			name: "Ứng dụng",
			slug: "ung-dung",
			iconUrl: "https://cdn.example.com/icons/app.png",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	];

	async findAll(): Promise<ICategory[]> {
		return this.store;
	}

	async findById(id: string): Promise<ICategory | null> {
		return this.store.find((c) => c.id === id) ?? null;
	}

	async findBySlug(slug: string): Promise<ICategory | null> {
		return this.store.find((c) => c.slug === slug) ?? null;
	}

	async create(data: Omit<ICategory, "id" | "createdAt" | "updatedAt">): Promise<ICategory> {
		const category: ICategory = {
			id: Date.now().toString(),
			name: data.name,
			slug: data.slug,
			iconUrl: data.iconUrl,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		this.store.push(category);
		return category;
	}

	async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
		const index = this.store.findIndex((c) => c.id === id);
		if (index === -1) return null;

		const existing = this.store[index]!;
		const updated: ICategory = {
			id: existing.id,
			name: data.name ?? existing.name,
			slug: data.slug ?? existing.slug,
			iconUrl: data.iconUrl !== undefined ? data.iconUrl : existing.iconUrl,
			createdAt: existing.createdAt,
			updatedAt: new Date(),
		};
		this.store[index] = updated;
		return updated;
	}

	async delete(id: string): Promise<boolean> {
		const index = this.store.findIndex((c) => c.id === id);
		if (index === -1) return false;
		this.store.splice(index, 1);
		return true;
	}
}
