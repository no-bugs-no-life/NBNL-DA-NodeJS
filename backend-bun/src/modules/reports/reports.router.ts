import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { ReportsController } from "./reports.controller";
import { CreateReportSchema, UpdateReportSchema } from "./reports.schema";
import { validateBody } from "@/shared/middlewares/validate";

export const reportsRouter = new Hono();
const controller = new ReportsController();

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

// Public - User must be logged in to report
reportsRouter.post("/", requireAuth, validateBody(CreateReportSchema), (c) => controller.create(c));
reportsRouter.get("/my", requireAuth, (c) => controller.getMyReports(c));

// Protected Routes - Admin/Moderator
reportsRouter.get("/", requireAdmin, (c) => controller.getAll(c));
reportsRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
reportsRouter.patch("/:id", requireAdmin, validateBody(UpdateReportSchema), (c) => controller.update(c));
reportsRouter.delete("/:id", requireAdmin, (c) => controller.delete(c));
