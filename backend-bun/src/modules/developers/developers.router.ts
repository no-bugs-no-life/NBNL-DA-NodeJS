import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { validateBody, validateQuery } from "@/shared/middlewares/validate";
import { DevelopersController } from "./developers.controller";
import {
	ApproveDeveloperSchema,
	CreateDeveloperSchema,
	DeveloperQuerySchema,
	RejectDeveloperSchema,
	RevokeDeveloperSchema,
	UpdateDeveloperSchema,
} from "./developers.schema";

export const developersRouter = new Hono();
const controller = new DevelopersController();

// Auth middleware
const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	alg: "HS256",
});

// ============ PUBLIC ROUTES (with auth) ============

// GET /developers - List all developers
developersRouter.get(
	"/",
	requireAuth,
	validateQuery(DeveloperQuerySchema),
	(c) => controller.list(c),
);

// GET /developers/my - Get my developer profile
developersRouter.get("/my", requireAuth, (c) => controller.getMyProfile(c));

// GET /developers/my/apps - Get my apps
developersRouter.get("/my/apps", requireAuth, (c) => controller.getMyApps(c));

// GET /developers/:id - Get developer by ID
developersRouter.get("/:id", requireAuth, (c) => controller.getById(c));

// ============ PROTECTED ROUTES ============

// POST /developers - Create developer profile
developersRouter.post(
	"/",
	requireAuth,
	validateBody(CreateDeveloperSchema),
	(c) => controller.create(c),
);

// PUT /developers/:id - Update developer
developersRouter.put(
	"/:id",
	requireAuth,
	validateBody(UpdateDeveloperSchema),
	(c) => controller.update(c),
);

// DELETE /developers/:id - Delete developer
developersRouter.delete("/:id", requireAuth, (c) => controller.delete(c));

// ============ ADMIN ROUTES ============

// PUT /developers/:id/approve - Approve developer
developersRouter.put(
	"/:id/approve",
	requireAuth,
	validateBody(ApproveDeveloperSchema),
	(c) => controller.approve(c),
);

// PUT /developers/:id/reject - Reject developer
developersRouter.put(
	"/:id/reject",
	requireAuth,
	validateBody(RejectDeveloperSchema),
	(c) => controller.reject(c),
);

// PUT /developers/:id/revoke - Revoke developer access
developersRouter.put(
	"/:id/revoke",
	requireAuth,
	validateBody(RevokeDeveloperSchema),
	(c) => controller.revoke(c),
);

// PUT /developers/:id/permissions - Update permissions
developersRouter.put("/:id/permissions", requireAuth, (c) =>
	controller.updatePermissions(c),
);
