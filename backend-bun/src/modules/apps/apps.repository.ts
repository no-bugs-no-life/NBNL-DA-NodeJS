import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import type { App, CreateAppDTO, UpdateAppDTO, AppFilters } from "./apps.types";

const COLLECTION = "apps";

function toDocument(app: Partial<App>) {
	return {
		...app,
		developerId: app.developerId ? new ObjectId(app.developerId) : undefined,
		categoryId: app.categoryId ? new ObjectId(app.categoryId) : undefined,
		tags: app.tags?.map((t) => (ObjectId.isValid(t) ? new ObjectId(t) : t)) || [],
		createdAt: app.createdAt ? new Date(app.createdAt) : new Date(),
		updatedAt: new Date(),
	};
}

function fromDocument(doc: Record<string, unknown>): App {
	return {
		...doc,
		_id: (doc._id as ObjectId).toString(),
		developerId: (doc.developerId as ObjectId)?.toString() || "",
		categoryId: (doc.categoryId as ObjectId)?.toString() || "",
		tags: (doc.tags as ObjectId[] | string[])?.map((t) =>
			t instanceof ObjectId ? t.toString() : t,
		) || [],
	} as App;
}

export class AppsRepository {
	private get collection() {
		const db = mongoose.connection.db;
		if (!db) throw new Error("Database not connected");
		return db.collection(COLLECTION);
	}

	async findAll(filters?: AppFilters, page = 1, limit = 20): Promise<{ apps: App[]; total: number }> {
		const query: Record<string, unknown> = { isDeleted: { $ne: true } };

		if (filters?.status) query.status = filters.status;
		if (filters?.categoryId) query.categoryId = new ObjectId(filters.categoryId);
		if (filters?.developerId) query.developerId = new ObjectId(filters.developerId);
		if (filters?.isDisabled !== undefined) query.isDisabled = filters.isDisabled;

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
		const [apps, total] = await Promise.all([
			this.collection
				.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.toArray(),
			this.collection.countDocuments(query),
		]);

		return { apps: apps.map(fromDocument), total };
	}

	async findById(id: string): Promise<App | null> {
		const doc = await this.collection.findOne({ _id: new ObjectId(id), isDeleted: { $ne: true } });
		return doc ? fromDocument(doc) : null;
	}

	async findBySlug(slug: string): Promise<App | null> {
		const doc = await this.collection.findOne({ slug, isDeleted: { $ne: true } });
		return doc ? fromDocument(doc) : null;
	}

	async findByDeveloper(developerId: string): Promise<App[]> {
		const apps = await this.collection
			.find({ developerId: new ObjectId(developerId), isDeleted: { $ne: true } })
			.sort({ createdAt: -1 })
			.toArray();
		return apps.map(fromDocument);
	}

	async create(data: CreateAppDTO): Promise<App> {
		const slug = data.slug || this.slugify(data.name);
		const app: Omit<App, "_id"> = {
			name: data.name,
			slug,
			description: data.description,
			iconUrl: data.iconUrl,
			price: data.price,
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

		const result = await this.collection.insertOne(toDocument(app) as Record<string, unknown>);
		return { _id: result.insertedId.toString(), ...app };
	}

	async update(id: string, data: UpdateAppDTO): Promise<App | null> {
		const updateData: Record<string, unknown> = { ...data, updatedAt: new Date() };
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

		return result ? fromDocument(result) : null;
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

	async updateRating(appId: string, ratingScore: number, ratingCount: number): Promise<void> {
		await this.collection.updateOne(
			{ _id: new ObjectId(appId) },
			{ $set: { ratingScore, ratingCount, updatedAt: new Date() } },
		);
	}

	private slugify(text: string): string {
		return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
	}
}