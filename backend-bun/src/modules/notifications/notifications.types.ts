export type NotificationType =
	| "app_approved"
	| "app_rejected"
	| "new_review"
	| "new_download"
	| "system"
	| "promotion"
	| "update"
	| "sendmail";

export type NotificationChannel = "inapp" | "email" | "firebase";

export interface Notification {
	_id: string;
	userId: string;
	type: NotificationType;
	channel: NotificationChannel;
	message: string;
	isRead: boolean;
	sentAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserInfo {
	_id: string;
	fullName: string;
	email: string;
	avatarUrl?: string;
}

export interface NotificationWithUser extends Notification {
	userId: UserInfo;
}

export interface CreateNotificationDTO {
	userId: string;
	type: NotificationType;
	message: string;
	channel?: NotificationChannel;
}

export interface UpdateNotificationDTO {
	type?: NotificationType;
	message?: string;
	channel?: NotificationChannel;
	isRead?: boolean;
}

export interface NotificationQueryDTO {
	userId?: string;
	type?: NotificationType;
	isRead?: boolean;
	page?: number;
	limit?: number;
}

export interface PaginatedNotifications {
	docs: NotificationWithUser[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
}
