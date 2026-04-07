import { Hono } from "hono";
import { requireAdmin } from "@/shared/middlewares/auth";
import { validateBody } from "@/shared/middlewares/validate";
import { CouponsController } from "./coupons.controller";
import {
	ApplyCouponSchema,
	CreateCouponSchema,
	UpdateCouponSchema,
} from "./coupons.schema";

export const couponsRouter = new Hono();
const controller = new CouponsController();

// Public Routes
couponsRouter.get("/valid", (c) => controller.getValidCoupons(c));
couponsRouter.post("/apply", validateBody(ApplyCouponSchema), (c) =>
	controller.apply(c),
);

// Protected Routes - Admin
couponsRouter.get("/", requireAdmin, (c) => controller.getAll(c));
couponsRouter.post("/", requireAdmin, validateBody(CreateCouponSchema), (c) =>
	controller.create(c),
);
couponsRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
couponsRouter.put("/:id", requireAdmin, validateBody(UpdateCouponSchema), (c) =>
	controller.update(c),
);
couponsRouter.patch(
	"/:id",
	requireAdmin,
	validateBody(UpdateCouponSchema),
	(c) => controller.update(c),
);
couponsRouter.delete("/:id", requireAdmin, (c) => controller.delete(c));
