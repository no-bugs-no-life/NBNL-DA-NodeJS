import type { Context } from "hono";
import { BaseController } from "@/shared/base";
import {
	ApplyCouponSchema,
	CouponQuerySchema,
	CreateCouponSchema,
	UpdateCouponSchema,
} from "./coupons.schema";
import { CouponsService } from "./coupons.service";

export class CouponsController extends BaseController {
	private readonly couponsService = new CouponsService();

	async create(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = CreateCouponSchema.parse(data);

		const coupon = await this.couponsService.create(validated);
		return c.json(this.ok(coupon, "Tạo coupon thành công"), 201);
	}

	async getAll(c: Context) {
		const query = CouponQuerySchema.parse(c.req.query());
		const result = await this.couponsService.getAllPaginated(
			query.page,
			query.limit,
		);

		return c.json(this.ok(result));
	}

	async getValidCoupons(c: Context) {
		const coupons = await this.couponsService.getValidCoupons();
		return c.json(this.ok(coupons));
	}

	async getById(c: Context) {
		const { id } = c.req.param();
		const coupon = await this.couponsService.getById(id);
		return c.json(this.ok(coupon));
	}

	async update(c: Context) {
		const { id } = c.req.param();
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = UpdateCouponSchema.parse(data);

		const coupon = await this.couponsService.update(id, validated);
		return c.json(this.ok(coupon, "Cập nhật coupon thành công"));
	}

	async apply(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json");
		const validated = ApplyCouponSchema.parse(data);

		const { price, appId } = await c.req.json<{
			price: number;
			appId?: string;
		}>();

		if (!price || price <= 0) {
			return c.json(this.fail("Giá không hợp lệ"), 400);
		}

		const result = await this.couponsService.applyCoupon(
			validated.code,
			price,
			appId,
		);
		return c.json(this.ok(result, "Áp dụng coupon thành công"));
	}

	async delete(c: Context) {
		const { id } = c.req.param();
		await this.couponsService.delete(id);
		return c.json(this.ok(null, "Xóa coupon thành công"));
	}
}
