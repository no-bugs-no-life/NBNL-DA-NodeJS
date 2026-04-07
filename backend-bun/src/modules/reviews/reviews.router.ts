import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { ReviewsController } from "./reviews.controller";
import { validateBody, validateParams, validateQuery } from "@/shared/middlewares/validate";
import { CreateReviewSchema, UpdateReviewSchema, ReviewParamsSchema, ReviewQuerySchema } from "./reviews.schema";

export const reviewsRouter = new Hono();
const controller = new ReviewsController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });
const requireAdmin = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes
reviewsRouter.get("/", validateQuery(ReviewQuerySchema), (c) => controller.list(c));
reviewsRouter.get("/:id", validateParams(ReviewParamsSchema), (c) => controller.getById(c));
reviewsRouter.get("/app/:appId", (c) => controller.getByApp(c));

// Authenticated User Routes
reviewsRouter.post("/", requireAuth, validateBody(CreateReviewSchema), (c) => controller.create(c));
reviewsRouter.put("/:id", requireAuth, validateParams(ReviewParamsSchema), validateBody(UpdateReviewSchema), (c) =>
	controller.update(c),
);
reviewsRouter.delete("/:id", requireAuth, validateParams(ReviewParamsSchema), (c) => controller.delete(c));

// Admin Routes (for moderation)
reviewsRouter.patch("/:id/status", requireAdmin, validateParams(ReviewParamsSchema), (c) => {
	// Handle status update separately if needed
	return controller.update(c);
});