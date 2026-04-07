import { Hono } from "hono";
import { requireAdmin } from "@/shared/middlewares/auth";
import { DashboardController } from "./dashboard.controller";

export const dashboardRouter = new Hono();
const controller = new DashboardController();

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
