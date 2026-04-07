import { Hono } from "hono";
import { authRouter } from "@/modules/auth";

export const appRouter = new Hono();

// Mount modules API routes
appRouter.route("/auth", authRouter);

// Export router tổng để nhúng vào app chính
