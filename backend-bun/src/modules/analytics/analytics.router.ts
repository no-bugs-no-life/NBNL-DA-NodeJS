import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { validateQuery, validateBody } from "@/shared/middlewares/validate";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsQuerySchema, UpdateAnalyticsSchema } from "./analytics.schema";

export const analyticsRouter = new Hono();
const controller = new AnalyticsController();

// Admin auth middleware for /api/v1/analytics router
const requireAdmin = jwt({
    secret: env.JWT_ACCESS_SECRET,
    alg: "HS256",
});

// Applied globally to the analytics routes via grouping or direct declaration
analyticsRouter.get("/", requireAdmin, validateQuery(AnalyticsQuerySchema), (c) => controller.list(c));
analyticsRouter.get("/summary/:appId", requireAdmin, (c) => controller.getSummary(c));
analyticsRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
analyticsRouter.put("/:id", requireAdmin, validateBody(UpdateAnalyticsSchema), (c) => controller.update(c));
analyticsRouter.delete("/:id", requireAdmin, (c) => controller.delete(c));
