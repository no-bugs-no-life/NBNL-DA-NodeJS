import { z } from "zod";

export const CreateReviewSchema = z.object({
	app: z.string().min(1, "App ID is required"),
	user: z.string().min(1, "User ID is required"),
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
	app: z.string().optional(),
	user: z.string().optional(),
	status: z.enum(["pending", "approved", "rejected"]).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

// Admin schemas
const AdminCreateReviewRawSchema = z.object({
	app: z.string().min(1).optional(),
	appId: z.string().min(1).optional(),
	user: z.string().min(1).optional(),
	userId: z.string().min(1).optional(),
	rating: z.number().int().min(1).max(5),
	comment: z.string().max(2000).optional(),
	status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const AdminCreateReviewSchema = AdminCreateReviewRawSchema.transform((data) => ({
	app: data.app || data.appId || "",
	user: data.user || data.userId || "",
	rating: data.rating,
	comment: (data.comment || "").trim(),
	status: data.status,
})).refine((data) => data.app.length > 0, {
	path: ["app"],
	message: "App ID is required",
}).refine((data) => data.user.length > 0, {
	path: ["user"],
	message: "User ID is required",
});

export const AdminUpdateReviewSchema = UpdateReviewSchema;

export const AdminReviewQuerySchema = ReviewQuerySchema.extend({
	isPending: z
		.enum(["true", "false"])
		.optional()
		.transform((val) => val === "true"),
}).transform((data) => ({
	...data,
	status: data.isPending === true ? "pending" : data.status,
}));

export type CreateReviewRequest = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewRequest = z.infer<typeof UpdateReviewSchema>;
export type ReviewQueryRequest = z.infer<typeof ReviewQuerySchema>;
export type AdminCreateReviewRequest = z.infer<typeof AdminCreateReviewSchema>;
