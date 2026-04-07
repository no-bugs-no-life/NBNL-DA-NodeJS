import { z } from "zod";

export const CreateSubPackageSchema = z.object({
	name: z.string().min(1).max(100),
	appId: z.string().nullable().optional(),
	type: z.enum(["monthly", "yearly", "lifetime"]),
	price: z.number().nonnegative(),
	durationDays: z.number().int().positive(),
	description: z.string().max(500).optional(),
});

export const UpdateSubPackageSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	type: z.enum(["monthly", "yearly", "lifetime"]).optional(),
	price: z.number().nonnegative().optional(),
	durationDays: z.number().int().positive().optional(),
	description: z.string().max(500).optional(),
	isActive: z.boolean().optional(),
});

export const SubPackageParamsSchema = z.object({
	id: z.string().min(1),
});

export const SubPackageQuerySchema = z.object({
	appId: z.string().optional(),
	type: z.enum(["monthly", "yearly", "lifetime"]).optional(),
	isActive: z.enum(["true", "false"]).transform((v) => v === "true").optional(),
});

export type CreateSubPackageRequest = z.infer<typeof CreateSubPackageSchema>;
export type UpdateSubPackageRequest = z.infer<typeof UpdateSubPackageSchema>;
export type SubPackageQueryRequest = z.infer<typeof SubPackageQuerySchema>;