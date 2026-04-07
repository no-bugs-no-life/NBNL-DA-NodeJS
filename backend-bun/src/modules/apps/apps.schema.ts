import { z } from "zod";

// Enums as const
const APP_STATUSES = ["pending", "published", "rejected", "archived"] as const;
const APP_QUERY_STATUSES = [...APP_STATUSES, "approved"] as const;

// Schemas
export const CreateAppSchema = z.object({
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100).optional(),
	description: z.string().max(5000).optional().default(""),
	iconUrl: z.string().optional().default(""),
	price: z.number().min(0).default(0),
	status: z.enum(APP_STATUSES).optional(),
	developer: z.string().min(1).optional(),
	developerId: z.string().min(1).optional(),
	category: z.string().min(1).optional(),
	categoryId: z.string().min(1).optional(),
	tags: z.array(z.string()).optional(),
	flags: z.array(z.string()).optional(),
	priority: z.number().int().optional().default(0),
}).refine((data) => Boolean(data.developer || data.developerId), {
	message: "Developer is required",
	path: ["developer"],
}).refine((data) => Boolean(data.category || data.categoryId), {
	message: "Category is required",
	path: ["category"],
});

export const UpdateAppSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	slug: z.string().min(1).max(100).optional(),
	description: z.string().max(5000).optional(),
	iconUrl: z.string().optional(),
	price: z.number().min(0).optional(),
	status: z.enum(APP_STATUSES).optional(),
	category: z.string().min(1).optional(),
	tags: z.array(z.string()).optional(),
	isDisabled: z.boolean().optional(),
	flags: z.array(z.string()).optional(),
	priority: z.number().int().optional(),
});

export const AppParamsSchema = z.object({
	id: z.string().min(1),
});

export const AppQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(1000).default(20),
	status: z
		.enum(APP_QUERY_STATUSES)
		.transform((status) => (status === "approved" ? "published" : status))
		.optional(),
	category: z.string().optional(),
	developer: z.string().optional(),
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
	flags: z
		.string()
		.optional()
		.transform((v) => (v ? v.split(",") : undefined)),
	sortBy: z
		.enum(["name", "price", "ratingScore", "createdAt", "priority"])
		.default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Types from schemas
export type CreateAppRequest = z.infer<typeof CreateAppSchema>;
export type UpdateAppRequest = z.infer<typeof UpdateAppSchema>;
export type AppQueryRequest = z.infer<typeof AppQuerySchema>;
