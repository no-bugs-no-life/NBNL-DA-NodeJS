import { z } from "zod";

export const CreateTagSchema = z.object({
	name: z.string().min(1).max(50),
	slug: z.string().min(1).max(50).optional(),
});

export const UpdateTagSchema = z.object({
	name: z.string().min(1).max(50).optional(),
	slug: z.string().min(1).max(50).optional(),
});

export const TagParamsSchema = z.object({
	id: z.string().min(1),
});

export const TagQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	search: z.string().optional(),
});

export type CreateTagRequest = z.infer<typeof CreateTagSchema>;
export type UpdateTagRequest = z.infer<typeof UpdateTagSchema>;
export type TagQueryRequest = z.infer<typeof TagQuerySchema>;
