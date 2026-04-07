import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { TagsController } from "./tags.controller";
import { validateBody, validateParams } from "@/shared/middlewares/validate";
import { CreateTagSchema, UpdateTagSchema, TagParamsSchema } from "./tags.schema";

export const tagsRouter = new Hono();
const controller = new TagsController();

const requireAdmin = jwt({
	secret: env.JWT_ACCESS_SECRET,
	alg: "HS256",
});

// Public Routes
tagsRouter.get("/", (c) => controller.list(c));
tagsRouter.get("/:id", validateParams(TagParamsSchema), (c) => controller.getById(c));

// Admin Routes (Protected)
tagsRouter.post("/", requireAdmin, validateBody(CreateTagSchema), (c) => controller.create(c));
tagsRouter.put("/:id", requireAdmin, validateParams(TagParamsSchema), validateBody(UpdateTagSchema), (c) =>
	controller.update(c),
);
tagsRouter.delete("/:id", requireAdmin, validateParams(TagParamsSchema), (c) => controller.delete(c));
