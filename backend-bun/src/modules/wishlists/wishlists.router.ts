import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import {
	validateBody,
	validateParams,
	validateQuery,
} from "@/shared/middlewares/validate";
import { WishlistsController } from "./wishlists.controller";
import {
	AddToWishlistSchema,
	CreateWishlistSchema,
	UpdateWishlistSchema,
	WishlistParamsSchema,
	WishlistQuerySchema,
} from "./wishlists.schema";

export const wishlistsRouter = new Hono();
const controller = new WishlistsController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// User Routes (get user from JWT token via middleware)
// Note: For user routes, we'll rely on the JWT payload to extract user

// Public routes not needed for wishlists (always authenticated)

// User Routes - requires JWT, user extracted from token
wishlistsRouter.get("/my", requireAuth, (c) => controller.getMyWishlist(c));
wishlistsRouter.post("/my/apps", requireAuth, validateBody(AddToWishlistSchema), (c) => controller.addApp(c));
wishlistsRouter.delete("/my/apps/:app", requireAuth, (c) => controller.removeApp(c));
wishlistsRouter.delete("/my", requireAuth, (c) => controller.clear(c));

// Admin Routes
wishlistsRouter.get(
	"/",
	requireAuth,
	validateQuery(WishlistQuerySchema),
	(c) => controller.listAll(c),
);
wishlistsRouter.get(
	"/:id",
	requireAuth,
	validateParams(WishlistParamsSchema),
	(c) => controller.getById(c),
);
wishlistsRouter.post(
	"/",
	requireAuth,
	validateBody(CreateWishlistSchema),
	(c) => controller.create(c),
);
wishlistsRouter.put(
	"/:id",
	requireAuth,
	validateParams(WishlistParamsSchema),
	validateBody(UpdateWishlistSchema),
	(c) => controller.update(c),
);
wishlistsRouter.delete(
	"/:id",
	requireAuth,
	validateParams(WishlistParamsSchema),
	(c) => controller.delete(c),
);
