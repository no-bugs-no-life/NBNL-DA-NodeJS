import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/shared/middlewares/validate";
import { VersionsController } from "./versions.controller";
import {
	CreateVersionSchema,
	UpdateVersionSchema,
	VersionParamsSchema,
	VersionQuerySchema,
} from "./versions.schema";

export const versionsRouter = new Hono();
const controller = new VersionsController();

const _requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const _requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireDeveloper = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes
versionsRouter.get("/", validateQuery(VersionQuerySchema), (c) =>
	controller.list(c),
);
versionsRouter.get("/:id", validateParams(VersionParamsSchema), (c) =>
	controller.getById(c),
);
versionsRouter.get("/app/:app", (c) => controller.getByApp(c));
versionsRouter.get("/app/:app/latest", (c) => controller.getLatestByApp(c));
versionsRouter.get("/app/:app/platform/:platform", (c) =>
	controller.getByPlatform(c),
);

// Authenticated Routes
versionsRouter.post(
	"/",
	requireDeveloper,
	validateBody(CreateVersionSchema),
	(c) => controller.create(c),
);
versionsRouter.put(
	"/:id",
	requireDeveloper,
	validateParams(VersionParamsSchema),
	validateBody(UpdateVersionSchema),
	(c) => controller.update(c),
);
versionsRouter.delete(
	"/:id",
	requireDeveloper,
	validateParams(VersionParamsSchema),
	(c) => controller.delete(c),
);

// Publishing Routes
versionsRouter.patch(
	"/:id/publish",
	requireDeveloper,
	validateParams(VersionParamsSchema),
	(c) => controller.publish(c),
);
versionsRouter.patch(
	"/:id/deprecate",
	requireDeveloper,
	validateParams(VersionParamsSchema),
	(c) => controller.deprecate(c),
);
versionsRouter.patch("/app/:app/:id/latest", requireDeveloper, (c) =>
	controller.markLatest(c),
);

// Download Routes
versionsRouter.get("/:id/download/:platform", (c) =>
	controller.getDownloadInfo(c),
);
versionsRouter.get("/download", (c) => controller.download(c));
