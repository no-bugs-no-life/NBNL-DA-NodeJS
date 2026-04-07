import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { AppsController } from "./apps.controller";
import { CreateAppSchema, UpdateAppSchema } from "./apps.schema";

export const appsRouter = new Hono();
const controller = new AppsController();

// Auth middleware for protected routes
const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	alg: "HS256",
});

// ============ PUBLIC ROUTES ============

// GET /apps - List apps with filters & pagination
appsRouter.get("/", (c) => controller.list(c));

// GET /apps/:id - Get app by ID
appsRouter.get("/:id", (c) => controller.getById(c));

// GET /apps/slug/:slug - Get app by slug
appsRouter.get("/slug/:slug", (c) => controller.getBySlug(c));

// GET /apps/developer/:developerId - Get apps by developer
appsRouter.get("/developer/:developerId", (c) => controller.getByDeveloper(c));

// ============ PROTECTED ROUTES (Developer/Admin) ============

// POST /apps - Create new app (Developer)
appsRouter.post("/", requireAuth, async (c) => controller.create(c));

// PUT /apps/:id - Update app (Developer/Admin)
appsRouter.put("/:id", requireAuth, async (c) => controller.update(c));

// DELETE /apps/:id - Soft delete app (Developer/Admin)
appsRouter.delete("/:id", requireAuth, async (c) => controller.delete(c));

// ============ ADMIN ROUTES ============

// PATCH /apps/:id/status - Update app status (Admin only)
appsRouter.patch("/:id/status", requireAuth, async (c) => controller.updateStatus(c));

// PATCH /apps/:id/toggle-disable - Toggle disable status (Admin only)
appsRouter.patch("/:id/toggle-disable", requireAuth, async (c) => controller.toggleDisable(c));
