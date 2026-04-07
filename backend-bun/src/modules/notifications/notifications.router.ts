import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/shared/middlewares/validate";
import { NotificationsController } from "./notifications.controller";
import {
	CreateNotificationSchema,
	NotificationParamsSchema,
	NotificationQuerySchema,
	UpdateNotificationSchema,
} from "./notifications.schema";

export const notificationsRouter = new Hono();
const controller = new NotificationsController();

// Auth middleware
const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	alg: "HS256",
});

// ============ ADMIN ROUTES ============

// GET /notifications/all - Get all notifications (admin)
notificationsRouter.get(
	"/all",
	requireAuth,
	validateQuery(NotificationQuerySchema),
	(c) => controller.getAllAdmin(c),
);

// POST /notifications - Create notification (admin)
notificationsRouter.post(
	"/",
	requireAuth,
	validateBody(CreateNotificationSchema),
	(c) => controller.create(c),
);

// PATCH /notifications/:id - Update notification (admin)
notificationsRouter.patch(
	"/:id",
	requireAuth,
	validateParams(NotificationParamsSchema),
	validateBody(UpdateNotificationSchema),
	(c) => controller.update(c),
);

// PUT /notifications/:id/read - Mark as read
notificationsRouter.put(
	"/:id/read",
	requireAuth,
	validateParams(NotificationParamsSchema),
	(c) => controller.markAsRead(c),
);

// DELETE /notifications/:id/admin - Admin delete
notificationsRouter.delete(
	"/:id/admin",
	requireAuth,
	validateParams(NotificationParamsSchema),
	(c) => controller.deleteAdmin(c),
);

// ============ USER ROUTES ============

// GET /notifications - Get own notifications
notificationsRouter.get("/", requireAuth, (c) => controller.getAll(c));

// GET /notifications/unread-count
notificationsRouter.get("/unread-count", requireAuth, (c) =>
	controller.getUnreadCount(c),
);

// GET /notifications/:id
notificationsRouter.get(
	"/:id",
	requireAuth,
	validateParams(NotificationParamsSchema),
	(c) => controller.getById(c),
);

// PATCH /notifications/read-all
notificationsRouter.patch("/read-all", requireAuth, (c) =>
	controller.markAllAsRead(c),
);

// DELETE /notifications/:id - User delete
notificationsRouter.delete(
	"/:id",
	requireAuth,
	validateParams(NotificationParamsSchema),
	(c) => controller.delete(c),
);
