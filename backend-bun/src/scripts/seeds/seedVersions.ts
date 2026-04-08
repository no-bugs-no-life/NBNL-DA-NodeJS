import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertMany } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedVersions } from "./data/versionsData";

type VersionDoc = {
	app: string;
	versionNumber: string;
	versionCode: number;
	releaseName?: string;
	changelog?: string;
	files: Array<{
		platform: string;
		fileKey: string;
		fileName: string;
		fileSize: number;
		mimeType?: string;
		checksum?: string;
	}>;
	accessControl: {
		isFree: boolean;
		requiresPurchase: boolean;
		requiredSubscription: "premium" | "pro" | null;
		allowedRoles: string[];
		allowedUserIds: string[];
	};
	status: string;
	isLatest: boolean;
	publishedAt?: Date;
	downloadCount: number;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedVersionsCollection() {
	ensureMin(seedVersions, SEED_MIN_PER_COLLECTION, "seedVersions");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<VersionDoc>("versions");

	console.log("⏳ Seeding versions...");

	const appSlugs = [...new Set(seedVersions.map((v) => v.appSlug))];
	const appDocs = await db
		.collection("apps")
		.find({ slug: { $in: appSlugs } })
		.project({ _id: 1, slug: 1 })
		.toArray();
	const appIdBySlug = new Map<string, string>(
		appDocs
			.filter(
				(a): a is { _id: { toString(): string }; slug: string } =>
					typeof a === "object" &&
					a !== null &&
					"slug" in a &&
					"_id" in a &&
					typeof a.slug === "string",
			)
			.map((a) => [a.slug, a._id.toString()]),
	);

	await upsertMany({
		collection: col,
		items: seedVersions.map((v) => {
			const appId = appIdBySlug.get(v.appSlug);
			if (!appId) throw new Error(`Missing app for slug=${v.appSlug}`);

			const insert: VersionDoc = {
				app: appId,
				versionNumber: v.versionNumber,
				versionCode: v.versionCode,
				releaseName: v.releaseName,
				changelog: v.changelog,
				files: v.files,
				accessControl: {
					isFree: v.accessControl?.isFree ?? false,
					requiresPurchase: v.accessControl?.requiresPurchase ?? true,
					requiredSubscription: v.accessControl?.requiredSubscription ?? null,
					allowedRoles: v.accessControl?.allowedRoles ?? [],
					allowedUserIds: v.accessControl?.allowedUserIds ?? [],
				},
				status: v.status,
				isLatest: v.isLatest,
				publishedAt: v.publishedAt,
				downloadCount: v.downloadCount ?? 0,
				isDeleted: false,
				createdAt: v.publishedAt ?? new Date(),
				updatedAt: v.publishedAt ?? new Date(),
			};

			return {
				filter: { app: appId, versionCode: v.versionCode } as Partial<VersionDoc>,
				insert,
				set: {
					status: v.status,
					isLatest: v.isLatest,
					publishedAt: v.publishedAt,
					downloadCount: v.downloadCount ?? 0,
					updatedAt: new Date(),
				},
			};
		}),
	});

	console.log(`✅ Versions upserted: ${seedVersions.length}`);
}
