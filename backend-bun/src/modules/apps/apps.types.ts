// App entity types
export interface App {
	_id: string;
	name: string;
	slug: string;
	description: string;
	iconUrl: string;
	price: number;
	status: AppStatus;
	deletedFromStatus?: AppStatus;
	developer: string;
	category: string;
	tags: string[];
	isDisabled: boolean;
	isDeleted: boolean;
	deletedAt?: Date | null;
	flags?: string[];
	priority?: number;
	createdAt: Date;
	updatedAt: Date;
}

// Enum types
export type AppStatus = "pending" | "published" | "rejected" | "archived" | "deleted";

// DTOs
export interface CreateAppDTO {
	name: string;
	slug?: string;
	description?: string;
	iconUrl?: string;
	price?: number;
	status?: AppStatus;
	developer: string;
	category: string;
	tags?: string[];
	flags?: string[];
	priority?: number;
}

export interface UpdateAppDTO {
	name?: string;
	slug?: string;
	description?: string;
	iconUrl?: string;
	price?: number;
	status?: AppStatus;
	category?: string;
	tags?: string[];
	isDisabled?: boolean;
	flags?: string[];
	priority?: number;
}

export interface AppFilters {
	status?: AppStatus;
	category?: string;
	developer?: string;
	tags?: string[];
	isDisabled?: boolean;
	isDeleted?: boolean;
	search?: string;
	page?: number;
	limit?: number;
	flags?: string[];
	priority?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

// Populated types for API responses
export interface DeveloperInfo {
	_id: string;
	name: string;
	contactEmail: string;
	avatarUrl?: string;
}

export interface CategoryInfo {
	_id: string;
	name: string;
}

export interface TagInfo {
	_id: string;
	name: string;
}

export interface AppWithRelations {
	_id: string;
	name: string;
	slug: string;
	description?: string;
	iconUrl?: string;
	price: number;
	status: AppStatus;
	deletedFromStatus?: AppStatus;
	developer: DeveloperInfo;
	category: CategoryInfo;
	tags?: TagInfo[];
	ratingScore?: number;
	ratingCount?: number;
	isDisabled?: boolean;
	isDeleted?: boolean;
	deletedAt?: string;
	flags?: string[];
	priority?: number;
	createdAt: string;
	updatedAt: string;
}

export interface PaginatedApps {
	docs: AppWithRelations[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}
