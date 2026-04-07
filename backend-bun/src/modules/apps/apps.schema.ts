import { z } from "zod";

// Enums as const
const APP_STATUSES = ["pending", "published", "rejected", "archived"] as const;

// Schemas
export const CreateAppSchema = z.object({
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100).optional(),
	description: z.string().max(5000).optional().default(""),
	iconUrl: z.string().optional().default(""),
	price: z.number().min(0).default(0),
	status: z.enum(APP_STATUSES).optional(),
	developerId: z.string().min(1),
	categoryId: z.string().min(1),
	tags: z.array(z.string()).optional(),
});

export const UpdateAppSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	slug: z.string().min(1).max(100).optional(),
	description: z.string().max(5000).optional(),
	iconUrl: z.string().optional(),
	price: z.number().min(0).optional(),
	status: z.enum(APP_STATUSES).optional(),
	categoryId: z.string().min(1).optional(),
	tags: z.array(z.string()).optional(),
	isDisabled: z.boolean().optional(),
});

export const AppParamsSchema = z.object({
	id: z.string().min(1),
});

export const AppQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	status: z.enum(APP_STATUSES).optional(),
	categoryId: z.string().optional(),
	developerId: z.string().optional(),
	tags: z.string().optional(), // comma-separated
	search: z.string().optional(),
	isDisabled: z
		.enum(["true", "false"])
		.transform((v) => v === "true")
		.optional(),
	isDeleted: z
		.enum(["true", "false"])
		.transform((v) => v === "true")
		.optional(),
	sortBy: z
		.enum(["name", "price", "ratingScore", "createdAt"])
		.default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Types from schemas
export type CreateAppRequest = z.infer<typeof CreateAppSchema>;
export type UpdateAppRequest = z.infer<typeof UpdateAppSchema>;
export type AppQueryRequest = z.infer<typeof AppQuerySchema>;
