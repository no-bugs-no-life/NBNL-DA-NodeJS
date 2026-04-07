import type { Context } from "hono";
import {
	apiCreated,
	apiNoContent,
	apiSuccess,
} from "@/shared/utils/api-response.util";
import type {
	CreateNotificationRequest,
	NotificationQueryRequest,
	UpdateNotificationRequest,
} from "./notifications.schema";
import { NotificationsService } from "./notifications.service";

export class NotificationsController {
	private service: NotificationsService;

	constructor(service?: NotificationsService) {
		this.service = service || new NotificationsService();
	}

	private getUserId(c: Context): string | undefined {
		try {
			const payload = c.get("jwtPayload") as
				| { sub?: string; id?: string }
				| undefined;
			return payload?.sub || payload?.id;
		} catch {
			return undefined;
		}
	}

	/**
	 * GET /notifications/all - Admin: Get all notifications with pagination
	 */
	async getAllAdmin(c: Context) {
		const query = c.req.valid("query") as NotificationQueryRequest;
		const result = await this.service.getAllNotifications({
			type: query.type,
			isRead: query.isRead,
			page: query.page,
			limit: query.limit,
		});
		return apiSuccess(c, result);
	}

	/**
	 * GET /notifications - User: Get own notifications
	 */
	async getAll(c: Context) {
		const user = this.getUserId(c);
		if (!user)
			return apiSuccess(c, {
				docs: [],
				totalDocs: 0,
				limit: 20,
				totalPages: 0,
				page: 1,
			});
		const result = await this.service.getAllNotifications({
			user,
			page: 1,
			limit: 50,
		});
		return apiSuccess(c, result);
	}

	/**
	 * GET /notifications/unread-count
	 */
	async getUnreadCount(c: Context) {
		const user = this.getUserId(c);
		if (!user) return apiSuccess(c, { count: 0 });
		const count = await this.service.getUnreadCount(user);
		return apiSuccess(c, { count });
	}

	/**
	 * GET /notifications/:id
	 */
	async getById(c: Context) {
		const id = c.req.param("id");
		const user = this.getUserId(c);
		const notification = await this.service.getNotificationById(id, user);
		return apiSuccess(c, notification);
	}

	/**
	 * POST /notifications - Admin: Create notification
	 */
	async create(c: Context) {
		const body = c.req.valid("json") as CreateNotificationRequest;
		const notification = await this.service.createNotification(body);
		return apiCreated(c, notification);
	}

	/**
	 * PATCH /notifications/:id - Update notification
	 */
	async update(c: Context) {
		const id = c.req.param("id");
		const body = c.req.valid("json") as UpdateNotificationRequest;
		const notification = await this.service.updateNotification(id, body);
		return apiSuccess(c, notification);
	}

	/**
	 * PUT /notifications/:id/read - Mark as read
	 */
	async markAsRead(c: Context) {
		const id = c.req.param("id");
		const user = this.getUserId(c);
		const notification = await this.service.markAsRead(id, user);
		return apiSuccess(c, notification);
	}

	/**
	 * PATCH /notifications/read-all
	 */
	async markAllAsRead(c: Context) {
		const user = this.getUserId(c);
		if (!user) return apiSuccess(c, { count: 0 });
		const count = await this.service.markAllAsRead(user);
		return apiSuccess(c, { count });
	}

	/**
	 * DELETE /notifications/:id/admin - Admin delete
	 */
	async deleteAdmin(c: Context) {
		const id = c.req.param("id");
		await this.service.deleteNotification(id);
		return apiNoContent(c);
	}

	/**
	 * DELETE /notifications/:id - User delete own notification
	 */
	async delete(c: Context) {
		const id = c.req.param("id");
		const user = this.getUserId(c);
		await this.service.deleteNotification(id, user);
		return apiNoContent(c);
	}
}
