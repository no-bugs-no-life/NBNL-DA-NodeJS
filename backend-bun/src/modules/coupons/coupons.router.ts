import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { CouponsController } from "./coupons.controller";
import { CreateCouponSchema, UpdateCouponSchema, ApplyCouponSchema } from "./coupons.schema";
import { validateBody } from "@/shared/middlewares/validate";

export const couponsRouter = new Hono();
const controller = new CouponsController();

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

// Public Routes
couponsRouter.get("/valid", (c) => controller.getValidCoupons(c));
couponsRouter.post("/apply", validateBody(ApplyCouponSchema), (c) => controller.apply(c));

// Protected Routes - Admin
couponsRouter.get("/", requireAdmin, (c) => controller.getAll(c));
couponsRouter.post("/", requireAdmin, validateBody(CreateCouponSchema), (c) => controller.create(c));
couponsRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
couponsRouter.patch("/:id", requireAdmin, validateBody(UpdateCouponSchema), (c) => controller.update(c));
couponsRouter.delete("/:id", requireAdmin, (c) => controller.delete(c));
