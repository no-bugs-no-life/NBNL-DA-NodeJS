import { z } from "zod";

const platformEnum = z.enum([
	"android",
	"ios",
	"windows",
	"macos",
	"linux",
	"web",
]);
const versionStatusEnum = z.enum([
	"draft",
	"published",
	"deprecated",
	"archived",
]);
const subscriptionTierEnum = z.enum(["premium", "pro"]);

export const VersionFileSchema = z.object({
	platform: platformEnum,
	fileKey: z.string().min(1),
	fileName: z.string().min(1),
	fileSize: z.number().int().nonnegative(),
	mimeType: z.string().default("application/octet-stream"),
	checksum: z.string().optional(),
});

export const AccessControlSchema = z.object({
	isFree: z.boolean().default(false),
	requiresPurchase: z.boolean().default(true),
	requiredSubscription: subscriptionTierEnum.nullable().default(null),
	allowedRoles: z.array(z.string()).default([]),
	allowedUserIds: z.array(z.string()).default([]),
});

export const CreateVersionSchema = z.object({
	appId: z.string().min(1),
	versionNumber: z.string().min(1).max(50),
	versionCode: z.number().int().positive(),
	releaseName: z.string().max(100).optional(),
	changelog: z.string().max(5000).optional(),
	files: z.array(VersionFileSchema).min(1),
	accessControl: AccessControlSchema.partial().optional(),
	status: versionStatusEnum.optional(),
	isLatest: z.boolean().optional(),
});

export const UpdateVersionSchema = z.object({
	versionNumber: z.string().min(1).max(50).optional(),
	versionCode: z.number().int().positive().optional(),
	releaseName: z.string().max(100).optional(),
	changelog: z.string().max(5000).optional(),
	files: z.array(VersionFileSchema).min(1).optional(),
	accessControl: AccessControlSchema.partial().optional(),
	status: versionStatusEnum.optional(),
	isLatest: z.boolean().optional(),
});

export const VersionParamsSchema = z.object({
	id: z.string().min(1),
});

export const VersionQuerySchema = z.object({
	appId: z.string().optional(),
	status: versionStatusEnum.optional(),
	platform: platformEnum.optional(),
	isLatest: z
		.enum(["true", "false"])
		.transform((v) => v === "true")
		.optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateVersionRequest = z.infer<typeof CreateVersionSchema>;
export type UpdateVersionRequest = z.infer<typeof UpdateVersionSchema>;
export type VersionQueryRequest = z.infer<typeof VersionQuerySchema>;
