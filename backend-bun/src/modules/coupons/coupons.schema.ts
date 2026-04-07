import { z } from "zod";
import { DiscountType } from "./coupons.types";

// Create Coupon Schema
export const CreateCouponSchema = z
	.object({
		code: z
			.string()
			.min(3, "Mã coupon tối thiểu 3 ký tự")
			.max(30, "Mã coupon tối đa 30 ký tự")
			.regex(/^[A-Z0-9_-]+$/, "Mã coupon chỉ chứa chữ hoa, số và dấu _ -"),
		discountType: z.nativeEnum(DiscountType),
		discountValue: z.number().positive("Giá trị giảm phải lớn hơn 0"),
		startDate: z.string().datetime().or(z.date()),
		endDate: z.string().datetime().or(z.date()),
		usageLimit: z.number().int().positive("Số lần sử dụng phải lớn hơn 0"),
		appIds: z.array(z.string()).optional(),
	})
	.refine(
		(data) => {
			const start = new Date(data.startDate);
			const end = new Date(data.endDate);
			return end > start;
		},
		{ message: "Ngày kết thúc phải sau ngày bắt đầu" },
	)
	.strict();

export type CreateCouponRequest = z.infer<typeof CreateCouponSchema>;

// Update Coupon Schema
export const UpdateCouponSchema = z
	.object({
		discountValue: z.number().positive().optional(),
		startDate: z.string().datetime().or(z.date()).optional(),
		endDate: z.string().datetime().or(z.date()).optional(),
		usageLimit: z.number().int().positive().optional(),
		isActive: z.boolean().optional(),
	})
	.strict();

export type UpdateCouponRequest = z.infer<typeof UpdateCouponSchema>;

// Validate Coupon Schema (for applying)
export const ApplyCouponSchema = z.object({
	code: z.string().min(1, "Mã coupon không được để trống"),
	appId: z.string().optional(),
});

export type ApplyCouponRequest = z.infer<typeof ApplyCouponSchema>;

// Query Schema
export const CouponQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	search: z.string().optional(),
	status: z.enum(["active", "expired", "disabled"]).optional(),
	isGlobal: z.coerce.boolean().optional(),
});

export type CouponQueryRequest = z.infer<typeof CouponQuerySchema>;