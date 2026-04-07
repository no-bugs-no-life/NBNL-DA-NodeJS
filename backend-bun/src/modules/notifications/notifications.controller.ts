import { BaseController } from "@/shared/base";
import { NotificationsService } from "./notifications.service";
import { NotificationRepository } from "./notifications.repository";
import type { Context } from "hono";
import type {
	CreateNotificationRequest,
	UpdateNotificationRequest,
} from "./notifications.schema";

export class NotificationsController extends BaseController {
	private readonly notificationsService = new NotificationsService(
		new NotificationRepository(),
	);

	// GET /notifications - Get user's notifications
	async getAll(c: Context) {
		const userId = this.getUserId(c);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const notifications = await this.notificationsService.getUserNotifications(userId);
		return c.json(this.ok(notifications, "Lấy danh sách thông báo thành công"));
	}

	// GET /notifications/unread-count
	async getUnreadCount(c: Context) {
		const userId = this.getUserId(c);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const count = await this.notificationsService.getUnreadCount(userId);
		return c.json(this.ok({ count }, "Số thông báo chưa đọc"));
	}

	// GET /notifications/:id
	async getById(c: Context) {
		const userId = this.getUserId(c);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);

		const notification = await this.notificationsService.getNotificationById(id, userId);
		return c.json(this.ok(notification, "Lấy thông tin thông báo thành công"));
	}

	// POST /notifications (Admin only - create system notification)
	async create(c: Context) {
		// @ts-expect-error
		const data = c.req.valid("json") as CreateNotificationRequest;
		const notification = await this.notificationsService.createNotification(data);
		return c.json(this.ok(notification, "Tạo thông báo thành công"), 201);
	}

	// PATCH /notifications/:id/read
	async markAsRead(c: Context) {
		const userId = this.getUserId(c);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);

		const notification = await this.notificationsService.markAsRead(id, userId);
		return c.json(this.ok(notification, "Đánh dấu đã đọc"));
	}

	// PATCH /notifications/read-all
	async markAllAsRead(c: Context) {
		const userId = this.getUserId(c);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const count = await this.notificationsService.markAllAsRead(userId);
		return c.json(this.ok({ count }, `Đã đánh dấu ${count} thông báo là đã đọc`));
	}

	// DELETE /notifications/:id
	async delete(c: Context) {
		const userId = this.getUserId(c);
		if (!userId) return c.json(this.fail("Chưa đăng nhập"), 401);

		const id = c.req.param("id");
		if (!id) return c.json(this.fail("Thiếu tham số id"), 400);

		await this.notificationsService.deleteNotification(id, userId);
		return c.json(this.ok(null, "Xóa thông báo thành công"));
	}

	// Helper: Get userId from JWT payload
	private getUserId(c: Context): string | undefined {
		const payload = c.get("jwtPayload") as { id?: string } | undefined;
		return payload?.id;
	}
}
