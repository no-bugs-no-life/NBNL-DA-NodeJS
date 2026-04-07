import { Hono } from "hono";
import { requireAdmin, requireAuth } from "@/shared/middlewares/auth";
import { validateBody } from "@/shared/middlewares/validate";
import { ReportsController } from "./reports.controller";
import { CreateReportSchema, UpdateReportStatusSchema } from "./reports.schema";

export const reportsRouter = new Hono();
const controller = new ReportsController();

// User Routes
reportsRouter.post("/", requireAuth, validateBody(CreateReportSchema), (c) =>
	controller.create(c),
);
reportsRouter.get("/my", requireAuth, (c) => controller.getMyReports(c));

// Admin Routes
reportsRouter.get("/", requireAdmin, (c) => controller.getAll(c));
reportsRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
reportsRouter.put(
	"/:id/status",
	requireAdmin,
	validateBody(UpdateReportStatusSchema),
	(c) => controller.updateStatus(c),
);
reportsRouter.delete("/:id", requireAdmin, (c) => controller.delete(c));
