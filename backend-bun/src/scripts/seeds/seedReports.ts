import type { ObjectId } from "mongodb";
import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedReports } from "./data/reportsData";

type ReportDoc = {
	reportCode: string;
	reporter: ObjectId;
	targetType: "app" | "review";
	target: ObjectId;
	reason: string;
	status: "pending" | "reviewed" | "resolved" | "dismissed";
	adminNote?: string;
	resolvedBy?: ObjectId;
	createdAt: Date;
	updatedAt: Date;
};

export async function seedReportsCollection() {
	ensureMin(seedReports, SEED_MIN_PER_COLLECTION, "seedReports");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<ReportDoc>("reports");

	console.log("⏳ Seeding reports...");

	const reporterEmails = [...new Set(seedReports.map((r) => r.reporterEmail))];
	const resolverEmails = [
		...new Set(seedReports.map((r) => r.resolvedByEmail).filter(Boolean) as string[]),
	];
	const appSlugs = [
		...new Set(
			seedReports
				.filter((r) => r.targetType === "app")
				.map((r) => r.targetAppSlug)
				.filter(Boolean) as string[],
		),
	];

	const [userDocs, appDocs] = await Promise.all([
		db
			.collection("users")
			.find({
				email: { $in: [...new Set([...reporterEmails, ...resolverEmails])] },
			})
			.project({ _id: 1, email: 1 })
			.toArray(),
		db
			.collection("apps")
			.find({ slug: { $in: appSlugs } })
			.project({ _id: 1, slug: 1 })
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
	const appIdBySlug = new Map<string, ObjectId>(
		appDocs
			.filter(
				(a): a is { _id: ObjectId; slug: string } =>
					typeof a === "object" &&
					a !== null &&
					"slug" in a &&
					"_id" in a &&
					typeof a.slug === "string",
			)
			.map((a) => [a.slug, a._id]),
	);

	// Review targets: map (userEmail, appSlug) -> review _id
	const reviewTargets = seedReports
		.map((r) => r.targetType === "review" ? r.targetReview : undefined)
		.filter(
			(
				target,
			): target is {
				userEmail: string;
				appSlug: string;
			} => Boolean(target),
		);

	const reviewUserEmails = [...new Set(reviewTargets.map((t) => t.userEmail))];
	const reviewAppSlugs = [...new Set(reviewTargets.map((t) => t.appSlug))];
	const [reviewUserDocs, reviewAppDocs] = await Promise.all([
		db
			.collection("users")
			.find({ email: { $in: reviewUserEmails } })
			.project({ _id: 1, email: 1 })
			.toArray(),
		db
			.collection("apps")
			.find({ slug: { $in: reviewAppSlugs } })
			.project({ _id: 1, slug: 1 })
			.toArray(),
	]);

	const reviewUserIdByEmail = new Map<string, string>(
		reviewUserDocs
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
	const reviewAppIdBySlug = new Map<string, string>(
		reviewAppDocs
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

	const reviewPairs = reviewTargets
		.map((t) => {
			const uid = reviewUserIdByEmail.get(t.userEmail);
			const aid = reviewAppIdBySlug.get(t.appSlug);
			if (!uid || !aid) return null;
			return { uid, aid };
		})
		.filter(Boolean) as Array<{ uid: string; aid: string }>;

	const reviewDocs =
		reviewPairs.length > 0
			? await db
					.collection("reviews")
					.find({
						$or: reviewPairs.map((p) => ({ user: p.uid, app: p.aid })),
					})
					.project({ _id: 1, user: 1, app: 1 })
					.toArray()
			: [];

	const reviewIdByUserApp = new Map<string, ObjectId>(
		reviewDocs
			.filter(
				(r): r is { _id: ObjectId; user: string; app: string } =>
					typeof r === "object" &&
					r !== null &&
					"_id" in r &&
					"user" in r &&
					"app" in r &&
					typeof r.user === "string" &&
					typeof r.app === "string",
			)
			.map((r) => {
				const key = `${r.user}|${r.app}`;
				return [key, r._id] as const;
			}),
	);

	await upsertManyByKey({
		collection: col,
		keyField: "reportCode",
		items: seedReports.map((r) => {
			const reporterId = userIdByEmail.get(r.reporterEmail);
			if (!reporterId) throw new Error(`Missing reporter for email=${r.reporterEmail}`);

			let targetId: ObjectId | undefined;
			if (r.targetType === "app") {
				if (!r.targetAppSlug) throw new Error(`Missing targetAppSlug for ${r.reportCode}`);
				targetId = appIdBySlug.get(r.targetAppSlug);
				if (!targetId) throw new Error(`Missing app for slug=${r.targetAppSlug}`);
			} else {
				const t = r.targetReview;
				if (!t) throw new Error(`Missing targetReview for ${r.reportCode}`);
				const uid = reviewUserIdByEmail.get(t.userEmail);
				const aid = reviewAppIdBySlug.get(t.appSlug);
				if (!uid || !aid) throw new Error(`Missing review target user/app for ${r.reportCode}`);
				targetId = reviewIdByUserApp.get(`${uid}|${aid}`);
				if (!targetId) throw new Error(`Missing review doc for ${r.reportCode}`);
			}

			const resolvedBy = r.resolvedByEmail
				? userIdByEmail.get(r.resolvedByEmail)
				: undefined;

			return {
				key: r.reportCode,
				doc: {
					reportCode: r.reportCode,
					reporter: reporterId,
					targetType: r.targetType,
					target: targetId,
					reason: r.reason,
					status: r.status,
					adminNote: r.adminNote,
					resolvedBy,
					createdAt: r.createdAt,
					updatedAt: r.updatedAt,
				},
			};
		}),
	});

	console.log(`✅ Reports upserted: ${seedReports.length}`);
}

