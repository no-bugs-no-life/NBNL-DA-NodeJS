import { z } from "zod";

export const CreateSubscriptionSchema = z.object({
	userId: z.string().min(1),
	subPackageId: z.string().min(1),
	startDate: z.string().datetime().or(z.date()),
	endDate: z.string().datetime().or(z.date()),
});

export const UpdateSubscriptionSchema = z.object({
	status: z.enum(["active", "expired", "cancelled"]).optional(),
	endDate: z.string().datetime().or(z.date()).optional(),
});

export const SubscriptionParamsSchema = z.object({
	id: z.string().min(1),
});

export const SubscriptionQuerySchema = z.object({
	userId: z.string().optional(),
	subPackageId: z.string().optional(),
	status: z.enum(["active", "expired", "cancelled"]).optional(),
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateSubscriptionRequest = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionRequest = z.infer<typeof UpdateSubscriptionSchema>;
export type SubscriptionQueryRequest = z.infer<typeof SubscriptionQuerySchema>;