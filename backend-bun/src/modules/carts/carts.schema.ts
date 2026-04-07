import { z } from "zod";

export const AddToCartSchema = z.object({
	appId: z.string().min(1, "App ID không được để trống"),
	price: z.number().positive("Giá phải lớn hơn 0"),
});

export type AddToCartRequest = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
	price: z.number().positive("Giá phải lớn hơn 0").optional(),
});

export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemSchema>;

export const RemoveFromCartSchema = z.object({
	appId: z.string().min(1, "App ID không được để trống"),
});

export type RemoveFromCartRequest = z.infer<typeof RemoveFromCartSchema>;