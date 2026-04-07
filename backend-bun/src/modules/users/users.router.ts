import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { UsersController } from "./users.controller";
import { RegisterSchema, UpdateProfileSchema } from "./users.schema";
import { validateBody, validateQuery } from "@/shared/middlewares/validate";

export const usersRouter = new Hono();
const controller = new UsersController();

const requireAuth = jwt({
	secret: env.JWT_ACCESS_SECRET,
	cookie: "access_token",
	alg: "HS256",
});

const requireAdmin = async (c: any, next: any) => {
	await requireAuth(c, async () => {
		const payload = c.get("jwtPayload");
		if (!payload || !["ADMIN", "MODERATOR"].includes(payload.role)) {
			return c.json({ success: false, msg: "Không có quyền truy cập" }, 403);
		}
		await next();
	});
};

// Public Routes
usersRouter.post("/register", validateBody(RegisterSchema), (c) => controller.register(c));

// Protected Routes - User
usersRouter.get("/me", requireAuth, (c) => controller.getProfile(c));
usersRouter.patch("/me", requireAuth, validateBody(UpdateProfileSchema), (c) => controller.updateProfile(c));

// Protected Routes - Admin/Moderator
usersRouter.get("/", requireAdmin, (c) => controller.getAll(c));
usersRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
usersRouter.patch("/:id/role", requireAdmin, (c) => controller.updateRole(c));
usersRouter.delete("/:id", requireAdmin, (c) => controller.deleteUser(c));
