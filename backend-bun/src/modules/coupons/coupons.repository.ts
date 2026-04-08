import type { IBaseRepository } from "@/shared/base";
import mongoose, { ObjectId } from "mongoose";
import type { CouponQuery, ICoupon } from "./coupons.types";

export interface ICouponRepository extends IBaseRepository<ICoupon> {
	findByCode(code: string): Promise<ICoupon | null>;
	findAllPaginated(
		query: CouponQuery,
	): Promise<{ coupons: ICoupon[]; total: number }>;
	incrementUsage(id: string): Promise<ICoupon | null>;
	findValidCoupons(): Promise<ICoupon[]>;
}

export class CouponsRepository implements ICouponRepository {
	private get db() {
		// biome-ignore lint/style/noNonNullAssertion: initialized on app bootstrap
		return mongoose.connection.db!;
	}

	private get collection() {
		return this.db.collection<ICoupon>("coupons");
	}

	async findAll(): Promise<ICoupon[]> {
		return this.collection.find({ isDisabled: { $ne: true } }).toArray();
	}

	async findById(id: string): Promise<ICoupon | null> {
		if (!mongoose.isValidObjectId(id)) return null;
		return this.collection.findOne({ _id: new mongoose.Types.ObjectId(id) as ObjectId });
	}

	async findByCode(code: string): Promise<ICoupon | null> {
		return this.collection.findOne({
			code,
			isDisabled: { $ne: true },
		});
	}

	async findAllPaginated(
		query: CouponQuery,
	): Promise<{ coupons: ICoupon[]; total: number }> {
		const page = Math.max(1, query.page ?? 1);
		const limit = Math.max(1, Math.min(100, query.limit ?? 10));
		const skip = (page - 1) * limit;
		const filter = { isDisabled: { $ne: true } } as const;
		const [coupons, total] = await Promise.all([
			this.collection
				.find(filter)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.toArray(),
			this.collection.countDocuments(filter),
		]);
		return { coupons, total };
	}

	async create(data: Partial<ICoupon>): Promise<ICoupon> {
		const now = new Date();
		const doc: ICoupon = {
			code: data.code ?? "",
			discountType: data.discountType!,
			discountValue: data.discountValue!,
			startDate: data.startDate!,
			endDate: data.endDate!,
			usageLimit: data.usageLimit ?? 0,
			usedCount: data.usedCount ?? 0,
			apps: data.apps ?? [],
			isGlobal: data.isGlobal ?? true,
			isDisabled: data.isDisabled ?? false,
			createdAt: now,
			updatedAt: now,
		};
		const result = await this.collection.insertOne(doc);
		return { ...doc, _id: result.insertedId as ObjectId };
	}

	async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
		if (!mongoose.isValidObjectId(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new mongoose.Types.ObjectId(id) as ObjectId },
			{ $set: { ...data, updatedAt: new Date() } },
			{ returnDocument: "after" },
		);
		return result ?? null;
	}

	async incrementUsage(id: string): Promise<ICoupon | null> {
		if (!mongoose.isValidObjectId(id)) return null;
		const result = await this.collection.findOneAndUpdate(
			{ _id: new mongoose.Types.ObjectId(id) as ObjectId },
			{ $inc: { usedCount: 1 }, $set: { updatedAt: new Date() } },
			{ returnDocument: "after" },
		);
		return result ?? null;
	}

	async findValidCoupons(): Promise<ICoupon[]> {
		const now = new Date();
		return this.collection
			.find({
				isDisabled: { $ne: true },
				startDate: { $lte: now },
				endDate: { $gte: now },
				$expr: { $lt: ["$usedCount", "$usageLimit"] },
			})
			.sort({ createdAt: -1 })
			.toArray();
	}

	async delete(id: string): Promise<boolean> {
		const updated = await this.update(id, { isDisabled: true });
		return !!updated;
	}
}
