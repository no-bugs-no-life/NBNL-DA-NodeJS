import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import path from "node:path";
import { env } from "@/config/env";
import { logger } from "@/infra/logger/logger";
import { AppError } from "@/shared/errors";

import { tokenBucketRateLimiter } from "@/shared/middlewares";
import { requireAuth } from "@/shared/middlewares/auth";
import { fail } from "@/shared/utils";
import { VersionsService } from "@/modules/versions/versions.service";

const app = new Hono();

// 1. Plugins & Middlewares
app.use(
	"*",
	cors({
		origin: env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(
	"*",
	honoLogger((str) => logger.info(str)),
);

// Global Token Bucket Rate Limit
// - Default users: 10 requests burst, regenerates 2 req/s
// - Admin/Moderator: 60 requests burst, regenerates 12 req/s
app.use(
	"*",
	tokenBucketRateLimiter({
		capacity: 10,
		refillRatePerSec: 2,
		adminCapacity: 60,
		adminRefillRatePerSec: 12,
		adminRoles: ["ADMIN", "MODERATOR"],
	}),
);

import { HTTPException } from "hono/http-exception";

// 2. Global Error Handler
app.onError((err, c) => {
	if (err instanceof AppError) {
		logger.warn(
			{ err: err.message, status: err.statusCode },
			"Operational Error",
		);
		// biome-ignore lint/suspicious/noExplicitAny: Hono expects specific status codes
		return c.json(fail(err.message), err.statusCode as any);
	}

	if (err instanceof HTTPException) {
		return c.json(fail(err.message), err.status);
	}

	logger.error(err, "Unhandled Application Error");
	return c.json(fail("Internal Server Error"), 500);
});

import { appRouter } from "@/routes";

// 3. App Routes & Modules
app.route("/api/v1", appRouter);
const versionsService = new VersionsService();

app.get("/downloads/:downloadId", requireAuth, async (c) => {
	const downloadId = c.req.param("downloadId");
	const payload = c.get("jwtPayload");
	const userId = payload?.id;
	if (!downloadId || !userId) return c.json(fail("Unauthorized"), 401);

	const download = await versionsService.getDownloadLink(downloadId);
	if (!download || download.userId !== userId) {
		return c.json(fail("Unauthorized"), 401);
	}

	return c.redirect(download.fileKey, 302);
});

app.get("/uploads/*", async (c) => {
	const relPath = c.req.path.replace(/^\/uploads\//, "");
	if (relPath.includes("..")) return c.json(fail("Invalid file path"), 400);

	const filePath = path.join(process.cwd(), "uploads", relPath);
	const file = Bun.file(filePath);
	if (!(await file.exists())) return c.json(fail("File not found"), 404);
	return new Response(file);
});

app.get("/", (c) => {
	return c.json({ message: "Hello via Bun & Hono!" });
});

import { closeRedis } from "@/infra/cache/redis";
// 4. Bootstrap Server & Graceful Shutdown
import { closeDatabase } from "@/infra/db/connection";
import { startFilesCleanupCron } from "@/modules/files";
import { startOrderExpireCron, startOrderPaymentCron } from "@/modules/orders";

const gracefulShutdown = async (signal: string) => {
	logger.info(`🛑 Received ${signal}, starting graceful shutdown...`);
	try {
		await closeDatabase();
		await closeRedis();
		process.exit(0);
	} catch (error) {
		logger.error({ err: error }, "❌ Error during graceful shutdown");
		process.exit(1);
	}
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

logger.info(`🚀 Server starting at http://localhost:${env.PORT}`);
startOrderPaymentCron();
startOrderExpireCron();
startFilesCleanupCron();

export default {
	port: env.PORT,
	fetch: app.fetch,
};
