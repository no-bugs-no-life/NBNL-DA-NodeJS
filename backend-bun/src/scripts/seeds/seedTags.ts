import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedTags as seedTagsData } from "./data/tagsData";

type TagDoc = {
	name: string;
	slug: string;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedTagsCollection() {
	ensureMin(seedTagsData, SEED_MIN_PER_COLLECTION, "seedTags");

	const db = requireDb(mongoose.connection.db);
	const collection = db.collection<TagDoc>("tags");

	console.log("⏳ Seeding tags...");

	await upsertManyByKey({
		collection,
		keyField: "slug",
		items: seedTagsData.map((t) => ({
			key: t.slug,
			doc: { ...t },
		})),
	});

	console.log(`✅ Tags upserted: ${seedTagsData.length}`);
}
