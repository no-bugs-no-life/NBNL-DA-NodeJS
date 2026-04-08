import mongoose from "mongoose";
import type {
	CreateWishlistDTO,
	UpdateWishlistDTO,
	Wishlist,
	WishlistWithRelations,
} from "./wishlists.types";

const COLLECTION = "wishlists";

const wishlistSchema = new mongoose.Schema<Wishlist>(
	{
		user: { type: String, required: true, unique: true, index: true },
		apps: [{ type: String }],
	},
	{ timestamps: true, collection: COLLECTION },
);

export const WishlistModel =
	(mongoose.models[COLLECTION] as mongoose.Model<Wishlist>) ||
	mongoose.model<Wishlist>(COLLECTION, wishlistSchema);

// Helper to populate wishlist
const populateWishlist = (doc: unknown): WishlistWithRelations | null => {
	if (!doc || typeof doc !== "object") return null;
	const d = doc as Record<string, unknown>;
	const user = d.user as Record<string, unknown>;
	const _apps = d.apps as string[];

	return {
		_id: d._id as string,
		user: user
			? {
				_id: user._id as string,
				fullName: (user.fullName as string) || "",
				email: user.email as string | undefined,
				avatarUrl: user.avatarUrl as string | undefined,
			}
			: { _id: "", fullName: "" },
		apps: [], // Will be populated separately if needed
		createdAt: d.createdAt as Date,
		updatedAt: d.updatedAt as Date,
	};
};

export class WishlistsRepository {
	async findAll(query: { page: number; limit: number }): Promise<{
		docs: WishlistWithRelations[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	}> {
		const skip = (query.page - 1) * query.limit;
		const [docs, total] = await Promise.all([
			WishlistModel.find()
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(query.limit)
				.populate("user", "_id fullName email avatarUrl")
				.lean(),
			WishlistModel.countDocuments(),
		]);

		return {
			docs: docs
				.map(populateWishlist)
				.filter(Boolean) as WishlistWithRelations[],
			total,
			page: query.page,
			limit: query.limit,
			totalPages: Math.ceil(total / query.limit),
		};
	}

	async findById(id: string): Promise<Wishlist | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return WishlistModel.findById(id).lean();
	}

	async findByIdWithPopulate(
		id: string,
	): Promise<WishlistWithRelations | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		const doc = await WishlistModel.findById(id)
			.populate("user", "_id fullName email avatarUrl")
			.lean();
		return doc ? populateWishlist(doc) : null;
	}

	async findByUserId(user: string): Promise<Wishlist | null> {
		return WishlistModel.findOne({ user }).lean();
	}

	async create(data: CreateWishlistDTO): Promise<Wishlist> {
		const wishlist = await WishlistModel.create(data);
		return wishlist.toObject();
	}

	async update(id: string, data: UpdateWishlistDTO): Promise<Wishlist | null> {
		if (!mongoose.Types.ObjectId.isValid(id)) return null;
		return WishlistModel.findByIdAndUpdate(id, data, { new: true }).lean();
	}

	async delete(id: string): Promise<boolean> {
		if (!mongoose.Types.ObjectId.isValid(id)) return false;
		const result = await WishlistModel.findByIdAndDelete(id);
		return result !== null;
	}

	async addApp(user: string, app: string): Promise<Wishlist | null> {
		return WishlistModel.findOneAndUpdate(
			{ user },
			{ $addToSet: { apps: app } },
			{ new: true, upsert: true },
		).lean();
	}

	async removeApp(user: string, app: string): Promise<Wishlist | null> {
		return WishlistModel.findOneAndUpdate(
			{ user },
			{ $pull: { apps: app } },
			{ new: true },
		).lean();
	}

	async clearApps(user: string): Promise<Wishlist | null> {
		return WishlistModel.findOneAndUpdate(
			{ user },
			{ $set: { apps: [] } },
			{ new: true },
		).lean();
	}
}
