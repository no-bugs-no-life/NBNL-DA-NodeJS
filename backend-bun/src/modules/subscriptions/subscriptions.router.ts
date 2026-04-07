import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/shared/middlewares/validate";
import { SubscriptionsController } from "./subscriptions.controller";
import {
	CreateSubscriptionSchema,
	RenewSubscriptionSchema,
	SubscriptionParamsSchema,
	SubscriptionQuerySchema,
	UpdateSubscriptionSchema,
} from "./subscriptions.schema";

export const subscriptionsRouter = new Hono();
const controller = new SubscriptionsController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Admin Routes - List and Manage
subscriptionsRouter.get(
	"/",
	requireAdmin,
	validateQuery(SubscriptionQuerySchema),
	(c) => controller.list(c),
);
subscriptionsRouter.get(
	"/:id",
	requireAdmin,
	validateParams(SubscriptionParamsSchema),
	(c) => controller.getById(c),
);
subscriptionsRouter.delete(
	"/:id",
	requireAdmin,
	validateParams(SubscriptionParamsSchema),
	(c) => controller.delete(c),
);

// Renew Subscription (Admin)
subscriptionsRouter.put(
	"/:id/renew",
	requireAdmin,
	validateParams(SubscriptionParamsSchema),
	validateBody(RenewSubscriptionSchema),
	(c) => controller.renew(c),
);

// Cancel Subscription (Admin)
subscriptionsRouter.patch(
	"/:id/cancel",
	requireAdmin,
	validateParams(SubscriptionParamsSchema),
	(c) => controller.cancel(c),
);

// User Routes (Authenticated)
subscriptionsRouter.get("/user/:userId", requireAuth, (c) =>
	controller.getByUser(c),
);
subscriptionsRouter.get("/user/:userId/active", requireAuth, (c) =>
	controller.getActiveByUser(c),
);
subscriptionsRouter.get("/user/:userId/check", requireAuth, (c) =>
	controller.checkActive(c),
);

// Create/Update Subscription (Authenticated)
subscriptionsRouter.post(
	"/",
	requireAuth,
	validateBody(CreateSubscriptionSchema),
	(c) => controller.create(c),
);
subscriptionsRouter.put(
	"/:id",
	requireAuth,
	validateParams(SubscriptionParamsSchema),
	validateBody(UpdateSubscriptionSchema),
	(c) => controller.update(c),
);
