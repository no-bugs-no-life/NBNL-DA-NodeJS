import type { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedApps } from "./data/appsData";

type AppDoc = {
	name: string;
	slug: string;
	description: string;
	iconUrl: string;
	price: number;
	status: string;
	developer: ObjectId;
	category: ObjectId | null;
	tags: ObjectId[];
	flags: string[];
	priority: number;
	isDisabled: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedAppsCollection() {
	ensureMin(seedApps, SEED_MIN_PER_COLLECTION, "seedApps");

	const db = requireDb(mongoose.connection.db);
	const appsCol = db.collection<AppDoc>("apps");

	console.log("⏳ Seeding apps...");

	const [devDocs, catDocs, tagDocs] = await Promise.all([
		db
			.collection("developers")
			.find({
				contactEmail: {
					$in: [...new Set(seedApps.map((a) => a.developerContactEmail))],
				},
				isDeleted: { $ne: true },
			})
			.project({ _id: 1, contactEmail: 1 })
			.toArray(),
		db
			.collection("categories")
			.find({
				slug: { $in: [...new Set(seedApps.map((a) => a.categorySlug))] },
			})
			.project({ _id: 1, slug: 1 })
			.toArray(),
		db
			.collection("tags")
			.find({
				slug: { $in: [...new Set(seedApps.flatMap((a) => a.tagSlugs))] },
			})
			.project({ _id: 1, slug: 1 })
			.toArray(),
	]);

	const devIdByEmail = new Map<string, ObjectId>(
		devDocs
			.filter(
				(d): d is { _id: ObjectId; contactEmail: string } =>
					typeof d === "object" &&
					d !== null &&
					"contactEmail" in d &&
					"_id" in d &&
					typeof d.contactEmail === "string",
			)
			.map((d) => [d.contactEmail, d._id]),
	);
	const catIdBySlug = new Map<string, ObjectId>(
		catDocs
			.filter(
				(c): c is { _id: ObjectId; slug: string } =>
					typeof c === "object" &&
					c !== null &&
					"slug" in c &&
					"_id" in c &&
					typeof c.slug === "string",
			)
			.map((c) => [c.slug, c._id]),
	);
	const tagIdBySlug = new Map<string, ObjectId>(
		tagDocs
			.filter(
				(t): t is { _id: ObjectId; slug: string } =>
					typeof t === "object" &&
					t !== null &&
					"slug" in t &&
					"_id" in t &&
					typeof t.slug === "string",
			)
			.map((t) => [t.slug, t._id]),
	);

	await upsertManyByKey({
		collection: appsCol,
		keyField: "slug",
		items: seedApps.map((a) => {
			const developerId = devIdByEmail.get(a.developerContactEmail);
			if (!developerId) {
				throw new Error(
					`Seed invariant failed: missing developer contactEmail=${a.developerContactEmail}`,
				);
			}
			const categoryId = catIdBySlug.get(a.categorySlug) || null;
			const tagIds = a.tagSlugs
				.map((slug) => tagIdBySlug.get(slug))
				.filter((id): id is ObjectId => Boolean(id));

			return {
				key: a.slug,
				doc: {
					name: a.name,
					slug: a.slug,
					description: a.description,
					iconUrl: a.iconUrl,
					price: a.price,
					status: a.status,
					developer: developerId,
					category: categoryId,
					tags: tagIds,
					flags: a.flags,
					priority: a.priority,
					isDisabled: a.isDisabled,
					isDeleted: a.isDeleted,
					createdAt: a.createdAt,
					updatedAt: a.updatedAt,
				},
			};
		}),
	});

	console.log(`✅ Apps upserted: ${seedApps.length}`);
}

