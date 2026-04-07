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