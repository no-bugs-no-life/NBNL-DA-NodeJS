import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { SubscriptionsController } from "./subscriptions.controller";
import { validateBody, validateParams, validateQuery } from "@/shared/middlewares/validate";
import {
	CreateSubscriptionSchema,
	UpdateSubscriptionSchema,
	SubscriptionParamsSchema,
	SubscriptionQuerySchema,
} from "./subscriptions.schema";

export const subscriptionsRouter = new Hono();
const controller = new SubscriptionsController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes (Admin only for list)
subscriptionsRouter.get("/", requireAdmin, validateQuery(SubscriptionQuerySchema), (c) => controller.list(c));
subscriptionsRouter.get("/:id", validateParams(SubscriptionParamsSchema), (c) => controller.getById(c));

// User Routes (Authenticated)
subscriptionsRouter.get("/user/:userId", (c) => controller.getByUser(c));
subscriptionsRouter.get("/user/:userId/active", (c) => controller.getActiveByUser(c));
subscriptionsRouter.get("/user/:userId/check", (c) => controller.checkActive(c));

subscriptionsRouter.post("/", requireAuth, validateBody(CreateSubscriptionSchema), (c) => controller.create(c));
subscriptionsRouter.put(
	"/:id",
	requireAuth,
	validateParams(SubscriptionParamsSchema),
	validateBody(UpdateSubscriptionSchema),
	(c) => controller.update(c),
);
subscriptionsRouter.patch("/:id/cancel", requireAuth, validateParams(SubscriptionParamsSchema), (c) =>
	controller.cancel(c),
);
subscriptionsRouter.delete("/:id", requireAdmin, validateParams(SubscriptionParamsSchema), (c) => controller.delete(c));