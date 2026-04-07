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
		developerId: app.developerId ? new ObjectId(app.developerId) : undefined,
		categoryId: app.categoryId ? new ObjectId(app.categoryId) : undefined,
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
		if (filters?.categoryId)
			query.categoryId = new ObjectId(filters.categoryId);
		if (filters?.developerId)
			query.developerId = new ObjectId(filters.developerId);
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

		const skip = (page - 1) * limit;
		const [docs, totalDocs] = await Promise.all([
			this.collection
				.find(query)
				.sort({ createdAt: -1 })
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

	async findByDeveloper(developerId: string): Promise<AppWithRelations[]> {
		if (!ObjectId.isValid(developerId)) return [];
		const docs = await this.collection
			.find({
				developerId: new ObjectId(developerId),
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
			developerId: data.developerId,
			categoryId: data.categoryId,
			tags: data.tags || [],
			ratingScore: 0,
			ratingCount: 0,
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

	async updateRating(
		appId: string,
		ratingScore: number,
		ratingCount: number,
	): Promise<void> {
		await this.collection.updateOne(
			{ _id: new ObjectId(appId) },
			{ $set: { ratingScore, ratingCount, updatedAt: new Date() } },
		);
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
				apps.map((a) => a.developerId).filter((id) => ObjectId.isValid(id)),
			),
		].map((id) => new ObjectId(id));
		const categoryIds = [
			...new Set(
				apps.map((a) => a.categoryId).filter((id) => ObjectId.isValid(id)),
			),
		].map((id) => new ObjectId(id));
		const tagIds = [
			...new Set(
				apps.flatMap((a) => a.tags || []).filter((id) => ObjectId.isValid(id)),
			),
		].map((id) => new ObjectId(id));

		// Fetch related data
		const [developers, categories, tags] = await Promise.all([
			developerIds.length > 0
				? this.db
					.collection("users")
					.find({ _id: { $in: developerIds } })
					.project({ _id: 1, fullName: 1, username: 1, email: 1, avatar: 1 })
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

		const devMap = new Map<string, UserDoc>(
			developers.map((d) => [d._id.toString(), d as UserDoc]),
		);
		const catMap = new Map<string, CategoryDoc>(
			categories.map((c) => [c._id.toString(), c as CategoryDoc]),
		);
		const tagMap = new Map<string, TagDoc>(
			tags.map((t) => [t._id.toString(), t as TagDoc]),
		);

		return apps.map((app) => {
			const dev = devMap.get(app.developerId);
			const cat = catMap.get(app.categoryId);
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
				ratingScore: app.ratingScore,
				ratingCount: app.ratingCount,
				isDisabled: app.isDisabled,
				isDeleted: app.isDeleted,
				createdAt:
					app.createdAt instanceof Date
						? app.createdAt.toISOString()
						: String(app.createdAt),
				updatedAt:
					app.updatedAt instanceof Date
						? app.updatedAt.toISOString()
						: String(app.updatedAt),
				developerId: dev
					? {
						_id: dev._id.toString(),
						name: dev.fullName || dev.username || "Unknown",
						contactEmail: dev.email || "",
						avatarUrl: dev.avatar,
					}
					: { _id: app.developerId, name: "Unknown", contactEmail: "" },
				categoryId: cat
					? { _id: cat._id.toString(), name: cat.name }
					: { _id: app.categoryId, name: "" },
				tags: appTags.map((t) => ({ _id: t._id.toString(), name: t.name })),
			} as AppWithRelations;
		});
	}
}
