export interface ICategory {
	_id: string;
	name: string;
	iconUrl: string;
	parentId?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface CategoryPublic {
	_id: string;
	name: string;
	iconUrl: string;
	parentId?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface PaginatedCategories {
	docs: CategoryPublic[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

export const toPublicCategory = (cat: ICategory): CategoryPublic => ({
	_id: cat._id,
	name: cat.name,
	iconUrl: cat.iconUrl,
	parentId: cat.parentId,
	createdAt: cat.createdAt,
	updatedAt: cat.updatedAt,
});
