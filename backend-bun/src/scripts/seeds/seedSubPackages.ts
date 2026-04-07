import { mongoose } from "../../infra/db/connection";

export const seedSubPackages = async () => {
    const db = mongoose.connection.db;
    if (!db) throw new Error("Database not connected");

    const collection = db.collection("sub_packages");

    const count = await collection.countDocuments();
    if (count > 0) {
        console.log("✅ SubPackages already exist, skipping...");
        return;
    }

    console.log("⏳ Seeding SubPackages...");

    const pkgs = [
        {
            name: "Gói Premium 1 Tháng",
            type: "monthly",
            price: 49000,
            durationDays: 30,
            description: "Tận hưởng toàn bộ tính năng cao cấp trong vòng 1 tháng",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            name: "Gói Trọn Đời",
            type: "lifetime",
            price: 990000,
            durationDays: 36500,
            description: "Mua 1 lần dùng mãi mãi",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    await collection.insertMany(pkgs);
    console.log("🎉 SubPackages seeded successfully!");
};
