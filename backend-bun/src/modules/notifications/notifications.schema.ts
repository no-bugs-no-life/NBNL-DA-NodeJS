import { z } from "zod";

const notificationTypes = [
	"app_approved",
	"app_rejected",
	"new_review",
	"new_download",
	"system",
	"promotion",
	"update",
	"sendmail",
] as const;

const channels = ["inapp", "email", "firebase"] as const;

export const CreateNotificationSchema = z.object({
	user: z.string().min(1, "User ID is required"),
	type: z.enum(notificationTypes),
	message: z.string().min(1).max(1000),
	channel: z.enum(channels).default("inapp"),
});

export const UpdateNotificationSchema = z.object({
	type: z.enum(notificationTypes).optional(),
	message: z.string().min(1).max(1000).optional(),
	channel: z.enum(channels).optional(),
	isRead: z.boolean().optional(),
});

export const NotificationParamsSchema = z.object({
	id: z.string().min(1),
});

export const NotificationQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	limit: z.coerce.number().int().positive().max(100).default(20),
	type: z.enum(notificationTypes).optional(),
	isRead: z
		.enum(["true", "false"])
		.transform((v) => v === "true")
		.optional(),
	user: z.string().optional(),
});

export type CreateNotificationRequest = z.infer<
	typeof CreateNotificationSchema
>;
export type UpdateNotificationRequest = z.infer<
	typeof UpdateNotificationSchema
>;
export type NotificationQueryRequest = z.infer<typeof NotificationQuerySchema>;
