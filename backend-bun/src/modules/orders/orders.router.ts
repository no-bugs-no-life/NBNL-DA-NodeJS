import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { OrdersController } from "./orders.controller";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "./orders.schema";
import { validateBody } from "@/shared/middlewares/validate";

export const ordersRouter = new Hono();
const controller = new OrdersController();

const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token",
	alg: "HS256",
});

const requireAdmin = async (c: any, next: any) => {
	await requireAuth(c, async () => {
		const payload = c.get("jwtPayload");
		if (!payload || !["ADMIN", "MODERATOR"].includes(payload.role)) {
			return c.json({ success: false, msg: "Không có quyền truy cập" }, 403);
		}
		await next();
	});
};

// User Routes
ordersRouter.post("/", requireAuth, validateBody(CreateOrderSchema), (c) => controller.create(c));
ordersRouter.get("/my", requireAuth, (c) => controller.getMyOrders(c));

// Admin Routes
ordersRouter.get("/", requireAdmin, (c) => controller.getAll(c));
ordersRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
ordersRouter.patch("/:id/status", requireAdmin, validateBody(UpdateOrderStatusSchema), (c) => controller.updateStatus(c));
ordersRouter.post("/:id/confirm-payment", requireAdmin, (c) => controller.confirmPayment(c));