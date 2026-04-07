import { z } from "zod";
import { PaymentMethod } from "./orders.types";

export const CreateOrderSchema = z
	.object({
		items: z
			.array(
				z.object({
					appId: z.string().min(1),
					name: z.string().min(1),
					price: z.number().positive(),
					iconUrl: z.string().url().optional(),
				}),
			)
			.min(1, "Phải có ít nhất 1 sản phẩm"),
		couponCode: z.string().optional(),
		paymentMethod: z.nativeEnum(PaymentMethod),
	})
	.strict();

export type CreateOrderRequest = z.infer<typeof CreateOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
	status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]),
	adminNote: z.string().max(500).optional(),
});

export type UpdateOrderStatusRequest = z.infer<typeof UpdateOrderStatusSchema>;

export const OrderQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	status: z.enum(["pending", "processing", "completed", "failed", "cancelled"]).optional(),
	paymentMethod: z.nativeEnum(PaymentMethod).optional(),
});

export type OrderQueryRequest = z.infer<typeof OrderQuerySchema>;