import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { VersionsController } from "./versions.controller";
import { validateBody, validateParams, validateQuery } from "@/shared/middlewares/validate";
import {
	CreateVersionSchema,
	UpdateVersionSchema,
	VersionParamsSchema,
	VersionQuerySchema,
} from "./versions.schema";

export const versionsRouter = new Hono();
const controller = new VersionsController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireDeveloper = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes
versionsRouter.get("/", validateQuery(VersionQuerySchema), (c) => controller.list(c));
versionsRouter.get("/:id", validateParams(VersionParamsSchema), (c) => controller.getById(c));
versionsRouter.get("/app/:appId", (c) => controller.getByApp(c));
versionsRouter.get("/app/:appId/latest", (c) => controller.getLatestByApp(c));
versionsRouter.get("/app/:appId/platform/:platform", (c) => controller.getByPlatform(c));

// Authenticated Routes
versionsRouter.post("/", requireDeveloper, validateBody(CreateVersionSchema), (c) => controller.create(c));
versionsRouter.put("/:id", requireDeveloper, validateParams(VersionParamsSchema), validateBody(UpdateVersionSchema), (c) =>
	controller.update(c),
);
versionsRouter.delete("/:id", requireDeveloper, validateParams(VersionParamsSchema), (c) => controller.delete(c));

// Publishing Routes
versionsRouter.patch("/:id/publish", requireDeveloper, validateParams(VersionParamsSchema), (c) =>
	controller.publish(c),
);
versionsRouter.patch("/:id/deprecate", requireDeveloper, validateParams(VersionParamsSchema), (c) =>
	controller.deprecate(c),
);
versionsRouter.patch("/app/:appId/:id/latest", requireDeveloper, (c) => controller.markLatest(c));

// Download Routes
versionsRouter.get("/:id/download/:platform", (c) => controller.getDownloadInfo(c));
versionsRouter.get("/download", (c) => controller.download(c));