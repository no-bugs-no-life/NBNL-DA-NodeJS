export interface Review {
	_id: string;
	app: string;
	user: string;
	rating: number;
	comment: string;
	status: ReviewStatus;
	createdAt: Date;
	updatedAt: Date;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface CreateReviewDTO {
	app: string;
	user: string;
	rating: number;
	comment: string;
}

export interface UpdateReviewDTO {
	rating?: number;
	comment?: string;
	status?: ReviewStatus;
}

export interface ReviewWithUser extends Omit<Review, "user" | "app"> {
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
	app: ReviewApp;
	user: ReviewUser;
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

export interface ReviewQueryRequest {
	app?: string;
	user?: string;
	status?: ReviewStatus;
	page?: number;
	limit?: number;
}
