import type { INotificationRepository } from "./notifications.repository";
import type { INotification, NotificationPublic } from "./notifications.types";
import { toPublicNotification } from "./notifications.types";
import { notFound, forbidden } from "@/shared/errors";
import type {
	CreateNotificationRequest,
	UpdateNotificationRequest,
} from "./notifications.schema";

export class NotificationsService {
	constructor(private readonly repository: INotificationRepository) {}

	async getUserNotifications(userId: string): Promise<NotificationPublic[]> {
		const notifications = await this.repository.findAllByUser(userId);
		return notifications.map(toPublicNotification);
	}

	async getNotificationById(id: string, userId: string): Promise<NotificationPublic> {
		const notification = await this.repository.findById(id);
		if (!notification) throw notFound("Không tìm thấy thông báo");
		if (notification.userId !== userId) throw forbidden("Không có quyền truy cập");
		return toPublicNotification(notification);
	}

	async createNotification(
		data: CreateNotificationRequest,
	): Promise<NotificationPublic> {
		const notification = await this.repository.create(data);
		return toPublicNotification(notification);
	}

	async markAsRead(id: string, userId: string): Promise<NotificationPublic> {
		const notification = await this.repository.findById(id);
		if (!notification) throw notFound("Không tìm thấy thông báo");
		if (notification.userId !== userId) throw forbidden("Không có quyền");
		const updated = await this.repository.markAsRead(id);
		return toPublicNotification(updated!);
	}

	async markAllAsRead(userId: string): Promise<number> {
		return this.repository.markAllAsRead(userId);
	}

	async deleteNotification(id: string, userId: string): Promise<void> {
		const notification = await this.repository.findById(id);
		if (!notification) throw notFound("Không tìm thấy thông báo");
		if (notification.userId !== userId) throw forbidden("Không có quyền");
		await this.repository.delete(id);
	}

	async getUnreadCount(userId: string): Promise<number> {
		return this.repository.getUnreadCount(userId);
	}
}
