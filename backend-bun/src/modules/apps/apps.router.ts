import { Hono, type MiddlewareHandler } from "hono";
import { jwt, verify } from "hono/jwt";
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

const optionalAuth: MiddlewareHandler = async (c, next) => {
	const authHeader = c.req.header("authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		await next();
		return;
	}

	const token = authHeader.slice("Bearer ".length).trim();
	if (!token) {
		await next();
		return;
	}

	try {
		const payload = await verify(token, env.JWT_ACCESS_SECRET, "HS256");
		const id =
			typeof payload.id === "string"
				? payload.id
				: typeof payload.sub === "string"
					? payload.sub
					: undefined;
		const role = typeof payload.role === "string" ? payload.role : undefined;
		if (id && role) {
			c.set("jwtPayload", {
				id,
				role,
				email: typeof payload.email === "string" ? payload.email : undefined,
				exp: typeof payload.exp === "number" ? payload.exp : undefined,
				iat: typeof payload.iat === "number" ? payload.iat : undefined,
			});
		}
	} catch {
		// Ignore invalid token on public endpoint; keep behavior as guest.
	}
	await next();
};

// ============ PUBLIC ROUTES ============

// GET /apps - List apps with filters & pagination
appsRouter.get("/", optionalAuth, validateQuery(AppQuerySchema), (c) =>
	controller.list(c),
);

// GET /apps/:id - Get app by ID
appsRouter.get("/:id", optionalAuth, (c) => controller.getById(c));

// GET /apps/slug/:slug - Get app by slug
appsRouter.get("/slug/:slug", (c) => controller.getBySlug(c));

// GET /apps/developer/:developer - Get apps by developer
appsRouter.get("/developer/:developer", (c) => controller.getByDeveloper(c));

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

// POST /apps/:id/restore - Restore deleted app
appsRouter.post("/:id/restore", requireAuth, (c) => controller.restore(c));

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
