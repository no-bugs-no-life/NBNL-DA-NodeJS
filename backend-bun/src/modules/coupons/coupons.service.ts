import { CouponsRepository } from "./coupons.repository";
import { badRequest, notFound, forbidden } from "@/shared/errors";
import type {
	ICoupon,
	ICouponPublic,
	ICouponCreate,
	ICouponUpdate,
	CouponQuery,
} from "./coupons.types";
import type { CreateCouponRequest, UpdateCouponRequest, ApplyCouponRequest } from "./coupons.schema";

export interface ApplyResult {
	success: boolean;
	discount: number;
	finalPrice: number;
	coupon: ICouponPublic;
}

export class CouponsService {
	private readonly repository = new CouponsRepository();

	async create(data: CreateCouponRequest): Promise<ICouponPublic> {
		const existing = await this.repository.findByCode(data.code.toUpperCase());
		if (existing) throw badRequest("Mã coupon đã tồn tại");

		const coupon = await this.repository.create({
			...data,
			code: data.code.toUpperCase(),
			appIds: data.appIds ?? [],
			isGlobal: !data.appIds?.length,
			usedCount: 0,
		});

		return this.toPublic(coupon);
	}

	async getById(id: string): Promise<ICouponPublic> {
		const coupon = await this.repository.findById(id);
		if (!coupon) throw notFound("Coupon không tồn tại");
		return this.toPublic(coupon);
	}

	async getAll(query: CouponQuery): Promise<{ coupons: ICouponPublic[]; total: number }> {
		const { coupons, total } = await this.repository.findAllPaginated(query);
		return { coupons: coupons.map((c) => this.toPublic(c)), total };
	}

	async getValidCoupons(): Promise<ICouponPublic[]> {
		const coupons = await this.repository.findValidCoupons();
		return coupons.map((c) => this.toPublic(c));
	}

	async update(id: string, data: UpdateCouponRequest): Promise<ICouponPublic> {
		const coupon = await this.repository.update(id, data as Partial<ICoupon>);
		if (!coupon) throw notFound("Coupon không tồn tại");
		return this.toPublic(coupon);
	}

	async applyCoupon(code: string, originalPrice: number, appId?: string): Promise<ApplyResult> {
		const coupon = await this.repository.findByCode(code.toUpperCase());
		if (!coupon) throw notFound("Mã coupon không hợp lệ");

		const now = new Date();
		if (new Date(coupon.startDate) > now) {
			throw badRequest("Coupon chưa có hiệu lực");
		}
		if (new Date(coupon.endDate) < now) {
			throw badRequest("Coupon đã hết hạn");
		}
		if (coupon.usedCount >= coupon.usageLimit) {
			throw badRequest("Coupon đã hết lượt sử dụng");
		}
		if (!coupon.isGlobal && appId && !coupon.appIds.includes(appId as any)) {
			throw badRequest("Coupon không áp dụng cho ứng dụng này");
		}

		let discount: number;
		if (coupon.discountType === "percentage") {
			discount = Math.floor((originalPrice * coupon.discountValue) / 100);
		} else {
			discount = Math.min(coupon.discountValue, originalPrice);
		}

		return {
			success: true,
			discount,
			finalPrice: originalPrice - discount,
			coupon: this.toPublic(coupon),
		};
	}

	async incrementUsage(id: string): Promise<void> {
		await this.repository.incrementUsage(id);
	}

	async delete(id: string): Promise<boolean> {
		const coupon = await this.repository.update(id, { isDisabled: true } as any);
		if (!coupon) throw notFound("Coupon không tồn tại");
		return true;
	}

	private toPublic(coupon: ICoupon): ICouponPublic {
		const now = new Date();
		const endDate = new Date(coupon.endDate);
		const startDate = new Date(coupon.startDate);

		return {
			id: coupon._id?.toString() ?? "",
			code: coupon.code,
			discountType: coupon.discountType,
			discountValue: coupon.discountValue,
			startDate: coupon.startDate!,
			endDate: coupon.endDate!,
			usageLimit: coupon.usageLimit,
			usedCount: coupon.usedCount,
			isGlobal: coupon.isGlobal,
			isExpired: endDate < now,
			isUsable: coupon.usedCount < coupon.usageLimit && startDate <= now && endDate >= now,
		};
	}
}
