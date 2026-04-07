import { mongoose } from "../../infra/db/connection";

export const seedApps = async () => {
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    const appCollection = db.collection("apps");
    const userCollection = db.collection("users");
    const catCollection = db.collection("categories");

    const count = await appCollection.countDocuments();
    if (count > 0) {
        console.log("✅ Apps already exist, skipping...");
        return;
    }

    console.log("⏳ Seeding apps...");

    // Get an admin/developer
    let dev = await userCollection.findOne({ role: "ADMIN" });
    if (!dev) {
        dev = await userCollection.findOne({});
    }
    if (!dev) {
        console.log("⚠️ No developer/admin found, skip seeding apps.");
        return;
    }

    // Get a category
    const category = await catCollection.findOne({});

    const apps = [
        {
            name: "Demo Game 1",
            slug: "demo-game-1",
            description: "This is a demo game",
            iconUrl: "https://via.placeholder.com/150",
            price: 0,
            status: "published",
            developer: dev._id,
            category: category ? category._id : null,
            tags: [],
            isDisabled: false,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: "Demo App Premium",
            slug: "demo-app-premium",
            description: "This is a premium application",
            iconUrl: "https://via.placeholder.com/150",
            price: 99000,
            status: "published",
            developer: dev._id,
            category: category ? category._id : null,
            tags: [],
            isDisabled: false,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await appCollection.insertMany(apps);
    console.log("🎉 Apps seeded successfully!");
};
