import { mongoose } from "../../infra/db/connection";

export const seedTags = async () => {
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    const collection = db.collection("tags");

    const count = await collection.countDocuments();
    if (count > 0) {
        console.log("✅ Tags already exist, skipping...");
        return;
    }

    console.log("⏳ Seeding tags...");
    const tags = [
        { name: "Mới nhất", slug: "moi-nhat", createdAt: new Date(), updatedAt: new Date() },
        { name: "Thịnh hành", slug: "thinh-hanh", createdAt: new Date(), updatedAt: new Date() },
        { name: "Miễn phí", slug: "mien-phi", createdAt: new Date(), updatedAt: new Date() },
        { name: "Giảm giá", slug: "giam-gia", createdAt: new Date(), updatedAt: new Date() },
    ];

    await collection.insertMany(tags);
    console.log("🎉 Tags seeded successfully!");
};
