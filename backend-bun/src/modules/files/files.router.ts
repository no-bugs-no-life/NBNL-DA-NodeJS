import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { env } from "@/config/env";
import { FilesController } from "./files.controller";
import { validateBody, validateParams, validateQuery } from "@/shared/middlewares/validate";
import { CreateFileSchema, FileParamsSchema, FileQuerySchema } from "./files.schema";

export const filesRouter = new Hono();
const controller = new FilesController();

const requireAuth = jwt({ secret: env.JWT_ACCESS_SECRET, alg: "HS256" });

// Public Routes
filesRouter.get("/", validateQuery(FileQuerySchema), (c) => controller.list(c));
filesRouter.get("/:id", validateParams(FileParamsSchema), (c) => controller.getById(c));

// Authenticated Routes
filesRouter.post("/", requireAuth, validateBody(CreateFileSchema), (c) => controller.create(c));
filesRouter.delete("/:id", requireAuth, validateParams(FileParamsSchema), (c) => controller.delete(c));

// Internal/Delete by uploader
filesRouter.delete("/uploader/:uploaderId", requireAuth, (c) => controller.deleteByUploader(c));