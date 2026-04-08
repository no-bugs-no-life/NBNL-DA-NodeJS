import { z } from "zod";

// Status enum
const STATUSES = ["pending", "approved", "rejected"] as const;

// Permissions schema
export const DeveloperPermissionsSchema = z.object({
	canPublishApp: z.boolean().default(false),
	canEditOwnApps: z.boolean().default(false),
	canDeleteOwnApps: z.boolean().default(false),
	canViewAnalytics: z.boolean().default(false),
	canManagePricing: z.boolean().default(false),
	canRespondReviews: z.boolean().default(false),
});

// Create developer
export const CreateDeveloperSchema = z.object({
	userId: z.string().min(1),
	name: z.string().max(100).optional(),
	bio: z.string().max(500).optional(),
	website: z.string().optional(),
	avatarUrl: z.string().optional(),
	contactEmail: z.string().optional(),
	socialLinks: z.record(z.string()).optional(),
});

// Update developer
export const UpdateDeveloperSchema = z.object({
	name: z.string().max(100).optional(),
	bio: z.string().max(500).optional(),
	website: z.string().optional(),
	avatarUrl: z.string().optional(),
	contactEmail: z.string().optional(),
	socialLinks: z.record(z.string()).optional(),
	permissions: DeveloperPermissionsSchema.partial().optional(),
});

// Approve developer
export const ApproveDeveloperSchema = z.object({
	permissions: DeveloperPermissionsSchema.partial().optional(),
});

// Reject developer
export const RejectDeveloperSchema = z.object({
	reason: z.string().min(1).max(500),
});

// Revoke developer
export const RevokeDeveloperSchema = z.object({
	reason: z.string().max(500).optional(),
});

// Query params
export const DeveloperQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	sortBy: z.enum(["createdAt", "name", "status"]).default("createdAt"),
	order: z.coerce.number().min(-1).max(1).default(-1),
	status: z.enum(STATUSES).optional(),
	search: z.string().optional(),
});

export const AdminDeveloperQuerySchema = DeveloperQuerySchema.extend({
	limit: z.coerce.number().min(1).default(20),
});

// Types
export type CreateDeveloperRequest = z.infer<typeof CreateDeveloperSchema>;
export type UpdateDeveloperRequest = z.infer<typeof UpdateDeveloperSchema>;
export type ApproveDeveloperRequest = z.infer<typeof ApproveDeveloperSchema>;
export type RejectDeveloperRequest = z.infer<typeof RejectDeveloperSchema>;
export type RevokeDeveloperRequest = z.infer<typeof RevokeDeveloperSchema>;
export type DeveloperQueryRequest = z.infer<typeof DeveloperQuerySchema>;
