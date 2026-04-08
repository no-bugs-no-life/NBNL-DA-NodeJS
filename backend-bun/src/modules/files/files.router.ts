import { Hono } from "hono";
import { validateBody } from "@/shared/middlewares/validate";
import { FilesController } from "./files.controller";
import { CreateFileSchema, UpdateFileSchema } from "./files.schema";

export const filesRouter = new Hono();
const controller = new FilesController();

// Public Routes
filesRouter.get("/", (c) => controller.getAll(c));
filesRouter.get("/:id", (c) => controller.getById(c));

// Admin Routes (Protected)
// TODO: Add requireAdmin middleware
filesRouter.post("/create", validateBody(CreateFileSchema), (c) =>
	controller.create(c),
);
filesRouter.put("/:id", validateBody(UpdateFileSchema), (c) =>
	controller.update(c),
);
filesRouter.delete("/:id", (c) => controller.delete(c));

// Upload Routes (placeholder)
filesRouter.post("/upload-image", (c) => controller.uploadImage(c));
filesRouter.post("/upload-app-file", (c) => controller.uploadAppFile(c));
filesRouter.post("/uploads/init", (c) => controller.uploadInit(c));
filesRouter.post("/uploads/chunk", (c) => controller.uploadChunk(c));
filesRouter.post("/uploads/complete", (c) => controller.completeUpload(c));
