import { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedWishlists } from "./data/wishlistsData";

type WishlistDoc = {
	user: string;
	userId: ObjectId;
	apps: string[];
	createdAt: Date;
	updatedAt: Date;
};

export async function seedWishlistsCollection() {
	ensureMin(seedWishlists, SEED_MIN_PER_COLLECTION, "seedWishlists");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<WishlistDoc>("wishlists");

	console.log("⏳ Seeding wishlists...");

	const userEmails = [...new Set(seedWishlists.map((w) => w.userEmail))];
	const appSlugs = [...new Set(seedWishlists.flatMap((w) => w.appSlugs))];

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

	for (const w of seedWishlists) {
		const userIdStr = userIdByEmail.get(w.userEmail);
		if (!userIdStr) throw new Error(`Missing user for email=${w.userEmail}`);
		if (!ObjectId.isValid(userIdStr)) throw new Error(`Invalid userId: ${userIdStr}`);
		const userIdObj = new ObjectId(userIdStr);

		const apps = w.appSlugs
			.map((slug) => appIdBySlug.get(slug))
			.filter((id): id is string => Boolean(id));

		await col.updateOne(
			{ $or: [{ user: userIdStr }, { userId: userIdObj }] },
			{
				$setOnInsert: { createdAt: w.createdAt },
				$set: {
					user: userIdStr,
					userId: userIdObj,
					apps,
					updatedAt: w.updatedAt,
				},
			},
			{ upsert: true },
		);
	}

	console.log(`✅ Wishlists upserted: ${seedWishlists.length}`);
}

