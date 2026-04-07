import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { env } from "@/config/env";
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
	adminCapacity?: number;
	adminRefillRatePerSec?: number;
	adminRoles?: string[];
}

export const tokenBucketRateLimiter = (
	config: RateLimitConfig,
): MiddlewareHandler => {
	const prefix = config.keyPrefix || "rl:tb:";
	const adminRoles = config.adminRoles || ["ADMIN", "MODERATOR"];

	return async (c, next) => {
		const forwardedFor = c.req.header("x-forwarded-for") || "127.0.0.1";
		const ip = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

		let role: string | undefined;
		let userId: string | undefined;

		try {
			const cookieToken = getCookie(c, "access_token");
			const authHeader = c.req.header("authorization");
			const bearerToken = authHeader?.startsWith("Bearer ")
				? authHeader.slice(7)
				: undefined;
			const token = cookieToken || bearerToken;

			if (token) {
				const payload = (await verify(token, env.JWT_ACCESS_SECRET)) as {
					role?: string;
					sub?: string;
					id?: string;
				};
				role = payload.role;
				userId = payload.sub || payload.id;
			}
		} catch {
			// Ignore invalid token and fallback to normal rate limit.
		}

		const isAdmin = !!role && adminRoles.includes(role);
		const effectiveCapacity = isAdmin
			? (config.adminCapacity ?? config.capacity)
			: config.capacity;
		const effectiveRefillRate = isAdmin
			? (config.adminRefillRatePerSec ?? config.refillRatePerSec)
			: config.refillRatePerSec;

		const keyIdentity = isAdmin ? `admin:${userId || ip}` : `ip:${ip}`;
		const key = `${prefix}${keyIdentity}`;

		const now = Math.floor(Date.now() / 1000);
		const result = (await redisClient.eval(
			TOKEN_BUCKET_SCRIPT,
			1,
			key,
			effectiveCapacity,
			effectiveRefillRate,
			now,
		)) as [number, number];

		const allowed = result[0] === 1;
		const remaining = result[1];

		c.header("X-RateLimit-Limit", effectiveCapacity.toString());
		c.header("X-RateLimit-Remaining", Math.max(0, remaining).toString());

		if (!allowed) {
			c.status(429);
			return c.json(fail("Too Many Requests"));
		}

		await next();
	};
};
