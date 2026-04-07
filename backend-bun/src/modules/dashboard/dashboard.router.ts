import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { DashboardController } from "./dashboard.controller";

export const dashboardRouter = new Hono();
const controller = new DashboardController();

// Auth middleware for admin routes
const requireAdmin = jwt({
	secret: env.JWT_ACCESS_SECRET,
	alg: "HS256",
});

// GET /dashboard/stats - Get all dashboard stats
dashboardRouter.get("/stats", requireAdmin, (c) => controller.getStats(c));

// GET /dashboard/overview - Get dashboard overview with recent orders
dashboardRouter.get("/overview", requireAdmin, (c) =>
	controller.getOverview(c),
);

// GET /dashboard/chart/revenue - Get revenue chart data
dashboardRouter.get("/chart/revenue", requireAdmin, (c) =>
	controller.getRevenueChart(c),
);

// GET /dashboard/chart/users - Get users chart data
dashboardRouter.get("/chart/users", requireAdmin, (c) =>
	controller.getUsersChart(c),
);
