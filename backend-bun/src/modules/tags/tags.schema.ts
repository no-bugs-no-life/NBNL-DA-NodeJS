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

export type CreateTagRequest = z.infer<typeof CreateTagSchema>;
export type UpdateTagRequest = z.infer<typeof UpdateTagSchema>;
