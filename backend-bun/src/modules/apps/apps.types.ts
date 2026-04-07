// App entity types
export interface App {
	_id: string;
	name: string;
	slug: string;
	description: string;
	iconUrl: string;
	price: number;
	status: AppStatus;
	developer: string;
	category: string;
	tags: string[];
	ratingScore: number;
	ratingCount: number;
	isDisabled: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Enum types
export type AppStatus = "pending" | "published" | "rejected" | "archived";

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
	developer: DeveloperInfo;
	category: CategoryInfo;
	tags?: TagInfo[];
	ratingScore?: number;
	ratingCount?: number;
	isDisabled?: boolean;
	isDeleted?: boolean;
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
