import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { validateBody } from "@/shared/middlewares/validate";
import { CartsController } from "./carts.controller";
import {
	AddToCartSchema,
	CreateCartSchema,
	UpdateCartItemSchema,
} from "./carts.schema";

export const cartsRouter = new Hono();
const controller = new CartsController();

const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token",
	alg: "HS256",
});

// biome-ignore lint/suspicious/noExplicitAny: Hono context types
const requireAdmin = async (c: any, next: any) => {
	await requireAuth(c, async () => {
		const payload = c.get("jwtPayload");
		if (!payload || !["ADMIN", "MODERATOR"].includes(payload.role)) {
			return c.json({ success: false, msg: "Không có quyền truy cập" }, 403);
		}
		await next();
	});
};

// ===== User Cart Routes =====
// GET /carts - Get user's cart
cartsRouter.get("/", requireAuth, (c) => controller.getCart(c));

// POST /carts/items - Add item to cart
cartsRouter.post("/items", requireAuth, validateBody(AddToCartSchema), (c) =>
	controller.addItem(c),
);

// PUT /carts/items/:appId - Update cart item
cartsRouter.put(
	"/items/:appId",
	requireAuth,
	validateBody(UpdateCartItemSchema),
	(c) => controller.updateItem(c),
);

// DELETE /carts/items/:appId - Remove item from cart
cartsRouter.delete("/items/:appId", requireAuth, (c) =>
	controller.removeItem(c),
);

// DELETE /carts - Clear cart
cartsRouter.delete("/", requireAuth, (c) => controller.clearCart(c));

// ===== Admin Cart Routes =====
// GET /carts/all - Get all carts (paginated)
cartsRouter.get("/all", requireAdmin, (c) => controller.getAllCarts(c));

// POST /carts/admin/:userId/items - Admin creates cart for user
cartsRouter.post(
	"/admin/:userId/items",
	requireAdmin,
	validateBody(CreateCartSchema),
	(c) => controller.createCart(c),
);

// DELETE /carts/:id - Admin deletes cart by ID
cartsRouter.delete("/:id", requireAdmin, (c) => controller.deleteCart(c));
