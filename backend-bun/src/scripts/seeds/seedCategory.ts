import { mongoose } from "../../infra/db/connection";

export const seedCategory = async () => {
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    const collection = db.collection("categories");

    const count = await collection.countDocuments();
    if (count > 0) {
        console.log("✅ Categories already exist, skipping...");
        return;
    }

    console.log("⏳ Seeding categories...");
    const categories = [
        { name: "Game Hành động", slug: "game-hanh-dong", iconUrl: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { name: "Game Trí tuệ", slug: "game-tri-tue", iconUrl: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { name: "Ứng dụng Văn phòng", slug: "ung-dung-van-phong", iconUrl: "", parentId: null, createdAt: new Date(), updatedAt: new Date() },
        { name: "Giáo dục", slug: "giao-duc", iconUrl: "", parentId: null, createdAt: new Date(), updatedAt: new Date() }
    ];

    await collection.insertMany(categories);
    console.log("🎉 Categories seeded successfully!");
};
