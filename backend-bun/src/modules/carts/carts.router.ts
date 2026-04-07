import { Hono } from "hono";
import { requireAdmin, requireAuth } from "@/shared/middlewares/auth";
import { validateBody } from "@/shared/middlewares/validate";
import { CartsController } from "./carts.controller";
import {
	AddToCartSchema,
	CreateCartSchema,
	UpdateCartItemSchema,
} from "./carts.schema";

export const cartsRouter = new Hono();
const controller = new CartsController();

// ===== User Cart Routes =====
// GET /carts/my - Get user's cart
cartsRouter.get("/my", requireAuth, (c) => controller.getCart(c));

// POST /carts/my/items - Add item to cart
cartsRouter.post("/my/items", requireAuth, validateBody(AddToCartSchema), (c) =>
	controller.addItem(c),
);

// PUT /carts/my/items/:app - Update cart item
cartsRouter.put(
	"/my/items/:app",
	requireAuth,
	validateBody(UpdateCartItemSchema),
	(c) => controller.updateItem(c),
);

// DELETE /carts/my/items/:app - Remove item from cart
cartsRouter.delete("/my/items/:app", requireAuth, (c) =>
	controller.removeItem(c),
);

// DELETE /carts/my - Clear cart
cartsRouter.delete("/my", requireAuth, (c) => controller.clearCart(c));

// ===== Admin Cart Routes =====
// GET /carts - Get all carts (paginated)
cartsRouter.get("/", requireAdmin, (c) => controller.getAllCarts(c));

// POST /carts/admin/:user/items - Admin creates cart for user
cartsRouter.post(
	"/admin/:user/items",
	requireAdmin,
	validateBody(CreateCartSchema),
	(c) => controller.createCart(c),
);

// DELETE /carts/:id - Admin deletes cart by ID
cartsRouter.delete("/:id", requireAdmin, (c) => controller.deleteCart(c));
