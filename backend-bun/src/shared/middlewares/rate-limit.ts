import type { MiddlewareHandler } from "hono";
import { redisClient } from "@/infra/cache/redis";
import { fail } from "@/shared/utils";

// Lua script for atomic Token Bucket operation
const TOKEN_BUCKET_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate_per_sec = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local requested = 1

local bucket = redis.call("HMGET", key, "tokens", "last_refreshed")
local tokens = tonumber(bucket[1])
local last_refreshed = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  last_refreshed = now
end

local time_passed = math.max(0, now - last_refreshed)
local tokens_to_add = math.floor(time_passed * refill_rate_per_sec)

tokens = math.min(capacity, tokens + tokens_to_add)

if tokens_to_add > 0 then
  last_refreshed = now
end

if tokens >= requested then
  tokens = tokens - requested
  redis.call("HMSET", key, "tokens", tokens, "last_refreshed", last_refreshed)
  redis.call("EXPIRE", key, math.ceil(capacity / refill_rate_per_sec) * 2)
  return { 1, tokens }
else
  return { 0, tokens }
end
`;

export interface RateLimitConfig {
	capacity: number;
	refillRatePerSec: number;
	keyPrefix?: string;
}

export const tokenBucketRateLimiter = (
	config: RateLimitConfig,
): MiddlewareHandler => {
	const prefix = config.keyPrefix || "rl:tb:";

	return async (c, next) => {
		// Determine the IP address from headers or hono context
		// In production, you might want to use a proxy-trusted header like 'x-forwarded-for'
		const ip = c.req.header("x-forwarded-for") || "127.0.0.1";
		const key = `${prefix}${ip}`;

		// Unix timestamp in seconds
		const now = Math.floor(Date.now() / 1000);

		// Call Lua script atomically
		// eval(script, numKeys, key1, argv1, argv2, argv3)
		const result = (await redisClient.eval(
			TOKEN_BUCKET_SCRIPT,
			1,
			key,
			config.capacity,
			config.refillRatePerSec,
			now,
		)) as [number, number];

		const allowed = result[0] === 1;
		const remaining = result[1];

		c.header("X-RateLimit-Limit", config.capacity.toString());
		c.header("X-RateLimit-Remaining", Math.max(0, remaining).toString());

		if (!allowed) {
			c.status(429);
			return c.json(fail("Too Many Requests"));
		}

		await next();
	};
};
