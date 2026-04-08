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
		startDate: z.string(),
		endDate: z.string(),
		// 0 = không giới hạn, >0 = giới hạn số lần sử dụng
		usageLimit: z.number().int().min(0).optional().default(0),
		apps: z.array(z.string()).optional(),
	})
	.refine((data) => new Date(data.endDate) > new Date(data.startDate), {
		message: "Ngày kết thúc phải sau ngày bắt đầu",
	})
	.strict();

export type CreateCouponRequest = z.infer<typeof CreateCouponSchema>;

// Update Coupon Schema - frontend uses PUT
export const UpdateCouponSchema = z
	.object({
		discountType: z.nativeEnum(DiscountType).optional(),
		discountValue: z.number().positive().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		// Cho phép chỉnh về 0 = không giới hạn
		usageLimit: z.number().int().min(0).optional(),
		apps: z.array(z.string()).optional(),
	})
	.strict();

export type UpdateCouponRequest = z.infer<typeof UpdateCouponSchema>;

// Apply Coupon Schema
export const ApplyCouponSchema = z.object({
	code: z.string().min(1, "Mã coupon không được để trống"),
	app: z.string().optional(),
});

export type ApplyCouponRequest = z.infer<typeof ApplyCouponSchema>;

// Query Schema
export const CouponQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CouponQueryRequest = z.infer<typeof CouponQuerySchema>;
