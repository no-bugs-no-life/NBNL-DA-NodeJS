import mongoose from "mongoose";
import { env } from "@/config/env";
import { logger } from "../logger/logger";

let isConnected = false;

const connectDB = async () => {
	if (isConnected) {
		logger.info("📦 Mongoose already connected");
		return mongoose.connection;
	}

	try {
		logger.info("⏳ Connecting to MongoDB...");
		await mongoose.connect(env.MONGODB_URI);
		isConnected = true;
		logger.info("✅ MongoDB connected successfully");
		return mongoose.connection;
	} catch (error) {
		logger.error({ err: error }, "❌ MongoDB connection error");
		process.exit(1);
	}
};

mongoose.connection.on("disconnected", () => {
	logger.warn("⚠️ MongoDB disconnected");
	isConnected = false;
});

/**
 * Handle graceful shutdown of the database connection
 */
export const closeDatabase = async () => {
	logger.info("⏳ Closing MongoDB connection...");
	await mongoose.connection.close();
	logger.info("✅ MongoDB connection closed gracefully");
};

// Initiate connection immediately (optional, or let index.ts await connectDB())
connectDB();

export { connectDB, mongoose };
