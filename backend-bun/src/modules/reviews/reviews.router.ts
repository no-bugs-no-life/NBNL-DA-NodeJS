import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/shared/middlewares/validate";
import { ReviewsController } from "./reviews.controller";
import {
	AdminReviewQuerySchema,
	CreateReviewSchema,
	ReviewParamsSchema,
	ReviewQuerySchema,
	UpdateReviewSchema,
} from "./reviews.schema";

export const reviewsRouter = new Hono();
const controller = new ReviewsController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes
reviewsRouter.get("/", validateQuery(ReviewQuerySchema), (c) =>
	controller.list(c),
);
reviewsRouter.get("/:id", validateParams(ReviewParamsSchema), (c) =>
	controller.getById(c),
);
reviewsRouter.get("/app/:app", (c) => controller.getByApp(c));

// Authenticated User Routes
reviewsRouter.post("/", requireAuth, validateBody(CreateReviewSchema), (c) =>
	controller.create(c),
);
reviewsRouter.put(
	"/:id",
	requireAuth,
	validateParams(ReviewParamsSchema),
	validateBody(UpdateReviewSchema),
	(c) => controller.update(c),
);
reviewsRouter.delete(
	"/:id",
	requireAuth,
	validateParams(ReviewParamsSchema),
	(c) => controller.delete(c),
);

// Admin Routes
// GET /reviews - List all reviews (admin) - defaults to pending status
reviewsRouter.get(
	"/pending",
	requireAdmin,
	validateQuery(AdminReviewQuerySchema),
	(c) => controller.listAdmin(c),
);
reviewsRouter.get(
	"/admin",
	requireAdmin,
	validateQuery(ReviewQuerySchema),
	(c) => controller.listAdmin(c),
);

// Admin CRUD
reviewsRouter.post(
	"/admin",
	requireAdmin,
	validateBody(CreateReviewSchema),
	(c) => controller.createAdmin(c),
);
reviewsRouter.put(
	"/admin/:id",
	requireAdmin,
	validateParams(ReviewParamsSchema),
	validateBody(UpdateReviewSchema),
	(c) => controller.updateAdmin(c),
);
reviewsRouter.delete(
	"/admin/:id",
	requireAdmin,
	validateParams(ReviewParamsSchema),
	(c) => controller.deleteAdmin(c),
);

// Admin actions
reviewsRouter.post(
	"/:id/approve",
	requireAdmin,
	validateParams(ReviewParamsSchema),
	(c) => controller.approve(c),
);
reviewsRouter.post(
	"/:id/reject",
	requireAdmin,
	validateParams(ReviewParamsSchema),
	(c) => controller.reject(c),
);
reviewsRouter.post(
	"/:id/reset",
	requireAdmin,
	validateParams(ReviewParamsSchema),
	(c) => controller.reset(c),
);
