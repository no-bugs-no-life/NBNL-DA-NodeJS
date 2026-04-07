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
		app: { type: String, required: true, index: true },
		user: { type: String, required: true, index: true },
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
reviewSchema.index({ user: 1, app: 1 }, { unique: true });

export const ReviewModel =
	(mongoose.models[COLLECTION] as mongoose.Model<Review>) ||
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
	const app = d.app as Record<string, unknown>;
	const user = d.user as Record<string, unknown>;

	return {
		_id: d._id as string,
		app: app
			? { _id: app._id as string, name: app.name as string }
			: { _id: "", name: "" },
		user: user
			? {
				_id: user._id as string,
				fullName: user.fullName as string,
				email: user.email as string | undefined,
				avatarUrl: user.avatarUrl as string | undefined,
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
		if (query.app) filter.app = query.app;
		if (query.user) filter.user = query.user;
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
		if (query.app) filter.app = query.app;
		if (query.user) filter.user = query.user;
		if (query.status) filter.status = query.status;

		const skip = (query.page - 1) * query.limit;
		const [data, total] = await Promise.all([
			ReviewModel.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(query.limit)
				.populate("app", "_id name")
				.populate("user", "_id fullName email avatarUrl")
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
			.populate("app", "_id name")
			.populate("user", "_id fullName email avatarUrl")
			.lean();
		return doc ? populateReview(doc) : null;
	}

	async findByAppId(app: string): Promise<Review[]> {
		return ReviewModel.find({ app, status: "approved" })
			.sort({ createdAt: -1 })
			.lean();
	}

	async findByUserId(user: string): Promise<Review[]> {
		return ReviewModel.find({ user }).sort({ createdAt: -1 }).lean();
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

	async existsByUserAndApp(user: string, app: string): Promise<boolean> {
		const count = await ReviewModel.countDocuments({ user, app });
		return count > 0;
	}

	async getAverageRating(
		app: string,
	): Promise<{ average: number; count: number }> {
		const result = await ReviewModel.aggregate([
			{ $match: { app, status: "approved" } },
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
