import { AppError } from "@/shared/errors";
import { NotificationRepository } from "./notifications.repository";
import type {
	CreateNotificationDTO,
	Notification,
	NotificationQueryDTO,
	NotificationWithUser,
	PaginatedNotifications,
	UpdateNotificationDTO,
} from "./notifications.types";

export class NotificationsService {
	private repo: NotificationRepository;

	constructor(repo?: NotificationRepository) {
		this.repo = repo || new NotificationRepository();
	}

	async findAll(
		options: NotificationQueryDTO = {},
	): Promise<PaginatedNotifications> {
		return this.repo.findAll(options);
	}

	async getUserNotifications(userId: string): Promise<NotificationWithUser[]> {
		const result = await this.repo.findAll({ userId, page: 1, limit: 50 });
		return result.docs;
	}

	async getNotificationById(
		id: string,
		userId?: string,
	): Promise<NotificationWithUser> {
		const notification = await this.repo.findById(id);
		if (!notification) throw AppError.notFound("Notification not found");
		if (userId && notification.userId !== userId) {
			throw AppError.forbidden("Access denied");
		}

		const [_populated] = await this.repo.findAll({ page: 1, limit: 1 });
		// Return single notification with user info
		const all = await this.repo.findAll({ page: 1, limit: 1000 });
		const found = all.docs.find((n) => n._id === id);
		if (!found) throw AppError.notFound("Notification not found");
		return found;
	}

	async createNotification(data: CreateNotificationDTO): Promise<Notification> {
		return this.repo.create(data);
	}

	async updateNotification(
		id: string,
		data: UpdateNotificationDTO,
	): Promise<Notification> {
		const existing = await this.repo.findById(id);
		if (!existing) throw AppError.notFound("Notification not found");
		const updated = await this.repo.update(id, data);
		if (!updated) throw AppError.notFound("Notification not found");
		return updated;
	}

	async markAsRead(id: string, userId?: string): Promise<Notification> {
		const notification = await this.repo.findById(id);
		if (!notification) throw AppError.notFound("Notification not found");
		if (userId && notification.userId !== userId) {
			throw AppError.forbidden("Access denied");
		}
		const updated = await this.repo.markAsRead(id);
		if (!updated) throw AppError.notFound("Notification not found");
		return updated;
	}

	async markAllAsRead(userId: string): Promise<number> {
		return this.repo.markAllAsRead(userId);
	}

	async deleteNotification(id: string, userId?: string): Promise<void> {
		const notification = await this.repo.findById(id);
		if (!notification) throw AppError.notFound("Notification not found");
		if (userId && notification.userId !== userId) {
			throw AppError.forbidden("Access denied");
		}
		const deleted = await this.repo.delete(id);
		if (!deleted) throw AppError.internal("Failed to delete notification");
	}

	async getUnreadCount(userId: string): Promise<number> {
		return this.repo.getUnreadCount(userId);
	}

	/**
	 * Get all notifications for admin (with pagination & filters)
	 */
	async getAllNotifications(
		options: NotificationQueryDTO,
	): Promise<PaginatedNotifications> {
		return this.repo.findAll(options);
	}
}
