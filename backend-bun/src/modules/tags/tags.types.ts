export interface Tag {
	_id: string;
	name: string;
	slug: string;
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
