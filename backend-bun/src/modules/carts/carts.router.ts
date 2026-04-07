import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { CartsController } from "./carts.controller";
import { AddToCartSchema, UpdateCartItemSchema } from "./carts.schema";
import { validateBody } from "@/shared/middlewares/validate";

export const cartsRouter = new Hono();
const controller = new CartsController();

const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token",
	alg: "HS256",
});

// Protected Routes - User must be logged in
cartsRouter.get("/", requireAuth, (c) => controller.getCart(c));
cartsRouter.post("/", requireAuth, validateBody(AddToCartSchema), (c) => controller.addItem(c));
cartsRouter.patch("/:appId", requireAuth, validateBody(UpdateCartItemSchema), (c) => controller.updateItem(c));
cartsRouter.delete("/:appId", requireAuth, (c) => controller.removeItem(c));
cartsRouter.delete("/", requireAuth, (c) => controller.clearCart(c));
