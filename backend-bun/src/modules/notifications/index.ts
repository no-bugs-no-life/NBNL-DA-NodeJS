// Public API - Barrel export
export { notificationsRouter } from "./notifications.router";
export type {
	CreateNotificationRequest,
	NotificationParams,
	UpdateNotificationRequest,
} from "./notifications.schema";
export { NotificationsService } from "./notifications.service";
export type {
	INotification,
	NotificationPublic,
	NotificationType,
} from "./notifications.types";
