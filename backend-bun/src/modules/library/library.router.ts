import { Hono } from "hono";
import { requireAuth } from "@/shared/middlewares/auth";
import { LibraryController } from "./library.controller";

export const libraryRouter = new Hono();
const controller = new LibraryController();

libraryRouter.get("/my", requireAuth, (c) => controller.getMyLibrary(c));
