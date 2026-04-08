import { mongoose } from "../../infra/db/connection";
import { ensureMin, requireDb, upsertManyByKey } from "./seedUtils";
import { SEED_MIN_PER_COLLECTION } from "./data/seedConfig";
import { seedUsers } from "./data/usersData";

type UserDoc = {
	email: string;
	username: string;
	password?: string;
	fullName: string;
	role: string;
	coin: number;
	level: number;
	xp: number;
	maxXp: number;
	bio?: string;
	avatarUrl?: string;
	provider?: string;
	googleId?: string;
	createdAt: Date;
	updatedAt: Date;
};

async function hashPassword(plain: string) {
	return await Bun.password.hash(plain, { algorithm: "bcrypt", cost: 10 });
}

export async function seedUsersCollection() {
	ensureMin(seedUsers, SEED_MIN_PER_COLLECTION, "seedUsers");

	const db = requireDb(mongoose.connection.db);
	const col = db.collection<UserDoc>("users");

	console.log("⏳ Seeding users...");

	const items = await Promise.all(
		seedUsers.map(async (u) => {
			const password = u.passwordPlain ? await hashPassword(u.passwordPlain) : undefined;
			return {
				key: u.email,
				doc: {
					email: u.email,
					username: u.username,
					...(password ? { password } : {}),
					fullName: u.fullName,
					role: u.role,
					coin: u.coin,
					level: u.level,
					xp: u.xp,
					maxXp: u.maxXp,
					bio: u.bio,
					avatarUrl: u.avatarUrl,
					provider: u.provider || "local",
					googleId: u.googleId,
					createdAt: u.createdAt,
					updatedAt: u.updatedAt,
				},
			};
		}),
	);

	await upsertManyByKey({ collection: col, keyField: "email", items });
	console.log(`✅ Users upserted: ${items.length}`);
}

