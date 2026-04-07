import { z } from "zod";
import { CartItemType, SubscriptionPlan } from "./carts.types";

// Add item to cart
export const AddToCartSchema = z.object({
	app: z.string().min(1, "App ID không được để trống"),
	itemType: z.nativeEnum(CartItemType).default(CartItemType.ONE_TIME),
	plan: z.nativeEnum(SubscriptionPlan).optional(),
	quantity: z.number().int().positive().default(1),
});

export type AddToCartRequest = z.infer<typeof AddToCartSchema>;

// Update cart item
export const UpdateCartItemSchema = z.object({
	quantity: z.number().int().positive().optional(),
	plan: z.nativeEnum(SubscriptionPlan).optional(),
});

export type UpdateCartItemRequest = z.infer<typeof UpdateCartItemSchema>;

// Create cart (Admin)
export const CreateCartSchema = z.object({
	user: z.string().min(1, "User ID không được để trống"),
	app: z.string().min(1, "App ID không được để trống"),
	itemType: z.nativeEnum(CartItemType).default(CartItemType.ONE_TIME),
});

export type CreateCartRequest = z.infer<typeof CreateCartSchema>;

// Pagination Query
export const CartQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CartQueryRequest = z.infer<typeof CartQuerySchema>;
