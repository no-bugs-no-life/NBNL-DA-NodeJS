import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	PORT: z.coerce.number().default(3000),
	LOG_LEVEL: z
		.enum(["fatal", "error", "warn", "info", "debug", "trace"])
		.default("info"),
	MONGODB_URI: z.string().url().default("mongodb://localhost:27017/nbnl"),
	REDIS_URL: z.string().url().default("redis://localhost:6379"),
	JWT_ACCESS_SECRET: z.string().min(10).default("super-secret-access-key-dev"),
	JWT_REFRESH_SECRET: z
		.string()
		.min(10)
		.default("super-secret-refresh-key-dev"),
	JWT_ACCESS_EXPIRES_IN: z.coerce.number().default(900), // 15 mins
	JWT_REFRESH_EXPIRES_IN: z.coerce.number().default(604800), // 7 days
	CORS_ORIGIN: z.string().default("*"),
	GOOGLE_CLIENT_ID: z.string().min(10).optional(),
	GOOGLE_REDIRECT_URI: z
		.string()
		.default("http://localhost:4000/auth/google/auth/google/callback"),
	FRONTEND_URL: z.string().default("http://localhost:4000"),
	SEPAY_TOKEN: z.string().optional(),
	SEPAY_ACCOUNT_NUMBER: z.string().optional(),
	SEPAY_POLL_CRON: z.string().default("*/1 * * * * *"),
	/** Sau bấy nhiêu phút kể từ createdAt, đơn pending/processing tự hủy */
	ORDER_PAYMENT_TIMEOUT_MINUTES: z.coerce.number().min(1).max(1440).default(15),
	/** Cron hủy đơn quá hạn (node-cron 6 trường: giây phút ...) */
	ORDER_EXPIRE_CRON: z.string().default("0 * * * * *"),
	FILE_CLEANUP_CRON: z.string().default("0 * * * *"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("❌ Invalid environment variables:", _env.error.format());
	process.exit(1);
}

export const env = _env.data;
