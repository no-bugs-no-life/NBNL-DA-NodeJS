export type NotificationType = "system" | "promotion" | "report_update" | "app_update" | "order" | "review";

export interface INotification {
	id: string;
	userId: string;
	title: string;
	message: string;
	type: NotificationType;
	isRead: boolean;
	link?: string;
	createdAt: Date;
}

export interface NotificationPublic {
	id: string;
	title: string;
	message: string;
	type: NotificationType;
	isRead: boolean;
	link?: string;
	createdAt: Date;
}

export const toPublicNotification = (n: INotification): NotificationPublic => ({
	id: n.id,
	title: n.title,
	message: n.message,
	type: n.type,
	isRead: n.isRead,
	link: n.link,
	createdAt: n.createdAt,
});
