import { z } from "zod";

export const CreateReviewSchema = z.object({
	appId: z.string().min(1, "App ID is required"),
	userId: z.string().min(1, "User ID is required"),
	rating: z.number().int().min(1).max(5),
	comment: z.string().min(1).max(2000),
});

export const UpdateReviewSchema = z.object({
	rating: z.number().int().min(1).max(5).optional(),
	comment: z.string().min(1).max(2000).optional(),
	status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const ReviewParamsSchema = z.object({
	id: z.string().min(1),
});

export const ReviewQuerySchema = z.object({
	appId: z.string().optional(),
	userId: z.string().optional(),
	status: z.enum(["pending", "approved", "rejected"]).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewRequest = z.infer<typeof UpdateReviewSchema>;
export type ReviewQueryRequest = z.infer<typeof ReviewQuerySchema>;