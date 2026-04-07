import { ObjectId, type WithId } from "mongodb";
import mongoose from "mongoose";
import type {
	App,
	AppFilters,
	AppWithRelations,
	CreateAppDTO,
	PaginatedApps,
	UpdateAppDTO,
} from "./apps.types";

const COLLECTION = "apps";

function toDocument(app: Partial<App>) {
	return {
		...app,
		developer: app.developer ? new ObjectId(app.developer) : undefined,
		category: app.category ? new ObjectId(app.category) : undefined,
		tags:
			app.tags?.map((t) => (ObjectId.isValid(t) ? new ObjectId(t) : t)) || [],
		createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
		updatedAt: new Date(),
	};
}

interface UserDoc {
	_id: ObjectId;
	fullName?: string;
	username?: string;
	email?: string;
	avatar?: string;
}

interface DeveloperSpaceDoc {
	_id: ObjectId;
	userId: ObjectId;
	name?: string;
	contactEmail?: string;
	avatarUrl?: string;
	status?: string;
	isDeleted?: boolean;
}

interface CategoryDoc {
	_id: ObjectId;
	name: string;
}

interface TagDoc {
	_id: ObjectId;
	name: string;
}

export class AppsRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: Required by mongoose
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection(COLLECTION);
	}

	async findAll(
		filters?: AppFilters,
		page = 1,
		limit = 20,
	): Promise<PaginatedApps> {
		const query: Record<string, unknown> = {};

		// Default: exclude deleted unless explicitly requested
		if (filters?.isDeleted === undefined) {
			query.isDeleted = { $ne: true };
		} else {
			query.isDeleted = filters.isDeleted;
		}

		if (filters?.status) query.status = filters.status;
		if (filters?.category)
			query.category = new ObjectId(filters.category);
		if (filters?.developer)
			query.developer = new ObjectId(filters.developer);
		if (filters?.isDisabled !== undefined)
			query.isDisabled = filters.isDisabled;

		if (filters?.tags?.length) {
			query.tags = { $in: filters.tags.map((t) => new ObjectId(t)) };
		}

		if (filters?.search) {
			query.$or = [
				{ name: { $regex: filters.search, $options: "i" } },
				{ description: { $regex: filters.search, $options: "i" } },
			];
		}

		if (filters?.flags?.length) {
			query.flags = { $in: filters.flags };
		}

		const sortField = filters?.sortBy || "createdAt";
		const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;

		const skip = (page - 1) * limit;
		const [docs, totalDocs] = await Promise.all([
			this.collection
				.find(query)
				.sort({ [sortField]: sortOrder })
				.skip(skip)
				.limit(limit)
				.toArray(),
			this.collection.countDocuments(query),
		]);

		const apps = await this.populateRelations(docs as unknown as WithId<App>[]);

		return {
			docs: apps,
			totalDocs,
			limit,
			totalPages: Math.ceil(totalDocs / limit),
			page,
		};
	}

	async findById(id: string): Promise<AppWithRelations | null> {
		if (!ObjectId.isValid(id)) return null;
		const doc = await this.collection.findOne({
			_id: new ObjectId(id),
			isDeleted: { $ne: true },
		});
		if (!doc) return null;
		const [app] = await this.populateRelations([doc as unknown as WithId<App>]);
		return app ?? null;
	}

	async findBySlug(slug: string): Promise<AppWithRelations | null> {
		const doc = await this.collection.findOne({
			slug,
			isDeleted: { $ne: true },
		});
		if (!doc) return null;
		const [app] = await this.populateRelations([doc as unknown as WithId<App>]);
		return app ?? null;
	}

	async findByDeveloper(developer: string): Promise<AppWithRelations[]> {
		if (!ObjectId.isValid(developer)) return [];
		const docs = await this.collection
			.find({
				developer: new ObjectId(developer),
				isDeleted: { $ne: true },
			})
			.sort({ createdAt: -1 })
			.toArray();
		const apps = await this.populateRelations(docs as unknown as WithId<App>[]);
		return apps;
	}

	async create(data: CreateAppDTO): Promise<App> {
		const slug = data.slug || this.slugify(data.name);
		const app: Omit<App, "_id"> = {
			name: data.name,
			slug,
			description: data.description || "",
			iconUrl: data.iconUrl || "",
			price: data.price || 0,
			status: data.status || "pending",
			developer: data.developer,
			category: data.category,
			tags: data.tags || [],
			flags: data.flags || [],
			priority: data.priority || 0,
			isDisabled: false,
			isDeleted: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = await this.collection.insertOne(
			toDocument(app) as Record<string, unknown>,
		);
		return { _id: result.insertedId.toString(), ...app };
	}

	async update(id: string, data: UpdateAppDTO): Promise<App | null> {
		const updateData: Record<string, unknown> = {
			...data,
			updatedAt: new Date(),
		};
		if (updateData.tags) {
			updateData.tags = (updateData.tags as string[]).map((t) =>
				ObjectId.isValid(t) ? new ObjectId(t) : t,
			);
		}

		const result = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id), isDeleted: { $ne: true } },
			{ $set: updateData },
			{ returnDocument: "after" },
		);

		return result ? (result as unknown as App) : null;
	}

	async softDelete(id: string): Promise<boolean> {
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { isDeleted: true, updatedAt: new Date() } },
		);
		return result.modifiedCount > 0;
	}

	async hardDelete(id: string): Promise<boolean> {
		const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
		return result.deletedCount > 0;
	}

	async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
		const query: Record<string, unknown> = { slug };
		if (excludeId) query._id = { $ne: new ObjectId(excludeId) };
		const count = await this.collection.countDocuments(query);
		return count > 0;
	}

	async findDeveloperSpaceById(id: string): Promise<DeveloperSpaceDoc | null> {
		if (!ObjectId.isValid(id)) return null;
		const doc = await this.db.collection("developers").findOne(
			{ _id: new ObjectId(id) },
			{
				projection: {
					_id: 1,
					userId: 1,
					status: 1,
					isDeleted: 1,
					name: 1,
					contactEmail: 1,
					avatarUrl: 1,
				},
			},
		);
		return (doc as DeveloperSpaceDoc) || null;
	}

	async userExists(id: string): Promise<boolean> {
		if (!ObjectId.isValid(id)) return false;
		const count = await this.db
			.collection("users")
			.countDocuments({ _id: new ObjectId(id) }, { limit: 1 });
		return count > 0;
	}

	private slugify(text: string): string {
		return text
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");
	}

	/**
	 * Populate developer, category, tags relations
	 */
	private async populateRelations(
		apps: WithId<App>[],
	): Promise<AppWithRelations[]> {
		if (apps.length === 0) return [];

		const developerIds = [
			...new Set(
				apps.map((a) => a.developer).filter((id) => ObjectId.isValid(id)),
			),
		].map((id) => new ObjectId(id));
		const categoryIds = [
			...new Set(
				apps.map((a) => a.category).filter((id) => ObjectId.isValid(id)),
			),
		].map((id) => new ObjectId(id));
		const tagIds = [
			...new Set(
				apps.flatMap((a) => a.tags || []).filter((id) => ObjectId.isValid(id)),
			),
		].map((id) => new ObjectId(id));

		// Fetch related data
		const [developerSpaces, categories, tags] = await Promise.all([
			developerIds.length > 0
				? this.db
					.collection("developers")
					.find({ _id: { $in: developerIds } })
					.project({
						_id: 1,
						userId: 1,
						name: 1,
						contactEmail: 1,
						avatarUrl: 1,
					})
					.toArray()
				: [],
			categoryIds.length > 0
				? this.db
					.collection("categories")
					.find({ _id: { $in: categoryIds } })
					.project({ _id: 1, name: 1 })
					.toArray()
				: [],
			tagIds.length > 0
				? this.db
					.collection("tags")
					.find({ _id: { $in: tagIds } })
					.project({ _id: 1, name: 1 })
					.toArray()
				: [],
		]);

		const userIds = [
			...new Set(
				developerSpaces
					.map((d) => (d as { userId?: ObjectId }).userId?.toString())
					.filter((id): id is string => Boolean(id)),
			),
		].map((id) => new ObjectId(id));

		const users =
			userIds.length > 0
				? await this.db
					.collection("users")
					.find({ _id: { $in: userIds } })
					.project({ _id: 1, fullName: 1, username: 1, email: 1, avatar: 1 })
					.toArray()
				: [];

		const appIds = apps.map((a) => a._id.toString());
		const ratingDocs =
			appIds.length > 0
				? await this.db
					.collection("reviews")
					.aggregate([
						{
							$match: {
								app: { $in: appIds },
								status: "approved",
							},
						},
						{
							$group: {
								_id: "$app",
								average: { $avg: "$rating" },
								count: { $sum: 1 },
							},
						},
					])
					.toArray()
				: [];

		const devMap = new Map<string, DeveloperSpaceDoc>(
			developerSpaces.map((d) => [d._id.toString(), d as DeveloperSpaceDoc]),
		);
		const userMap = new Map<string, UserDoc>(
			users.map((u) => [u._id.toString(), u as UserDoc]),
		);
		const catMap = new Map<string, CategoryDoc>(
			categories.map((c) => [c._id.toString(), c as CategoryDoc]),
		);
		const tagMap = new Map<string, TagDoc>(
			tags.map((t) => [t._id.toString(), t as TagDoc]),
		);
		const ratingMap = new Map<string, { average: number; count: number }>(
			ratingDocs.map((item) => [
				String(item._id),
				{
					average: Math.round((Number(item.average) || 0) * 10) / 10,
					count: Number(item.count) || 0,
				},
			]),
		);

		return apps.map((app) => {
			const dev = devMap.get(app.developer);
			const devUser = dev ? userMap.get(dev.userId.toString()) : undefined;
			const cat = catMap.get(app.category);
			const rating = ratingMap.get(app._id.toString()) || { average: 0, count: 0 };
			const appTags = (app.tags || [])
				.map((tid) => tagMap.get(tid))
				.filter((t): t is TagDoc => t !== undefined);

			return {
				_id: app._id.toString(),
				name: app.name,
				slug: app.slug,
				description: app.description,
				iconUrl: app.iconUrl,
				price: app.price,
				status: app.status,
				ratingScore: rating.average,
				ratingCount: rating.count,
				isDisabled: app.isDisabled,
				isDeleted: app.isDeleted,
				flags: app.flags,
				priority: app.priority,
				createdAt:
					app.createdAt instanceof Date
						? app.createdAt.toISOString()
						: String(app.createdAt),
				updatedAt:
					app.updatedAt instanceof Date
						? app.updatedAt.toISOString()
						: String(app.updatedAt),
				developer: dev
					? {
						_id: dev._id.toString(),
						name:
							dev.name ||
							devUser?.fullName ||
							devUser?.username ||
							"Unknown Developer",
						contactEmail: dev.contactEmail || devUser?.email || "",
						avatarUrl: dev.avatarUrl || devUser?.avatar,
					}
					: { _id: app.developer, name: "Unknown", contactEmail: "" },
				category: cat
					? { _id: cat._id.toString(), name: cat.name }
					: { _id: app.category, name: "" },
				tags: appTags.map((t) => ({ _id: t._id.toString(), name: t.name })),
			} as AppWithRelations;
		});
	}
}
