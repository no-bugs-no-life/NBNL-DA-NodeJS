import { z } from "zod";

const ownerTypes = ["app", "user", "developer"] as const;
const fileTypes = [
	"apk",
	"ipa",
	"icon",
	"banner",
	"screenshot",
	"avatar",
	"other",
] as const;

export const CreateFileSchema = z.object({
	ownerType: z.enum(ownerTypes),
	ownerId: z.string().optional(),
	fileType: z.enum(fileTypes),
	url: z.string().url(),
});

export const UpdateFileSchema = z.object({
	fileType: z.enum(fileTypes).optional(),
	url: z.string().url().optional(),
});

export const FileParamsSchema = z.object({
	id: z.string().min(1),
});

export const FileQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	ownerType: z.enum(ownerTypes).optional(),
	ownerId: z.string().optional(),
	fileType: z.enum(fileTypes).optional(),
});

export type CreateFileRequest = z.infer<typeof CreateFileSchema>;
export type UpdateFileRequest = z.infer<typeof UpdateFileSchema>;
export type FileParams = z.infer<typeof FileParamsSchema>;
export type FileQuery = z.infer<typeof FileQuerySchema>;
