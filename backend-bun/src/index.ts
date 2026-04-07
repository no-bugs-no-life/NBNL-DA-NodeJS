import { Hono } from "hono";
import { logger as honoLogger } from "hono/logger";
import { env } from "@/config/env";
import { logger } from "@/infra/logger/logger";
import { AppError } from "@/shared/errors";
import { fail } from "@/shared/utils";

import { tokenBucketRateLimiter } from "@/shared/middlewares";

import { cors } from "hono/cors";

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

// Global Token Bucket Rate Limit (Ex: 10 requests maximum burst, regenerates 2 per second)
app.use(
	"*",
	tokenBucketRateLimiter({
		capacity: 10,
		refillRatePerSec: 2,
	}),
);

// 2. Global Error Handler
app.onError((err, c) => {
	if (err instanceof AppError) {
		logger.warn(
			{ err: err.message, status: err.statusCode },
			"Operational Error",
		);
		return c.json(fail(err.message), err.statusCode as any);
	}

	logger.error(err, "Unhandled Application Error");
	return c.json(fail("Internal Server Error"), 500);
});

import { appRouter } from "@/routes";

// 3. App Routes & Modules
app.route("/api/v1", appRouter);

app.get("/", (c) => {
	return c.json({ message: "Hello via Bun & Hono!" });
});

// 4. Bootstrap Server & Graceful Shutdown
import { closeDatabase } from "@/infra/db/connection";
import { closeRedis } from "@/infra/cache/redis";

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

export default {
	port: env.PORT,
	fetch: app.fetch,
};
