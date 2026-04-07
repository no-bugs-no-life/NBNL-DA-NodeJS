import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { validateBody } from "@/shared/middlewares/validate";
import { ReportsController } from "./reports.controller";
import { CreateReportSchema, UpdateReportStatusSchema } from "./reports.schema";

export const reportsRouter = new Hono();
const controller = new ReportsController();

const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token",
	alg: "HS256",
});

// biome-ignore lint/suspicious/noExplicitAny: Hono context types
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
