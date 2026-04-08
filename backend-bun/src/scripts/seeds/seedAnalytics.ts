import type { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertMany } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedAnalytics } from "./data/analyticsData";

type AnalyticsDoc = {
	appId: ObjectId;
	date: string;
	views: number;
	downloads: number;
	installs: number;
	activeUsers: number;
	ratingAverage: number;
	crashCount: number;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedAnalyticsCollection() {
	ensureMin(seedAnalytics, SEED_MIN_PER_COLLECTION, "seedAnalytics");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<AnalyticsDoc>("analytics");

	console.log("⏳ Seeding analytics...");

	const appSlugs = [...new Set(seedAnalytics.map((r) => r.appSlug))];
	const appDocs = await db
		.collection("apps")
		.find({ slug: { $in: appSlugs } })
		.project({ _id: 1, slug: 1 })
		.toArray();
	const appIdBySlug = new Map<string, ObjectId>(
		appDocs
			.filter(
				(a): a is { _id: ObjectId; slug: string } =>
					typeof a === "object" &&
					a !== null &&
					"slug" in a &&
					"_id" in a &&
					typeof a.slug === "string",
			)
			.map((a) => [a.slug, a._id]),
	);

	await upsertMany({
		collection: col,
		items: seedAnalytics.map((r) => {
			const appId = appIdBySlug.get(r.appSlug);
			if (!appId) throw new Error(`Missing app for slug=${r.appSlug}`);

			const insert: AnalyticsDoc = {
				appId,
				date: r.date,
				views: r.views,
				downloads: r.downloads,
				installs: r.installs,
				activeUsers: r.activeUsers,
				ratingAverage: r.ratingAverage,
				crashCount: r.crashCount,
				createdAt: r.createdAt,
				updatedAt: r.updatedAt,
			};

			return {
				filter: { appId, date: r.date } as Partial<AnalyticsDoc>,
				insert,
				set: {
					views: r.views,
					downloads: r.downloads,
					installs: r.installs,
					activeUsers: r.activeUsers,
					ratingAverage: r.ratingAverage,
					crashCount: r.crashCount,
					updatedAt: r.updatedAt,
				},
			};
		}),
	});

	console.log(`✅ Analytics upserted: ${seedAnalytics.length}`);
}

