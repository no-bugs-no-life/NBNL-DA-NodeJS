import { mongoose } from "../../infra/db/connection";
import { UserRole } from "../../modules/users/users.types";

export const seedAdmin = async () => {
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    const collection = db.collection("users");

    const exist = await collection.findOne({ role: UserRole.ADMIN });
    if (exist) {
        console.log("✅ Admin user already exists, skipping...");
        return;
    }

    console.log("⏳ Seeding admin user...");
    const hashedPassword = await Bun.password.hash("123456", {
        algorithm: "bcrypt",
        cost: 10,
    });

    await collection.insertOne({
        username: "admin",
        email: "admin@nbnl.com",
        password: hashedPassword,
        fullName: "System Admin",
        role: UserRole.ADMIN,
        coin: 999999,
        level: 99,
        xp: 0,
        maxXp: 1000,
        bio: "Developer system administrator",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    console.log("🎉 Admin user seeded successfully!");
};
