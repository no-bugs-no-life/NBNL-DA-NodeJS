export interface Review {
	_id: string;
	appId: string;
	userId: string;
	rating: number;
	comment: string;
	status: ReviewStatus;
	createdAt: Date;
	updatedAt: Date;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface CreateReviewDTO {
	appId: string;
	userId: string;
	rating: number;
	comment: string;
}

export interface UpdateReviewDTO {
	rating?: number;
	comment?: string;
	status?: ReviewStatus;
}

export interface ReviewWithUser extends Review {
	user?: {
		_id: string;
		fullName: string;
		avatar?: string;
	};
}

// Admin types for populated reviews
export interface ReviewApp {
	_id: string;
	name: string;
}

export interface ReviewUser {
	_id: string;
	fullName: string;
	email?: string;
	avatarUrl?: string;
}

export interface AdminReviewItem {
	_id: string;
	appId: ReviewApp;
	userId: ReviewUser;
	rating: number;
	comment: string;
	status: ReviewStatus;
	createdAt: Date;
}

export interface PaginatedReviews {
	docs: AdminReviewItem[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}
