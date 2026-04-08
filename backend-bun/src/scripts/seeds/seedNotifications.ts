import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertMany } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedNotifications } from "./data/notificationsData";

type NotificationDoc = {
	user: string;
	type:
		| "app_approved"
		| "app_rejected"
		| "new_review"
		| "new_download"
		| "system"
		| "promotion"
		| "update"
		| "sendmail";
	channel: "inapp" | "email" | "firebase";
	message: string;
	isRead: boolean;
	sentAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedNotificationsCollection() {
	ensureMin(seedNotifications, SEED_MIN_PER_COLLECTION, "seedNotifications");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<NotificationDoc>("notifications");

	console.log("⏳ Seeding notifications...");

	const userEmails = [...new Set(seedNotifications.map((n) => n.userEmail))];
	const userDocs = await db
		.collection("users")
		.find({ email: { $in: userEmails } })
		.project({ _id: 1, email: 1 })
		.toArray();
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

	await upsertMany({
		collection: col,
		items: seedNotifications.map((n) => {
			const userId = userIdByEmail.get(n.userEmail);
			if (!userId) throw new Error(`Missing user for email=${n.userEmail}`);

			const insert: NotificationDoc = {
				user: userId,
				type: n.type,
				channel: n.channel,
				message: n.message,
				isRead: n.isRead,
				sentAt: n.sentAt,
				createdAt: n.createdAt,
				updatedAt: n.updatedAt,
			};

			return {
				filter: { user: userId, type: n.type, message: n.message } as Partial<NotificationDoc>,
				insert,
				set: {
					isRead: n.isRead,
					channel: n.channel,
					sentAt: n.sentAt,
					updatedAt: n.updatedAt,
				},
			};
		}),
	});

	console.log(`✅ Notifications upserted: ${seedNotifications.length}`);
}

