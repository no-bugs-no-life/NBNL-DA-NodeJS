export interface Tag {
	_id: string;
	name: string;
	slug: string;
	isDeleted?: boolean;
	appIds?: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateTagDTO {
	name: string;
	slug?: string;
}

export interface UpdateTagDTO {
	name?: string;
	slug?: string;
}

export interface TagWithRelations extends Tag {
	appIds: string[];
}

export interface PaginatedTags {
	docs: Tag[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}
