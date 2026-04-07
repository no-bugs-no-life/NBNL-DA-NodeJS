import { Hono } from "hono";
import { CategoriesController } from "./categories.controller";
import { validateBody } from "@/shared/middlewares/validate";
import {
	CreateCategorySchema,
	UpdateCategorySchema,
} from "./categories.schema";

export const categoriesRouter = new Hono();
const controller = new CategoriesController();

// Public Routes
categoriesRouter.get("/", (c) => controller.getAll(c));
categoriesRouter.get("/:id", (c) => controller.getById(c));
categoriesRouter.get("/slug/:slug", (c) => controller.getBySlug(c));

// Admin Routes (Protected)
// TODO: Add requireAdmin middleware
categoriesRouter.post("/", validateBody(CreateCategorySchema), (c) =>
	controller.create(c),
);
categoriesRouter.put("/:id", validateBody(UpdateCategorySchema), (c) =>
	controller.update(c),
);
categoriesRouter.delete("/:id", (c) => controller.delete(c));
