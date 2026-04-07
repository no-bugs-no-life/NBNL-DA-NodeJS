import mongoose from "mongoose";
import type {
	AppInfo,
	CreateSubscriptionDTO,
	PackageInfo,
	Subscription,
	SubscriptionQueryDTO,
	SubscriptionWithRelations,
	UpdateSubscriptionDTO,
	UserInfo,
} from "./subscriptions.types";

const COLLECTION = "subscriptions";

const subscriptionSchema = new mongoose.Schema<Subscription>(
	{
		user: { type: String, required: true, index: true },
		app: { type: String, required: true, index: true },
		subPackage: { type: String, required: true, index: true },
		status: {
			type: String,
			enum: ["active", "expired", "cancelled"],
			default: "active",
		},
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true, collection: COLLECTION },
);

// Compound indexes
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ app: 1, status: 1 });

export const SubscriptionModel =
	(mongoose.models[COLLECTION] as mongoose.Model<Subscription>) ||
	mongoose.model<Subscription>(COLLECTION, subscriptionSchema);

interface PaginatedSubscriptionsResult {
	docs: SubscriptionWithRelations[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}

export class SubscriptionsRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: Required by mongoose
		return mongoose.connection.db!;
	}

	async findAll(
		query: SubscriptionQueryDTO & { page?: number; limit?: number },
	): Promise<PaginatedSubscriptionsResult> {
		const filter: Record<string, unknown> = { isDeleted: false };

		if (query.user) filter.user = query.user;
		if (query.app) filter.app = query.app;
		if (query.subPackage) filter.subPackage = query.subPackage;
		if (query.status) filter.status = query.status;

		const page = query.page || 1;
		const limit = query.limit || 10;
		const skip = (page - 1) * limit;

		const [docs, totalDocs] = await Promise.all([
			SubscriptionModel.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			SubscriptionModel.countDocuments(filter),
		]);

		// Populate relations
		const populated = await this.populateRelations(
			docs as unknown as Subscription[],
		);

		return {
			docs: populated,
			totalDocs,
			limit,
			totalPages: Math.ceil(totalDocs / limit),
			page,
		};
	}

	async findById(id: string): Promise<Subscription | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return SubscriptionModel.findOne({ _id: id, isDeleted: false }).lean();
	}

	async findActiveByUserId(user: string): Promise<Subscription | null> {
		return SubscriptionModel.findOne({
			user,
			status: "active",
			isDeleted: false,
		})
			.sort({ endDate: -1 })
			.lean();
	}

	async findByUserId(user: string): Promise<Subscription[]> {
		return SubscriptionModel.find({ user, isDeleted: false })
			.sort({ createdAt: -1 })
			.lean();
	}

	async create(data: CreateSubscriptionDTO): Promise<Subscription> {
		const subscription = await SubscriptionModel.create({
			...data,
			status: "active",
			isDeleted: false,
		});
		return subscription.toObject();
	}

	async update(
		id: string,
		data: UpdateSubscriptionDTO,
	): Promise<Subscription | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return SubscriptionModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			data,
			{ new: true },
		).lean();
	}

	async cancel(id: string): Promise<Subscription | null> {
		return this.update(id, { status: "cancelled" });
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await SubscriptionModel.findOneAndUpdate(
			{ _id: id, isDeleted: false },
			{ isDeleted: true },
		);
		return result !== null;
	}

	async findByIdWithRelations(
		id: string,
	): Promise<SubscriptionWithRelations | null> {
		const subscription = await this.findById(id);
		if (!subscription) return null;
		const populated = await this.populateRelations([subscription]);
		return populated[0] || null;
	}

	async hasActiveSubscription(
		user: string,
		subPackage?: string,
	): Promise<boolean> {
		const query: Record<string, unknown> = {
			user,
			status: "active",
			isDeleted: false,
		};
		if (subPackage) query.subPackage = subPackage;
		const count = await SubscriptionModel.countDocuments(query);
		return count > 0;
	}

	/**
	 * Populate user, app, and package relations
	 */
	private async populateRelations(
		subscriptions: Subscription[],
	): Promise<SubscriptionWithRelations[]> {
		if (subscriptions.length === 0) return [];

		const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);
		const userIds = subscriptions
			.map((s) => s.user)
			.filter((id) => mongoose.Types.ObjectId.isValid(id))
			.map(toObjectId);
		const appIds = subscriptions
			.map((s) => s.app)
			.filter((id) => mongoose.Types.ObjectId.isValid(id))
			.map(toObjectId);
		const packageIds = subscriptions
			.map((s) => s.subPackage)
			.filter((id) => mongoose.Types.ObjectId.isValid(id))
			.map(toObjectId);

		// Fetch related data
		const [users, apps, packages] = await Promise.all([
			userIds.length > 0
				? this.db
					.collection("users")
					.find({ _id: { $in: userIds } })
					.project({ _id: 1, fullName: 1, email: 1, avatar: 1 })
					.toArray()
				: [],
			appIds.length > 0
				? this.db
					.collection("apps")
					.find({ _id: { $in: appIds } })
					.project({ _id: 1, name: 1, iconUrl: 1 })
					.toArray()
				: [],
			packageIds.length > 0
				? this.db
					.collection("sub_packages")
					.find({ _id: { $in: packageIds } })
					.project({ _id: 1, name: 1, type: 1, price: 1, durationDays: 1 })
					.toArray()
				: [],
		]);

		const userMap = new Map<string, UserInfo>(
			users.map((u) => [
				u._id.toString(),
				{
					_id: u._id.toString(),
					fullName: (u as { fullName?: string }).fullName || "Unknown",
					email: (u as { email?: string }).email || "",
					avatarUrl: (u as { avatar?: string }).avatar,
				},
			]),
		);

		const appMap = new Map<string, AppInfo>(
			apps.map((a) => [
				a._id.toString(),
				{
					_id: a._id.toString(),
					name: (a as { name: string }).name,
					iconUrl: (a as { iconUrl?: string }).iconUrl,
				},
			]),
		);

		const packageMap = new Map<string, PackageInfo>(
			packages.map((p) => [
				p._id.toString(),
				{
					_id: p._id.toString(),
					name: (p as { name: string }).name,
					type: (p as { type: "monthly" | "yearly" | "lifetime" }).type,
					price: (p as { price: number }).price,
					durationDays: (p as { durationDays: number }).durationDays,
				},
			]),
		);

		return subscriptions.map((sub) => {
			const user = userMap.get(sub.user);
			const app = appMap.get(sub.app);
			const pkg = packageMap.get(sub.subPackage);

			return {
				_id: sub._id,
				user: user || { _id: sub.user, fullName: "Unknown", email: "" },
				app: app || { _id: sub.app, name: "Unknown" },
				packageId: pkg || {
					_id: sub.subPackage,
					name: "Unknown",
					type: "monthly",
					price: 0,
					durationDays: 0,
				},
				startDate:
					sub.startDate instanceof Date
						? sub.startDate.toISOString()
						: String(sub.startDate),
				endDate:
					sub.endDate instanceof Date
						? sub.endDate.toISOString()
						: String(sub.endDate),
				status: sub.status,
				isDeleted: sub.isDeleted,
				createdAt:
					sub.createdAt instanceof Date
						? sub.createdAt.toISOString()
						: String(sub.createdAt),
				updatedAt:
					sub.updatedAt instanceof Date
						? sub.updatedAt.toISOString()
						: String(sub.updatedAt),
			};
		});
	}
}
