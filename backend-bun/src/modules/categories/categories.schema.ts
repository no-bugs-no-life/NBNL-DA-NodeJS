import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CreateCategorySchema = z.object({
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100).regex(slugRegex, "Slug phải là chữ thường và số, ngăn cách bằng dấu gạch ngang"),
	iconUrl: z.string().url().optional(),
});

export const UpdateCategorySchema = z.object({
	name: z.string().min(1).max(100).optional(),
	slug: z.string().min(1).max(100).regex(slugRegex).optional(),
	iconUrl: z.string().url().optional().nullable(),
});

export const CategoryParamsSchema = z.object({
	id: z.string().min(1),
});

export type CreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof UpdateCategorySchema>;
export type CategoryParams = z.infer<typeof CategoryParamsSchema>;
