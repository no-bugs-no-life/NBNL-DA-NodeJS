import mongoose from "mongoose";
import type {
	AdminReviewItem,
	CreateReviewDTO,
	Review,
	ReviewQueryRequest,
	UpdateReviewDTO,
} from "./reviews.types";

const COLLECTION = "reviews";

const reviewSchema = new mongoose.Schema<Review>(
	{
		appId: { type: String, required: true, index: true },
		userId: { type: String, required: true, index: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true, collection: COLLECTION },
);

// Compound index for user-app unique constraint
reviewSchema.index({ userId: 1, appId: 1 }, { unique: true });

export const ReviewModel =
	mongoose.models[COLLECTION] ||
	mongoose.model<Review>(COLLECTION, reviewSchema);

interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Helper to populate review with app and user info
const populateReview = (doc: unknown): AdminReviewItem | null => {
	if (!doc || typeof doc !== "object") return null;
	const d = doc as Record<string, unknown>;
	const appId = d.appId as Record<string, unknown>;
	const userId = d.userId as Record<string, unknown>;

	return {
		_id: d._id as string,
		appId: appId
			? { _id: appId._id as string, name: appId.name as string }
			: { _id: "", name: "" },
		userId: userId
			? {
					_id: userId._id as string,
					fullName: userId.fullName as string,
					email: userId.email as string | undefined,
					avatarUrl: userId.avatarUrl as string | undefined,
				}
			: { _id: "", fullName: "" },
		rating: d.rating as number,
		comment: d.comment as string,
		status: d.status as "pending" | "approved" | "rejected",
		createdAt: d.createdAt as Date,
	};
};

export class ReviewsRepository {
	async findAll(query: ReviewQueryRequest): Promise<PaginatedResult<Review>> {
		const filter: Record<string, unknown> = {};
		if (query.appId) filter.appId = query.appId;
		if (query.userId) filter.userId = query.userId;
		if (query.status) filter.status = query.status;

		const skip = (query.page - 1) * query.limit;
		const [data, total] = await Promise.all([
			ReviewModel.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(query.limit)
				.lean(),
			ReviewModel.countDocuments(filter),
		]);

		return {
			data,
			total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(total / query.limit),
		};
	}

	async findAllWithPopulate(query: ReviewQueryRequest): Promise<{
		docs: AdminReviewItem[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const filter: Record<string, unknown> = {};
		if (query.appId) filter.appId = query.appId;
		if (query.userId) filter.userId = query.userId;
		if (query.status) filter.status = query.status;

		const skip = (query.page - 1) * query.limit;
		const [data, total] = await Promise.all([
			ReviewModel.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(query.limit)
				.populate("appId", "_id name")
				.populate("userId", "_id fullName email avatarUrl")
				.lean(),
			ReviewModel.countDocuments(filter),
		]);

		return {
			docs: data.map(populateReview).filter(Boolean) as AdminReviewItem[],
			total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(total / query.limit),
		};
	}

	async findById(id: string): Promise<Review | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return ReviewModel.findById(id).lean();
	}

	async findByIdWithPopulate(id: string): Promise<AdminReviewItem | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		const doc = await ReviewModel.findById(id)
			.populate("appId", "_id name")
			.populate("userId", "_id fullName email avatarUrl")
			.lean();
		return doc ? populateReview(doc) : null;
	}

	async findByAppId(appId: string): Promise<Review[]> {
		return ReviewModel.find({ appId, status: "approved" })
			.sort({ createdAt: -1 })
			.lean();
	}

	async findByUserId(userId: string): Promise<Review[]> {
		return ReviewModel.find({ userId }).sort({ createdAt: -1 }).lean();
	}

	async create(data: CreateReviewDTO): Promise<Review> {
		const review = await ReviewModel.create(data);
		return review.toObject();
	}

	async update(id: string, data: UpdateReviewDTO): Promise<Review | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return ReviewModel.findByIdAndUpdate(id, data, { new: true }).lean();
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await ReviewModel.findByIdAndDelete(id);
		return result !== null;
	}

	async existsByUserAndApp(userId: string, appId: string): Promise<boolean> {
		const count = await ReviewModel.countDocuments({ userId, appId });
		return count > 0;
	}

	async getAverageRating(
		appId: string,
	): Promise<{ average: number; count: number }> {
		const result = await ReviewModel.aggregate([
			{ $match: { appId, status: "approved" } },
			{
				$group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } },
			},
		]);
		if (result.length === 0) return { average: 0, count: 0 };
		return {
			average: Math.round(result[0].average * 10) / 10,
			count: result[0].count,
		};
	}
}
