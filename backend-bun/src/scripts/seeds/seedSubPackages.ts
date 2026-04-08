import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedSubPackages } from "./data/subPackagesData";

type SubPackageDoc = {
	seedKey: string;
	name: string;
	app: string | null;
	type: "monthly" | "yearly" | "lifetime";
	price: number;
	durationDays: number;
	description: string;
	isActive: boolean;
	isDeleted: boolean;
	createdAt: Date;
	updatedAt: Date;
};

function buildSeedKey(p: { appSlug: string | null; type: string; name: string }) {
	return `${p.appSlug ?? "global"}:${p.type}:${p.name}`;
}

export async function seedSubPackagesCollection() {
	ensureMin(seedSubPackages, SEED_MIN_PER_COLLECTION, "seedSubPackages");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<SubPackageDoc>("sub_packages");

	console.log("⏳ Seeding sub_packages...");

	const appSlugs = [
		...new Set(seedSubPackages.map((p) => p.appSlug).filter(Boolean) as string[]),
	];
	const appDocs =
		appSlugs.length > 0
			? await db
					.collection("apps")
					.find({ slug: { $in: appSlugs } })
					.project({ _id: 1, slug: 1 })
					.toArray()
			: [];
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

	await upsertManyByKey({
		collection: col,
		keyField: "seedKey",
		items: seedSubPackages.map((p) => {
			const seedKey = buildSeedKey(p);
			const appId = p.appSlug ? appIdBySlug.get(p.appSlug) || null : null;
			return {
				key: seedKey,
				doc: {
					seedKey,
					name: p.name,
					app: appId,
					type: p.type,
					price: p.price,
					durationDays: p.durationDays,
					description: p.description,
					isActive: p.isActive,
					isDeleted: false,
					createdAt: p.createdAt,
					updatedAt: p.updatedAt,
				},
			};
		}),
	});

	console.log(`✅ Sub-packages upserted: ${seedSubPackages.length}`);
}

