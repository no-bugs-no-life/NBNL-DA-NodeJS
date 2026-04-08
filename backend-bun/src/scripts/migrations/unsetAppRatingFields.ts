import { closeDatabase, connectDB, mongoose } from "../../infra/db/connection";

async function unsetAppRatingFields() {
	try {
		console.log("Starting migration: unset app rating fields...");
		await connectDB();

		while (!mongoose.connection.db) {
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		const db = mongoose.connection.db;
		if (!db) throw new Error("Database not connected");

		const result = await db.collection("apps").updateMany(
			{},
			{
				$unset: {
					ratingScore: "",
					ratingCount: "",
				},
			},
		);

		console.log(
			`Migration completed. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`,
		);
	} catch (error) {
		console.error("Migration failed:", error);
		process.exitCode = 1;
	} finally {
		await closeDatabase();
	}
}

unsetAppRatingFields();
