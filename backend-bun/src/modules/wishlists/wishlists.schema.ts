import { z } from "zod";

export const CreateWishlistSchema = z.object({
	user: z.string().min(1, "User ID is required"),
	apps: z.array(z.string()).min(1, "At least one app is required"),
});

export const UpdateWishlistSchema = z.object({
	user: z.string().optional(),
	apps: z.array(z.string()).optional(),
});

export const AddToWishlistSchema = z.object({
	app: z.string().min(1, "App ID is required"),
});

export const WishlistParamsSchema = z.object({
	id: z.string().min(1),
});

export const WishlistQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateWishlistRequest = z.infer<typeof CreateWishlistSchema>;
export type UpdateWishlistRequest = z.infer<typeof UpdateWishlistSchema>;
export type AddToWishlistRequest = z.infer<typeof AddToWishlistSchema>;
export type WishlistParams = z.infer<typeof WishlistParamsSchema>;
export type WishlistQuery = z.infer<typeof WishlistQuerySchema>;
