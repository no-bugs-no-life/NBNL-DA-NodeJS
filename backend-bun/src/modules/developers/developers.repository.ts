import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import type {
	CreateDeveloperDTO,
	Developer,
	DeveloperPermissions,
	DeveloperQuery,
	DeveloperResponse,
	DeveloperStats,
	UpdateDeveloperDTO,
} from "./developers.types";

const COLLECTION = "developers";

const DEFAULT_PERMISSIONS: DeveloperPermissions = {
	canPublishApp: false,
	canEditOwnApps: false,
	canDeleteOwnApps: false,
	canViewAnalytics: false,
	canManagePricing: false,
	canRespondReviews: false,
};

export class DevelopersRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: Required by mongoose
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection(COLLECTION);
	}

	async findAll(
		query: DeveloperQuery,
	): Promise<{ developers: DeveloperResponse[]; total: number }> {
		const {
			page = 1,
			limit = 20,
			sortBy = "createdAt",
			order = -1,
			status,
			search,
		} = query;

		const filter: Record<string, unknown> = { isDeleted: { $ne: true } };
		if (status) filter.status = status;
		if (search) {
			filter.$or = [
				{ name: { $regex: search, $options: "i" } },
				{ contactEmail: { $regex: search, $options: "i" } },
			];
		}

		const skip = (page - 1) * limit;
		const sort: Record<string, 1 | -1> = { [sortBy]: order as 1 | -1 };

		const [docs, total] = await Promise.all([
			this.collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(),
			this.collection.countDocuments(filter),
		]);

		const developers = await this.populateDevelopers(docs as Developer[]);
		return { developers, total };
	}

	async findById(id: string): Promise<DeveloperResponse | null> {
		if (!ObjectId.isValid(id)) return null;
		const doc = await this.collection.findOne({
			_id: new ObjectId(id),
			isDeleted: { $ne: true },
		});
		if (!doc) return null;

		const [dev] = await this.populateDevelopers([doc as Developer]);
		return dev ?? null;
	}

	async findByUserId(userId: string): Promise<DeveloperResponse | null> {
		if (!ObjectId.isValid(userId)) return null;
		const doc = await this.collection.findOne({
			userId: new ObjectId(userId),
			isDeleted: { $ne: true },
		});
		if (!doc) return null;

		const [dev] = await this.populateDevelopers([doc as Developer]);
		return dev ?? null;
	}

	async create(data: CreateDeveloperDTO): Promise<Developer> {
		const developer: Omit<Developer, "_id"> = {
			userId: new ObjectId(data.userId),
			name: data.name || "",
			bio: data.bio || "",
			website: data.website || "",
			avatarUrl: data.avatarUrl || "",
			isDeleted: false,
			status: "pending",
			rejectionReason: "",
			permissions: DEFAULT_PERMISSIONS,
			contactEmail: data.contactEmail || "",
			socialLinks: data.socialLinks || {},
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await this.collection.insertOne(
			developer as Record<string, unknown>,
		);
		return { _id: result.insertedId, ...developer };
	}

	async update(
		id: string,
		data: UpdateDeveloperDTO,
	): Promise<Developer | null> {
		if (!ObjectId.isValid(id)) return null;

		const updateData: Record<string, unknown> = {
			...data,
			updatedAt: new Date(),
		};
		if (updateData.permissions) {
			// Merge with existing permissions
			const existing = await this.collection.findOne({ _id: new ObjectId(id) });
			updateData.permissions = {
				...existing?.permissions,
				...updateData.permissions,
			};
		}

		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id), isDeleted: { $ne: true } },
			{ $set: updateData },
			{ returnDocument: "after" },
		);

		return result as Developer | null;
	}

	async approve(
		id: string,
		approvedBy: string,
		permissions?: Partial<DeveloperPermissions>,
	): Promise<Developer | null> {
		if (!ObjectId.isValid(id) || !ObjectId.isValid(approvedBy)) return null;

		const updateData: Record<string, unknown> = {
			status: "approved",
			approvedBy: new ObjectId(approvedBy),
			approvedAt: new Date(),
			updatedAt: new Date(),
		};

		if (permissions) {
			updateData.permissions = { ...DEFAULT_PERMISSIONS, ...permissions };
		}

		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id), isDeleted: { $ne: true } },
			{ $set: updateData },
			{ returnDocument: "after" },
		);

		return result as Developer | null;
	}

	async reject(id: string, reason: string): Promise<Developer | null> {
		if (!ObjectId.isValid(id)) return null;

		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id), isDeleted: { $ne: true } },
			{
				$set: {
					status: "rejected",
					rejectionReason: reason,
					updatedAt: new Date(),
				},
			},
			{ returnDocument: "after" },
		);

		return result as Developer | null;
	}

	async revoke(id: string, reason?: string): Promise<Developer | null> {
		if (!ObjectId.isValid(id)) return null;

		// Revoke = revert to pending or mark as rejected
		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id), isDeleted: { $ne: true } },
			{
				$set: {
					status: "rejected",
					rejectionReason: reason || "Developer access revoked",
					permissions: DEFAULT_PERMISSIONS,
					updatedAt: new Date(),
				},
			},
			{ returnDocument: "after" },
		);

		return result as Developer | null;
	}

	async updatePermissions(
		id: string,
		permissions: Partial<DeveloperPermissions>,
	): Promise<Developer | null> {
		if (!ObjectId.isValid(id)) return null;

		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id), isDeleted: { $ne: true } },
			{
				$set: {
					permissions: { ...DEFAULT_PERMISSIONS, ...permissions },
					updatedAt: new Date(),
				},
			},
			{ returnDocument: "after" },
		);

		return result as Developer | null;
	}

	async softDelete(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { isDeleted: true, updatedAt: new Date() } },
		);
		return result.modifiedCount > 0;
	}

	/**
	 * Get apps stats for a developer
	 */
	async getDeveloperStats(userId: string): Promise<DeveloperStats> {
		if (!ObjectId.isValid(userId)) {
			return {
				totalApps: 0,
				publishedApps: 0,
				totalDownloads: 0,
				avgRating: 0,
			};
		}

		const [statsAgg] = await this.db
			.collection("apps")
			.aggregate([
				{ $match: { developerId: userId, isDeleted: { $ne: true } } },
				{
					$group: {
						_id: null,
						totalApps: { $sum: 1 },
						publishedApps: {
							$sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
						},
						avgRating: { $avg: "$ratingScore" },
					},
				},
			])
			.toArray();

		return {
			totalApps: statsAgg?.totalApps || 0,
			publishedApps: statsAgg?.publishedApps || 0,
			totalDownloads: 0, // TODO: calculate from orders/downloads
			avgRating: statsAgg?.avgRating || 0,
		};
	}

	/**
	 * Populate developer with user info and stats
	 */
	private async populateDevelopers(
		docs: Developer[],
	): Promise<DeveloperResponse[]> {
		if (docs.length === 0) return [];

		const userIds = [...new Set(docs.map((d) => d.userId.toString()))];
		const approverIds = [
			...new Set(
				docs.filter((d) => d.approvedBy).map((d) => d.approvedBy?.toString()),
			),
		];

		// Fetch users
		const [users, approvers] = await Promise.all([
			userIds.length > 0
				? this.db
					.collection("users")
					.find({
						_id: { $in: userIds.map((id) => new ObjectId(id)) },
					})
					.project({
						_id: 1,
						fullName: 1,
						email: 1,
						avatar: 1,
					})
					.toArray()
				: [],
			approverIds.length > 0
				? this.db
					.collection("users")
					.find({
						_id: { $in: approverIds.map((id) => new ObjectId(id)) },
					})
					.project({
						_id: 1,
						fullName: 1,
						email: 1,
					})
					.toArray()
				: [],
		]);

		const userMap = new Map(users.map((u) => [u._id.toString(), u]));
		const approverMap = new Map(approvers.map((a) => [a._id.toString(), a]));

		// Get stats for each developer
		const statsPromises = docs.map((d) =>
			this.getDeveloperStats(d.userId.toString()),
		);
		const allStats = await Promise.all(statsPromises);

		return docs.map((doc, idx) => ({
			_id: doc._id?.toString() ?? "",
			userId: {
				_id: doc.userId.toString(),
				fullName: userMap.get(doc.userId.toString())?.fullName,
				email: userMap.get(doc.userId.toString())?.email,
				avatarUrl: userMap.get(doc.userId.toString())?.avatar as string,
			},
			name: doc.name,
			bio: doc.bio,
			website: doc.website,
			avatarUrl: doc.avatarUrl,
			apps: [],
			isDeleted: doc.isDeleted,
			status: doc.status,
			rejectionReason: doc.rejectionReason,
			permissions: doc.permissions,
			contactEmail: doc.contactEmail,
			socialLinks: doc.socialLinks,
			stats: allStats[idx] as DeveloperStats,
			approvedBy: doc.approvedBy
				? {
					_id: doc.approvedBy.toString(),
					fullName: approverMap.get(doc.approvedBy.toString())?.fullName,
					email: approverMap.get(doc.approvedBy.toString())?.email,
				}
				: null,
			approvedAt: doc.approvedAt?.toISOString(),
			createdAt: doc.createdAt?.toISOString(),
			updatedAt: doc.updatedAt?.toISOString(),
		}));
	}
}
