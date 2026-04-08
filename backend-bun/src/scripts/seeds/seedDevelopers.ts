import { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedDevelopers } from "./data/developersData";

type DeveloperDoc = {
	userId: ObjectId;
	name: string;
	bio: string;
	website: string;
	avatarUrl?: string;
	isDeleted: boolean;
	status: "pending" | "approved" | "rejected";
	rejectionReason: string;
	permissions: {
		canPublishApp: boolean;
		canEditOwnApps: boolean;
		canDeleteOwnApps: boolean;
		canViewAnalytics: boolean;
		canManagePricing: boolean;
		canRespondReviews: boolean;
	};
	contactEmail: string;
	socialLinks: Record<string, string>;
	approvedBy?: ObjectId;
	approvedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedDevelopersCollection() {
	ensureMin(seedDevelopers, SEED_MIN_PER_COLLECTION, "seedDevelopers");

	const db = requireDb(mongoose.connection.db);
	const users = db.collection("users");
	const devs = db.collection<DeveloperDoc>("developers");

	console.log("⏳ Seeding developers...");

	const admin = await users.findOne({ email: "admin@nbnl.com" });
	const adminId =
		admin?._id && ObjectId.isValid(admin._id.toString())
			? new ObjectId(admin._id.toString())
			: undefined;

	const items: Array<{ key: string; doc: DeveloperDoc }> = [];

	for (const d of seedDevelopers) {
		const user = await users.findOne({ email: d.userEmail });
		if (!user?._id) continue;
		const userId = new ObjectId(user._id.toString());

		const approvedBy =
			d.status === "approved" && adminId ? { approvedBy: adminId } : {};
		const approvedAt =
			d.status === "approved" ? { approvedAt: d.updatedAt } : {};

		items.push({
			key: d.contactEmail,
			doc: {
				userId,
				name: d.name,
				bio: d.bio,
				website: d.website,
				avatarUrl: d.avatarUrl,
				isDeleted: false,
				status: d.status,
				rejectionReason: d.rejectionReason || "",
				permissions: d.permissions,
				contactEmail: d.contactEmail,
				socialLinks: d.socialLinks,
				...approvedBy,
				...approvedAt,
				createdAt: d.createdAt,
				updatedAt: d.updatedAt,
			},
		});
	}

	await upsertManyByKey({
		collection: devs,
		items,
		keyField: "contactEmail",
		setOnInsert: true,
	});

	console.log(`✅ Developers upserted: ${items.length}`);
}

