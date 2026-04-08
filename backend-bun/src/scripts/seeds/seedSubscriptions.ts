import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertMany } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedSubscriptions } from "./data/subscriptionsData";

type SubscriptionDoc = {
	user: string;
	app: string;
	subPackage: string;
	status: "active" | "expired" | "cancelled";
	startDate: Date;
	endDate: Date;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedSubscriptionsCollection() {
	ensureMin(seedSubscriptions, SEED_MIN_PER_COLLECTION, "seedSubscriptions");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<SubscriptionDoc>("subscriptions");

	console.log("⏳ Seeding subscriptions...");

	const userEmails = [...new Set(seedSubscriptions.map((s) => s.userEmail))];
	const appSlugs = [...new Set(seedSubscriptions.map((s) => s.appSlug))];
	const pkgKeys = [...new Set(seedSubscriptions.map((s) => s.subPackageSeedKey))];

	const [userDocs, appDocs, pkgDocs] = await Promise.all([
		db
			.collection("users")
			.find({ email: { $in: userEmails } })
			.project({ _id: 1, email: 1 })
			.toArray(),
		db
			.collection("apps")
			.find({ slug: { $in: appSlugs } })
			.project({ _id: 1, slug: 1 })
			.toArray(),
		db
			.collection("sub_packages")
			.find({ seedKey: { $in: pkgKeys } })
			.project({ _id: 1, seedKey: 1 })
			.toArray(),
	]);

	const userIdByEmail = new Map<string, string>(
		userDocs
			.filter(
				(u): u is { _id: { toString(): string }; email: string } =>
					typeof u === "object" &&
					u !== null &&
					"email" in u &&
					"_id" in u &&
					typeof u.email === "string",
			)
			.map((u) => [u.email, u._id.toString()]),
	);
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
	const pkgIdBySeedKey = new Map<string, string>(
		pkgDocs
			.filter(
				(p): p is { _id: { toString(): string }; seedKey: string } =>
					typeof p === "object" &&
					p !== null &&
					"seedKey" in p &&
					"_id" in p &&
					typeof p.seedKey === "string",
			)
			.map((p) => [p.seedKey, p._id.toString()]),
	);

	await upsertMany({
		collection: col,
		items: seedSubscriptions.map((s) => {
			const userId = userIdByEmail.get(s.userEmail);
			const appId = appIdBySlug.get(s.appSlug);
			const pkgId = pkgIdBySeedKey.get(s.subPackageSeedKey);
			if (!userId) throw new Error(`Missing user for email=${s.userEmail}`);
			if (!appId) throw new Error(`Missing app for slug=${s.appSlug}`);
			if (!pkgId) throw new Error(`Missing sub package for seedKey=${s.subPackageSeedKey}`);

			const insert: SubscriptionDoc = {
				user: userId,
				app: appId,
				subPackage: pkgId,
				status: s.status,
				startDate: s.startDate,
				endDate: s.endDate,
				isDeleted: false,
				createdAt: s.createdAt,
				updatedAt: s.updatedAt,
			};

			return {
				filter: {
					user: userId,
					app: appId,
					subPackage: pkgId,
					startDate: s.startDate,
				} as Partial<SubscriptionDoc>,
				insert,
				set: {
					status: s.status,
					endDate: s.endDate,
					updatedAt: s.updatedAt,
					isDeleted: false,
				},
			};
		}),
	});

	console.log(`✅ Subscriptions upserted: ${seedSubscriptions.length}`);
}
