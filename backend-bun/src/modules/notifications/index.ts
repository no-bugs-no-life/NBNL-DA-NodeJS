// Public API - Barrel export
export { notificationsRouter } from "./notifications.router";
export { NotificationsService } from "./notifications.service";
export type { INotification, NotificationPublic, NotificationType } from "./notifications.types";
export type {
	CreateNotificationRequest,
	UpdateNotificationRequest,
	NotificationParams,
} from "./notifications.schema";