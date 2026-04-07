import type { ObjectId } from "mongodb";

// Developer status enum
export type DeveloperStatus = "pending" | "approved" | "rejected";

// Developer permissions
export interface DeveloperPermissions {
	canPublishApp: boolean;
	canEditOwnApps: boolean;
	canDeleteOwnApps: boolean;
	canViewAnalytics: boolean;
	canManagePricing: boolean;
	canRespondReviews: boolean;
}

// Developer stats (from apps aggregation)
export interface DeveloperStats {
	totalApps: number;
	publishedApps: number;
	totalDownloads: number;
	avgRating: number;
}

// Main Developer interface
export interface Developer {
	_id?: ObjectId;
	userId: ObjectId;
	name: string;
	bio: string;
	website: string;
	avatarUrl: string;
	isDeleted: boolean;
	status: DeveloperStatus;
	rejectionReason: string;
	permissions: DeveloperPermissions;
	contactEmail: string;
	socialLinks: Record<string, string>;
	approvedBy?: ObjectId;
	approvedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

// DTO for API requests
export interface CreateDeveloperDTO {
	userId: string;
	name?: string;
	bio?: string;
	website?: string;
	avatarUrl?: string;
	contactEmail?: string;
	socialLinks?: Record<string, string>;
}

export interface UpdateDeveloperDTO {
	name?: string;
	bio?: string;
	website?: string;
	avatarUrl?: string;
	contactEmail?: string;
	socialLinks?: Record<string, string>;
	permissions?: Partial<DeveloperPermissions>;
}

export interface ApproveDeveloperDTO {
	permissions?: Partial<DeveloperPermissions>;
}

export interface RejectDeveloperDTO {
	reason: string;
}

export interface RevokeDeveloperDTO {
	reason?: string;
}

// Query params for listing
export interface DeveloperQuery {
	page?: number;
	limit?: number;
	sortBy?: string;
	order?: number;
	status?: DeveloperStatus;
	search?: string;
}

// Populated response type (for frontend)
export interface DeveloperResponse {
	_id: string;
	userId: {
		_id: string;
		fullName?: string;
		email?: string;
		avatarUrl?: string;
	};
	name: string;
	bio: string;
	website: string;
	avatarUrl: string;
	apps: unknown[];
	isDeleted: boolean;
	status: DeveloperStatus;
	rejectionReason: string;
	permissions: DeveloperPermissions;
	contactEmail: string;
	socialLinks: Record<string, string>;
	stats: DeveloperStats;
	approvedBy?: { _id: string; fullName?: string; email?: string } | null;
	approvedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Paginated response
export interface PaginatedDevelopers {
	docs: DeveloperResponse[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}
