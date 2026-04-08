import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/shared/middlewares/validate";
import { SubPackagesController } from "./sub-packages.controller";
import {
	CreateSubPackageSchema,
	SubPackageParamsSchema,
	SubPackageQuerySchema,
	UpdateSubPackageSchema,
} from "./sub-packages.schema";

export const subPackagesRouter = new Hono();
const controller = new SubPackagesController();

const requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes
subPackagesRouter.get("/", validateQuery(SubPackageQuerySchema), (c) =>
	controller.list(c),
);
subPackagesRouter.get("/global", (c) => controller.getGlobal(c));
subPackagesRouter.get("/:id", validateParams(SubPackageParamsSchema), (c) =>
	controller.getById(c),
);
subPackagesRouter.get("/app/:app", (c) => controller.getByApp(c));

// Admin Routes
subPackagesRouter.post(
	"/",
	requireAdmin,
	validateBody(CreateSubPackageSchema),
	(c) => controller.create(c),
);
subPackagesRouter.put(
	"/:id",
	requireAdmin,
	validateParams(SubPackageParamsSchema),
	validateBody(UpdateSubPackageSchema),
	(c) => controller.update(c),
);
subPackagesRouter.delete(
	"/:id",
	requireAdmin,
	validateParams(SubPackageParamsSchema),
	(c) => controller.delete(c),
);
subPackagesRouter.patch(
	"/:id/toggle",
	requireAdmin,
	validateParams(SubPackageParamsSchema),
	(c) => controller.toggleActive(c),
);
