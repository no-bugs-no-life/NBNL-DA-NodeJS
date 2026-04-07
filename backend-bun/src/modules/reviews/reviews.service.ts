import { AppError } from "@/shared/errors";
import type { Review, CreateReviewDTO, UpdateReviewDTO, ReviewQueryRequest } from "./reviews.types";
import { ReviewsRepository } from "./reviews.repository";

export class ReviewsService {
	private repo: ReviewsRepository;

	constructor(repo?: ReviewsRepository) {
		this.repo = repo || new ReviewsRepository();
	}

	async findAll(query: ReviewQueryRequest) {
		return this.repo.findAll(query);
	}

	async findById(id: string): Promise<Review> {
		const review = await this.repo.findById(id);
		if (!review) throw AppError.notFound("Review not found");
		return review;
	}

	async findByAppId(appId: string): Promise<Review[]> {
		return this.repo.findByAppId(appId);
	}

	async findByUserId(userId: string): Promise<Review[]> {
		return this.repo.findByUserId(userId);
	}

	async create(data: CreateReviewDTO): Promise<Review> {
		if (await this.repo.existsByUserAndApp(data.userId, data.appId)) {
			throw AppError.conflict("You have already reviewed this app");
		}
		return this.repo.create(data);
	}

	async update(id: string, data: UpdateReviewDTO): Promise<Review> {
		await this.findById(id);
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("Review not found");
		return updated;
	}

	async updateStatus(id: string, status: "pending" | "approved" | "rejected"): Promise<Review> {
		return this.update(id, { status });
	}

	async delete(id: string): Promise<void> {
		await this.findById(id);
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete review");
	}

	async getAppRating(appId: string) {
		return this.repo.getAverageRating(appId);
	}
}