import { badRequest, notFound } from "@/shared/errors";
import { CouponsRepository } from "./coupons.repository";
import type {
	CreateCouponRequest,
	UpdateCouponRequest,
} from "./coupons.schema";
import type {
	AppInfo,
	CouponItemResponse,
	ICoupon,
	PaginatedCouponsResponse,
} from "./coupons.types";

export interface ApplyResult {
	success: boolean;
	discount: number;
	finalPrice: number;
	coupon: CouponItemResponse;
}

export class CouponsService {
	private readonly repository = new CouponsRepository();

	async create(data: CreateCouponRequest): Promise<CouponItemResponse> {
		const existing = await this.repository.findByCode(data.code.toUpperCase());
		if (existing) throw badRequest("Mã coupon đã tồn tại");

		const coupon = await this.repository.create({
			code: data.code.toUpperCase(),
			discountType: data.discountType,
			discountValue: data.discountValue,
			startDate: new Date(data.startDate),
			endDate: new Date(data.endDate),
			usageLimit: data.usageLimit ?? 100,
			apps: (data.apps ?? []) as unknown as ICoupon["apps"],
			isGlobal: !data.apps?.length,
			usedCount: 0,
		});

		return this.toResponse(coupon);
	}

	async getById(id: string): Promise<CouponItemResponse> {
		const coupon = await this.repository.findById(id);
		if (!coupon) throw notFound("Coupon không tồn tại");
		return this.toResponse(coupon);
	}

	async getAllPaginated(
		page: number,
		limit: number,
	): Promise<PaginatedCouponsResponse> {
		const { coupons, total } = await this.repository.findAllPaginated({
			page,
			limit,
		});
		return {
			docs: coupons.map((c) => this.toResponse(c)),
			totalDocs: total,
			limit,
			totalPages: Math.ceil(total / limit),
			page,
		};
	}

	async getValidCoupons(): Promise<CouponItemResponse[]> {
		const coupons = await this.repository.findValidCoupons();
		return coupons.map((c) => this.toResponse(c));
	}

	async update(
		id: string,
		data: UpdateCouponRequest,
	): Promise<CouponItemResponse> {
		const updateData: Partial<ICoupon> = {};

		if (data.discountType !== undefined)
			updateData.discountType = data.discountType;
		if (data.discountValue !== undefined)
			updateData.discountValue = data.discountValue;
		if (data.startDate !== undefined)
			updateData.startDate = new Date(data.startDate);
		if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
		if (data.usageLimit !== undefined) updateData.usageLimit = data.usageLimit;
		if (data.apps !== undefined) {
			updateData.apps = data.apps as unknown as ICoupon["apps"];
			updateData.isGlobal = !data.apps.length;
		}

		const coupon = await this.repository.update(id, updateData);
		if (!coupon) throw notFound("Coupon không tồn tại");
		return this.toResponse(coupon);
	}

	async applyCoupon(
		code: string,
		originalPrice: number,
		app?: string,
	): Promise<ApplyResult> {
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
		if (
			!coupon.isGlobal &&
			app &&
			!coupon.apps.some((a) => a.toString() === app)
		) {
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
			coupon: this.toResponse(coupon),
		};
	}

	async incrementUsage(id: string): Promise<void> {
		await this.repository.incrementUsage(id);
	}

	async delete(id: string): Promise<boolean> {
		const coupon = await this.repository.update(id, {
			isDisabled: true,
		} as Partial<ICoupon>);
		if (!coupon) throw notFound("Coupon không tồn tại");
		return true;
	}

	private toResponse(coupon: ICoupon): CouponItemResponse {
		const apps: AppInfo[] = coupon.apps.map((app) => ({
			_id: app,
			name: "",
			iconUrl: undefined,
		}));

		return {
			_id: coupon._id?.toString() ?? "",
			code: coupon.code,
			discountType: coupon.discountType,
			discountValue: coupon.discountValue,
			startDate: coupon.startDate?.toISOString() ?? new Date().toISOString(),
			endDate: coupon.endDate?.toISOString() ?? new Date().toISOString(),
			usageLimit: coupon.usageLimit,
			usedCount: coupon.usedCount,
			apps,
			createdAt: coupon.createdAt?.toISOString() ?? new Date().toISOString(),
		};
	}
}
