import { Hono } from "hono";
import { jwt } from "hono/jwt";
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
import {
	ChangePasswordSchema,
	LoginSchema,
	GoogleVerifySchema,
	VerifyTwoFactorSchema,
} from "./auth.schema";

// Public Routes
authRouter.post("/login", validateBody(LoginSchema), (c) =>
	authController.login(c),
);
authRouter.post("/refresh", (c) => authController.refresh(c));

authRouter.get("/google", (c) => authController.googleStart(c));
authRouter.get("/google/callback", (c) => authController.googleCallback(c));
authRouter.post("/google/verify", validateBody(GoogleVerifySchema), (c) =>
	authController.googleVerify(c),
);

// Protected Routes
authRouter.post("/logout", requireAuth, (c) => authController.logout(c));
authRouter.get("/me", requireAuth, (c) => authController.me(c));
authRouter.get("/security-status", requireAuth, (c) =>
	authController.securityStatus(c),
);
authRouter.post(
	"/change-password",
	requireAuth,
	validateBody(ChangePasswordSchema),
	(c) => authController.changePassword(c),
);
authRouter.post("/enable-2fa", requireAuth, (c) =>
	authController.enableTwoFactor(c),
);
authRouter.post(
	"/verify-2fa",
	requireAuth,
	validateBody(VerifyTwoFactorSchema),
	(c) => authController.verifyTwoFactor(c),
);
