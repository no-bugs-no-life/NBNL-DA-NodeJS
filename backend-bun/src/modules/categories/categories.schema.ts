import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Frontend gửi name + iconUrl, slug có thể optional (tự tạo từ name)
export const CreateCategorySchema = z.object({
	name: z.string().min(1).max(100),
	iconUrl: z.string().url().optional().or(z.literal("")),
	parentId: z.string().optional().nullable(),
	slug: z.string().regex(slugRegex, "Slug không hợp lệ").optional(),
});

export const UpdateCategorySchema = z.object({
	name: z.string().min(1).max(100).optional(),
	iconUrl: z.string().url().optional().nullable().or(z.literal("")),
	parentId: z.string().optional().nullable(),
});

export const CategoryParamsSchema = z.object({
	id: z.string().min(1),
});

export type CreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof UpdateCategorySchema>;
export type CategoryParams = z.infer<typeof CategoryParamsSchema>;
