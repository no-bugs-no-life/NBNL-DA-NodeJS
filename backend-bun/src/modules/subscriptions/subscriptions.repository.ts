import mongoose from "mongoose";
import type {
	Subscription,
	CreateSubscriptionDTO,
	UpdateSubscriptionDTO,
	SubscriptionQueryDTO,
} from "./subscriptions.types";

const COLLECTION = "subscriptions";

const subscriptionSchema = new mongoose.Schema<Subscription>(
	{
		userId: { type: String, required: true, index: true },
		subPackageId: { type: String, required: true, index: true },
		status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
	},
	{ timestamps: true, collection: COLLECTION },
);

// Compound index for user subscription queries
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const SubscriptionModel =
	mongoose.models[COLLECTION] || mongoose.model<Subscription>(COLLECTION, subscriptionSchema);

interface PaginatedResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export class SubscriptionsRepository {
	async findAll(query: SubscriptionQueryDTO & { page?: number; limit?: number }): Promise<PaginatedResult<Subscription>> {
		const filter: Record<string, unknown> = {};
		if (query.userId) filter.userId = query.userId;
		if (query.subPackageId) filter.subPackageId = query.subPackageId;
		if (query.status) filter.status = query.status;

		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			SubscriptionModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
			SubscriptionModel.countDocuments(filter),
		]);

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async findById(id: string): Promise<Subscription | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return SubscriptionModel.findById(id).lean();
	}

	async findActiveByUserId(userId: string): Promise<Subscription | null> {
		return SubscriptionModel.findOne({ userId, status: "active" }).sort({ endDate: -1 }).lean();
	}

	async findByUserId(userId: string): Promise<Subscription[]> {
		return SubscriptionModel.find({ userId }).sort({ createdAt: -1 }).lean();
	}

	async create(data: CreateSubscriptionDTO): Promise<Subscription> {
		const subscription = await SubscriptionModel.create({
			...data,
			status: "active",
		});
		return subscription.toObject();
	}

	async update(id: string, data: UpdateSubscriptionDTO): Promise<Subscription | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return SubscriptionModel.findByIdAndUpdate(id, data, { new: true }).lean();
	}

	async cancel(id: string): Promise<Subscription | null> {
		return this.update(id, { status: "cancelled" });
	}

	async expire(id: string): Promise<Subscription | null> {
		return this.update(id, { status: "expired" });
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await SubscriptionModel.findByIdAndDelete(id);
		return result !== null;
	}

	async hasActiveSubscription(userId: string, subPackageId?: string): Promise<boolean> {
		const query: Record<string, unknown> = { userId, status: "active" };
		if (subPackageId) query.subPackageId = subPackageId;
		const count = await SubscriptionModel.countDocuments(query);
		return count > 0;
	}
}