import { z } from "zod";

const notificationTypes = ["system", "promotion", "report_update", "app_update", "order", "review"] as const;

export const CreateNotificationSchema = z.object({
	userId: z.string().min(1),
	title: z.string().min(1).max(200),
	message: z.string().min(1).max(1000),
	type: z.enum(notificationTypes),
	link: z.string().url().optional(),
});

export const UpdateNotificationSchema = z.object({
	isRead: z.boolean().optional(),
});

export const NotificationParamsSchema = z.object({
	id: z.string().min(1),
});

export type CreateNotificationRequest = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationRequest = z.infer<typeof UpdateNotificationSchema>;
export type NotificationParams = z.infer<typeof NotificationParamsSchema>;
