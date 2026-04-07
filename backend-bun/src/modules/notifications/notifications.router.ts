import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { NotificationsController } from "./notifications.controller";
import { validateBody } from "@/shared/middlewares/validate";
import { CreateNotificationSchema } from "./notifications.schema";

export const notificationsRouter = new Hono();
const controller = new NotificationsController();

// Middleware: Require authentication
const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token",
	alg: "HS256",
});

// Protected Routes (User)
notificationsRouter.get("/", requireAuth, (c) => controller.getAll(c));
notificationsRouter.get("/unread-count", requireAuth, (c) => controller.getUnreadCount(c));
notificationsRouter.get("/:id", requireAuth, (c) => controller.getById(c));
notificationsRouter.patch("/:id/read", requireAuth, (c) => controller.markAsRead(c));
notificationsRouter.patch("/read-all", requireAuth, (c) => controller.markAllAsRead(c));
notificationsRouter.delete("/:id", requireAuth, (c) => controller.delete(c));

// Admin Routes
notificationsRouter.post("/", requireAuth, validateBody(CreateNotificationSchema), (c) =>
	controller.create(c),
);