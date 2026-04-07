import postgres from "postgres";
import { env } from "@/config/env";
import { logger } from "../logger/logger";

const sql = postgres(env.DATABASE_URL, {
	max: 10, // Max concurrent connections
	idle_timeout: 20, // Idle connection timeout in seconds
	max_lifetime: 60 * 30, // Max lifetime of a connection in seconds
	onnotice: () => {}, // Suppress notices
	transform: {
		...postgres.camel, // Camel case columns
		undefined: null,
	},
});

logger.info("📦 PostgreSQL connection pool initialized");

/**
 * Handle graceful shutdown of the database connection
 */
export const closeDatabase = async () => {
	logger.info("⏳ Closing PostgreSQL connection pool...");
	await sql.end();
	logger.info("✅ PostgreSQL connection pool closed gracefully");
};

export { sql };
