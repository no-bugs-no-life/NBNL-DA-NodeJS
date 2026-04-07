import { Hono } from "hono";
import { requireAdmin, requireAuth } from "@/shared/middlewares/auth";
import { validateBody } from "@/shared/middlewares/validate";
import { OrdersController } from "./orders.controller";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "./orders.schema";

export const ordersRouter = new Hono();
const controller = new OrdersController();

// User Routes
ordersRouter.post("/", requireAuth, validateBody(CreateOrderSchema), (c) =>
	controller.create(c),
);
ordersRouter.get("/my", requireAuth, (c) => controller.getMyOrders(c));

// Admin Routes
ordersRouter.get("/", requireAdmin, (c) => controller.getAll(c));
ordersRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
ordersRouter.patch(
	"/:id/status",
	requireAdmin,
	validateBody(UpdateOrderStatusSchema),
	(c) => controller.updateStatus(c),
);
ordersRouter.post("/:id/confirm-payment", requireAdmin, (c) =>
	controller.confirmPayment(c),
);
