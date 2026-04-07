import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace"])
		.default("info"),
	DATABASE_URL: z.string().url(),
	REDIS_URL: z.string().url().default("redis://localhost:6379"),
	JWT_ACCESS_SECRET: z.string().min(10).default("super-secret-access-key-dev"),
	JWT_REFRESH_SECRET: z.string().min(10).default("super-secret-refresh-key-dev"),
	JWT_ACCESS_EXPIRES_IN: z.coerce.number().default(900), // 15 mins
	JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(604800), // 7 days
	CORS_ORIGIN: z.string().default("*"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:", _env.error.format());
	process.exit(1);
}

export const env = _env.data;
