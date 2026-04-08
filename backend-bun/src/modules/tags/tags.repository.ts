import mongoose from "mongoose";
import type {
	CreateTagDTO,
	PaginatedTags,
	Tag,
	TagQueryRequest,
	UpdateTagDTO,
} from "./tags.types";

const COLLECTION = "tags";

const tagSchema = new mongoose.Schema<Tag>(
	{
		name: { type: String, required: true },
		slug: { type: String, required: true, unique: true },
	},
	{ timestamps: true, collection: COLLECTION },
);

const TagModel =
	(mongoose.models[COLLECTION] as mongoose.Model<Tag>) || mongoose.model<Tag>(COLLECTION, tagSchema);

export class TagsRepository {
	async findAll(query: TagQueryRequest): Promise<PaginatedTags> {
		const filter: Record<string, unknown> = {};
		if (query.search) {
			filter.name = { $regex: query.search, $options: "i" };
		}

		const skip = (query.page - 1) * query.limit;
		const [docs, totalDocs] = await Promise.all([
			TagModel.find(filter)
				.sort({ name: 1 })
				.skip(skip)
				.limit(query.limit)
				.lean(),
			TagModel.countDocuments(filter),
		]);

		return {
			docs,
			totalDocs,
			limit: query.limit,
			totalPages: Math.ceil(totalDocs / query.limit),
			page: query.page,
		};
	}

	async findById(id: string): Promise<Tag | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return TagModel.findById(id).lean();
	}

	async findBySlug(slug: string): Promise<Tag | null> {
		return TagModel.findOne({ slug }).lean();
	}

	async create(data: CreateTagDTO): Promise<Tag> {
		const tag = await TagModel.create(data);
		return tag.toObject();
	}

	async update(id: string, data: UpdateTagDTO): Promise<Tag | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return TagModel.findByIdAndUpdate(id, data, { new: true }).lean();
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await TagModel.findByIdAndDelete(id);
		return result !== null;
	}

	async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
		const query: Record<string, unknown> = { slug };
		if (excludeId) {
			query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
		}
		const count = await TagModel.countDocuments(query);
		return count > 0;
	}
}
