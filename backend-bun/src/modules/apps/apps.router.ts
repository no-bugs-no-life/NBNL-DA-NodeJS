import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { validateBody, validateQuery } from "@/shared/middlewares/validate";
import { AppsController } from "./apps.controller";
import {
	AppQuerySchema,
	CreateAppSchema,
	UpdateAppSchema,
} from "./apps.schema";

export const appsRouter = new Hono();
const controller = new AppsController();

// Auth middleware for protected routes
const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	alg: "HS256",
});

// ============ PUBLIC ROUTES ============

// GET /apps - List apps with filters & pagination
appsRouter.get("/", validateQuery(AppQuerySchema), (c) => controller.list(c));

// GET /apps/:id - Get app by ID
appsRouter.get("/:id", (c) => controller.getById(c));

// GET /apps/slug/:slug - Get app by slug
appsRouter.get("/slug/:slug", (c) => controller.getBySlug(c));

// GET /apps/developer/:developerId - Get apps by developer
appsRouter.get("/developer/:developerId", (c) => controller.getByDeveloper(c));

// ============ PROTECTED ROUTES (Developer/Admin) ============

// POST /apps - Create new app (Developer)
appsRouter.post("/", requireAuth, validateBody(CreateAppSchema), (c) =>
	controller.create(c),
);

// PUT /apps/:id - Update app (Developer/Admin)
appsRouter.put("/:id", requireAuth, validateBody(UpdateAppSchema), (c) =>
	controller.update(c),
);

// DELETE /apps/:id - Soft delete app (Developer/Admin)
appsRouter.delete("/:id", requireAuth, (c) => controller.delete(c));

// ============ ADMIN ROUTES ============

// POST /apps/approve/:id - Approve and publish app
appsRouter.post("/approve/:id", requireAuth, (c) => controller.approve(c));

// POST /apps/publish/:id - Publish app
appsRouter.post("/publish/:id", requireAuth, (c) => controller.publish(c));

// POST /apps/reject/:id - Reject app
appsRouter.post("/reject/:id", requireAuth, (c) => controller.reject(c));

// PATCH /apps/:id/disable - Disable/toggle app
appsRouter.patch("/:id/disable", requireAuth, (c) => controller.disable(c));

// PATCH /apps/:id/toggle-disable - Toggle disable status (alias)
appsRouter.patch("/:id/toggle-disable", requireAuth, (c) =>
	controller.toggleDisable(c),
);

// PATCH /apps/:id/status - Update app status
appsRouter.patch("/:id/status", requireAuth, async (c) =>
	controller.updateStatus(c),
);
