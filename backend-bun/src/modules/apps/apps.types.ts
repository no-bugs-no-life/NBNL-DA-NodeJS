// App entity types
export interface App {
	_id: string;
	name: string;
	slug: string;
	description: string;
	iconUrl: string;
	price: number;
	status: AppStatus;
	developerId: string;
	categoryId: string;
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
	description: string;
	iconUrl: string;
	price: number;
	status?: AppStatus;
	developerId: string;
	categoryId: string;
	tags?: string[];
}

export interface UpdateAppDTO {
	name?: string;
	slug?: string;
	description?: string;
	iconUrl?: string;
	price?: number;
	status?: AppStatus;
	categoryId?: string;
	tags?: string[];
	isDisabled?: boolean;
}

export interface AppFilters {
	status?: AppStatus;
	categoryId?: string;
	developerId?: string;
	tags?: string[];
	isDisabled?: boolean;
	search?: string;
}

export interface AppWithRelations extends App {
	developer?: {
		_id: string;
		username: string;
		fullName: string;
		avatar?: string;
	};
	category?: {
		_id: string;
		name: string;
		slug: string;
	};
	categoryTags?: Array<{
		_id: string;
		name: string;
		slug: string;
	}>;
}
