import type { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedOrders } from "./data/ordersData";

type OrderDoc = {
	orderNo: string;
	user: ObjectId;
	items: Array<{
		app: ObjectId;
		name: string;
		price: number;
		iconUrl?: string;
	}>;
	totalAmount: number;
	discountAmount: number;
	finalAmount: number;
	couponCode?: string;
	status: string;
	paymentMethod: string;
	paymentId?: string;
	paidAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedOrdersCollection() {
	ensureMin(seedOrders, SEED_MIN_PER_COLLECTION, "seedOrders");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<OrderDoc>("orders");

	console.log("⏳ Seeding orders...");

	const userEmails = [...new Set(seedOrders.map((o) => o.userEmail))];
	const appSlugs = [
		...new Set(seedOrders.flatMap((o) => o.items.map((i) => i.appSlug))),
	];

	const [userDocs, appDocs] = await Promise.all([
		db
			.collection("users")
			.find({ email: { $in: userEmails } })
			.project({ _id: 1, email: 1 })
			.toArray(),
		db
			.collection("apps")
			.find({ slug: { $in: appSlugs } })
			.project({ _id: 1, slug: 1, name: 1, iconUrl: 1 })
			.toArray(),
	]);

	const userIdByEmail = new Map<string, ObjectId>(
		userDocs
			.filter(
				(u): u is { _id: ObjectId; email: string } =>
					typeof u === "object" &&
					u !== null &&
					"email" in u &&
					"_id" in u &&
					typeof u.email === "string",
			)
			.map((u) => [u.email, u._id]),
	);
	const appBySlug = new Map<
		string,
		{ _id: ObjectId; name?: string; iconUrl?: string }
	>(
		appDocs
			.filter(
				(a): a is { _id: ObjectId; slug: string; name?: string; iconUrl?: string } =>
					typeof a === "object" &&
					a !== null &&
					"slug" in a &&
					"_id" in a &&
					typeof a.slug === "string",
			)
			.map((a) => [
				a.slug,
				{
					_id: a._id,
					name: typeof a.name === "string" ? a.name : undefined,
					iconUrl: typeof a.iconUrl === "string" ? a.iconUrl : undefined,
				},
			]),
	);

	await upsertManyByKey({
		collection: col,
		keyField: "orderNo",
		items: seedOrders.map((o) => {
			const userId = userIdByEmail.get(o.userEmail);
			if (!userId) throw new Error(`Missing user for email=${o.userEmail}`);

			const items = o.items.map((it) => {
				const app = appBySlug.get(it.appSlug);
				if (!app) throw new Error(`Missing app for slug=${it.appSlug}`);
				return {
					app: app._id,
					name: it.name || app.name || it.appSlug,
					price: it.price,
					iconUrl: it.iconUrl || app.iconUrl,
				};
			});

			const totalAmount = items.reduce((sum, i) => sum + (Number(i.price) || 0), 0);
			const discountAmount = Number(o.discountAmount) || 0;
			const finalAmount = Math.max(0, totalAmount - discountAmount);

			return {
				key: o.orderNo,
				doc: {
					orderNo: o.orderNo,
					user: userId,
					items,
					totalAmount,
					discountAmount,
					finalAmount,
					status: o.status,
					paymentMethod: o.paymentMethod,
					paymentId: o.paymentId,
					paidAt: o.paidAt,
					createdAt: o.createdAt,
					updatedAt: o.updatedAt,
				},
			};
		}),
	});

	console.log(`✅ Orders upserted: ${seedOrders.length}`);
}

