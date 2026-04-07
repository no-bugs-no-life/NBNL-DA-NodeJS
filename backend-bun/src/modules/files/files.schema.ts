import { z } from "zod";

export const CreateFileSchema = z.object({
	uploaderId: z.string().min(1),
	url: z.string().url(),
	fileKey: z.string().min(1),
	mimeType: z.string().min(1),
	size: z.number().int().nonnegative(),
});

export const FileParamsSchema = z.object({
	id: z.string().min(1),
});

export const FileQuerySchema = z.object({
	uploaderId: z.string().optional(),
	mimeType: z.string().optional(),
});

export type CreateFileRequest = z.infer<typeof CreateFileSchema>;
export type FileQueryRequest = z.infer<typeof FileQuerySchema>;