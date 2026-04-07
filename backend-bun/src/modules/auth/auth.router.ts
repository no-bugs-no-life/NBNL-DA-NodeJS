import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { env } from "@/config/env";
import { AuthController } from "./auth.controller";

export const authRouter = new Hono();
const authController = new AuthController();

/**
 * Middleware: Xác thực JWT từ Cookie
 */
const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token", // Hono JWT middleware tự đọc từ chuỗi cookie này nếu set
	alg: "HS256",
});

import { validateBody } from "@/shared/middlewares/validate";
import { LoginSchema } from "./auth.schema";

// Public Routes
authRouter.post("/login", validateBody(LoginSchema), (c) =>
	authController.login(c),
);
authRouter.post("/refresh", (c) => authController.refresh(c));

// Protected Routes
authRouter.post("/logout", requireAuth, (c) => authController.logout(c));
authRouter.get("/me", requireAuth, (c) => authController.me(c));
