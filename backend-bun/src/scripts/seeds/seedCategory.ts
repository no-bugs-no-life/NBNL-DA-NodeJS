import type { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, findManyByField, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedCategories } from "./data/categoriesData";

type CategoryDoc = {
	name: string;
	slug: string;
	iconUrl: string;
	parentId: ObjectId | null;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedCategoriesCollection() {
	ensureMin(seedCategories, SEED_MIN_PER_COLLECTION, "seedCategories");

	const db = requireDb(mongoose.connection.db);
	const collection = db.collection<CategoryDoc>("categories");

	console.log("⏳ Seeding categories...");

	const roots = seedCategories.filter((c) => c.parentSlug === null);
	await upsertManyByKey({
		collection,
		keyField: "slug",
		items: roots.map((c) => ({
			key: c.slug,
			doc: {
				name: c.name,
				slug: c.slug,
				iconUrl: c.iconUrl,
				parentId: null,
				createdAt: c.createdAt,
				updatedAt: c.updatedAt,
			},
		})),
	});

	const existing = await findManyByField({
		collection,
		field: "slug",
		values: seedCategories.map((c) => c.slug),
	});
	const slugToId = new Map<string, ObjectId>(
		(existing as unknown as Array<{ _id: ObjectId; slug: string }>).map((d) => [
			d.slug,
			d._id,
		]),
	);

	const children = seedCategories.filter((c) => c.parentSlug !== null);
	await upsertManyByKey({
		collection,
		keyField: "slug",
		items: children.map((c) => ({
			key: c.slug,
			doc: {
				name: c.name,
				slug: c.slug,
				iconUrl: c.iconUrl,
				parentId: c.parentSlug ? slugToId.get(c.parentSlug) || null : null,
				createdAt: c.createdAt,
				updatedAt: c.updatedAt,
			},
		})),
	});

	console.log(`✅ Categories upserted: ${seedCategories.length}`);
}

// Backward-compatible export used by existing `index.ts`
export const seedCategory = seedCategoriesCollection;
