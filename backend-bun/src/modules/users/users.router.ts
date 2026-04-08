import { Hono } from "hono";
import { requireAdmin, requireAuth } from "@/shared/middlewares/auth";
import { validateBody } from "@/shared/middlewares/validate";
import { UsersController } from "./users.controller";
import { RegisterSchema, UpdateProfileSchema } from "./users.schema";

export const usersRouter = new Hono();
const controller = new UsersController();

// Public Routes
usersRouter.post("/register", validateBody(RegisterSchema), (c) =>
	controller.register(c),
);

// Protected Routes - User
usersRouter.get("/me", requireAuth, (c) => controller.getProfile(c));
usersRouter.patch("/me", requireAuth, validateBody(UpdateProfileSchema), (c) =>
	controller.updateProfile(c),
);

// Protected Routes - Admin/Moderator
usersRouter.get("/", requireAdmin, (c) => controller.getAll(c));
usersRouter.get("/:id", requireAdmin, (c) => controller.getById(c));
usersRouter.patch("/:id/role", requireAdmin, (c) => controller.updateRole(c));
usersRouter.patch("/:id/balance", requireAdmin, (c) => controller.addBalance(c));
usersRouter.delete("/:id", requireAdmin, (c) => controller.deleteUser(c));
