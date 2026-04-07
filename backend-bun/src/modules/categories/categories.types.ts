export interface ICategory {
	id: string;
	name: string;
	slug: string;
	iconUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CategoryPublic {
	id: string;
	name: string;
	slug: string;
	iconUrl?: string;
	createdAt: Date;
	updatedAt: Date;
}

export const toPublicCategory = (cat: ICategory): CategoryPublic => ({
	id: cat.id,
	name: cat.name,
	slug: cat.slug,
	iconUrl: cat.iconUrl,
	createdAt: cat.createdAt,
	updatedAt: cat.updatedAt,
});
