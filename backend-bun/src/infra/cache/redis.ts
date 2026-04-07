import Redis from "ioredis";
import { env } from "@/config/env";
import { logger } from "../logger/logger";

const redisClient = new Redis(env.REDIS_URL, {
	maxRetriesPerRequest: 3,
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
});

redisClient.on("connect", () => {
	logger.info("🟢 Redis connected");
});

redisClient.on("error", (error) => {
	logger.error({ err: error }, "❌ Redis connection error");
});

/**
 * Handle graceful shutdown of the Redis connection
 */
export const closeRedis = async () => {
	logger.info("⏳ Closing Redis connection...");
	await redisClient.quit();
	logger.info("✅ Redis connection closed gracefully");
};

/**
 * Cache helper wrapper to standardize operations
 */
export const CacheHelper = {
	async get<T>(key: string): Promise<T | null> {
		const data = await redisClient.get(key);
		return data ? (JSON.parse(data) as T) : null;
	},

	async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
		await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
	},

	async del(key: string): Promise<void> {
		await redisClient.del(key);
	},
};

export { redisClient };
