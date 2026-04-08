import { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedReviews } from "./data/reviewsData";

type ReviewDoc = {
	// Keep both legacy and current fields to satisfy existing DB indexes.
	app: string;
	user: string;
	appId: ObjectId;
	userId: ObjectId;
	rating: number;
	comment: string;
	status: "pending" | "approved" | "rejected";
	createdAt: Date;
	updatedAt: Date;
};

export async function seedReviewsCollection() {
	ensureMin(seedReviews, SEED_MIN_PER_COLLECTION, "seedReviews");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<ReviewDoc>("reviews");

	console.log("⏳ Seeding reviews...");

	const userEmails = [...new Set(seedReviews.map((r) => r.userEmail))];
	const appSlugs = [...new Set(seedReviews.map((r) => r.appSlug))];

	const [userDocs, appDocs] = await Promise.all([
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

	for (const r of seedReviews) {
		const userId = userIdByEmail.get(r.userEmail);
		const appId = appIdBySlug.get(r.appSlug);
		if (!userId) throw new Error(`Missing user for email=${r.userEmail}`);
		if (!appId) throw new Error(`Missing app for slug=${r.appSlug}`);
		if (!ObjectId.isValid(userId) || !ObjectId.isValid(appId)) {
			throw new Error(`Invalid ObjectId for review user/app: ${userId}/${appId}`);
		}
		const userIdObj = new ObjectId(userId);
		const appIdObj = new ObjectId(appId);

		await col.updateOne(
			{
				$or: [
					{ user: userId, app: appId },
					{ userId: userIdObj, appId: appIdObj },
				],
			},
			{
				$setOnInsert: { createdAt: r.createdAt },
				$set: {
					user: userId,
					app: appId,
					userId: userIdObj,
					appId: appIdObj,
					rating: r.rating,
					comment: r.comment,
					status: r.status,
					updatedAt: r.updatedAt,
				},
			},
			{ upsert: true },
		);
	}

	console.log(`✅ Reviews upserted: ${seedReviews.length}`);
}

