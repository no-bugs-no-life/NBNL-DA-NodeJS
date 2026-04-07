import type { IBaseRepository } from "@/shared/base";
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
	async findAll(): Promise<ICoupon[]> {
		// TODO: Implement with MongoDB
		return [];
	}

	async findById(_id: string): Promise<ICoupon | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findByCode(_code: string): Promise<ICoupon | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async findAllPaginated(
		_query: CouponQuery,
	): Promise<{ coupons: ICoupon[]; total: number }> {
		// TODO: Implement with MongoDB
		return { coupons: [], total: 0 };
	}

	async create(_data: Partial<ICoupon>): Promise<ICoupon> {
		// TODO: Implement with MongoDB
		return {} as ICoupon;
	}

	async update(_id: string, _data: Partial<ICoupon>): Promise<ICoupon | null> {
		// TODO: Implement with MongoDB
		return null;
	}

	async incrementUsage(_id: string): Promise<ICoupon | null> {
		// TODO: Implement with MongoDB - increment usedCount
		return null;
	}

	async findValidCoupons(): Promise<ICoupon[]> {
		// TODO: Implement with MongoDB - find active & not expired
		return [];
	}

	async delete(_id: string): Promise<boolean> {
		// TODO: Implement with MongoDB - soft delete
		return false;
	}
}
