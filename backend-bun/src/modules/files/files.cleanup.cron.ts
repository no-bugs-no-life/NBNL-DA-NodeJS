import cron from "node-cron";
import path from "node:path";
import { readdir, rm } from "node:fs/promises";
import { env } from "@/config/env";
import { mongoose } from "@/infra/db/connection";
import { logger } from "@/infra/logger/logger";

const UPLOADS_ROOT = path.join(process.cwd(), "uploads");
const TEMP_DIR_NAME = "temp";

const toUploadKey = (value: string): string | null => {
	const normalized = value.replace(/\\/g, "/");
	const idx = normalized.indexOf("/uploads/");
	if (idx >= 0) return normalized.slice(idx + "/uploads/".length);
	if (normalized.startsWith("uploads/")) return normalized.slice("uploads/".length);
	return null;
};

const collectUploadKeys = (value: unknown, keys: Set<string>) => {
	if (typeof value === "string") {
		const key = toUploadKey(value);
		if (key) keys.add(key);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collectUploadKeys(item, keys);
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const nested of Object.values(value as Record<string, unknown>)) {
		collectUploadKeys(nested, keys);
	}
};

const collectDiskFiles = async (
	dir: string,
	root: string,
	out: string[],
): Promise<void> => {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const absolute = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === TEMP_DIR_NAME) continue;
			await collectDiskFiles(absolute, root, out);
			continue;
		}
		const relative = path.relative(root, absolute).replace(/\\/g, "/");
		out.push(relative);
	}
};

const fetchReferencedUploadKeys = async (): Promise<Set<string>> => {
	const db = mongoose.connection.db;
	if (!db) throw new Error("Database not connected");

	const keys = new Set<string>();
	const collections = await db.listCollections().toArray();

	for (const collection of collections) {
		if (collection.name.startsWith("system.")) continue;
		const docs = await db.collection(collection.name).find({}).toArray();
		for (const doc of docs) collectUploadKeys(doc, keys);
	}
	return keys;
};

const cleanupOrphanUploads = async () => {
	const referencedKeys = await fetchReferencedUploadKeys();
	const diskFiles: string[] = [];
	await collectDiskFiles(UPLOADS_ROOT, UPLOADS_ROOT, diskFiles);

	let deletedCount = 0;
	for (const fileKey of diskFiles) {
		if (referencedKeys.has(fileKey)) continue;
		await rm(path.join(UPLOADS_ROOT, fileKey), { force: true });
		deletedCount += 1;
	}

	logger.info(
		{ scanned: diskFiles.length, referenced: referencedKeys.size, deleted: deletedCount },
		"Files cleanup cron completed",
	);
};

export function startFilesCleanupCron() {
	cron.schedule(env.FILE_CLEANUP_CRON, async () => {
		try {
			await cleanupOrphanUploads();
		} catch (error) {
			logger.error({ err: error }, "Files cleanup cron failed");
		}
	});
	logger.info(`Files cleanup cron started: ${env.FILE_CLEANUP_CRON}`);
}
