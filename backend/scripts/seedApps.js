const mongoose = require("mongoose");
const appModel = require("../schemas/apps");
const categoryModel = require("../schemas/categories");
const userModel = require("../schemas/users");
const slugify = require("slugify");

const trendingAppsData = [
    { name: "Designer Pro 2024", description: "The industry standard for vector graphics and digital illustration.", price: 49.99, status: "published" },
    { name: "StreamConnect", description: "Conferencing platform", price: 0, status: "published" },
    { name: "TaskFlow AI", description: "Productivity task manager", price: 2.99, status: "published" },
    { name: "Echo Studio", description: "Audio Editing suite", price: 0, status: "published" },
    { name: "CloudDrive X", description: "Utilities cloud storage", price: 12.00, status: "published" },
    { name: "WriteNow Editor", description: "Focus-driven word processor", price: 0, status: "published" },
    { name: "DataScope Pro", description: "Advanced visualization & stats", price: 14.99, status: "published" },
    { name: "Luminous Mail", description: "Intelligent inbox management", price: 0, status: "published" }
];

async function seedApps() {
    try {
        console.log("Starting Apps Seeding...");
        const devUser = await userModel.findOne({ username: "system_dev" });
        const prodCategory = await categoryModel.findOne({ name: "Productivity" });

        for (let app of trendingAppsData) {
            const slug = slugify(app.name, { replacement: '-', lower: true, locale: 'vi', trim: true });
            await appModel.updateOne(
                { name: app.name },
                {
                    $set: {
                        ...app,
                        slug,
                        developerId: devUser ? devUser._id : null,
                        categoryId: prodCategory ? prodCategory._id : null
                    }
                },
                { upsert: true }
            );
        }
        console.log("✅ Apps seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Apps seeding: ", err);
        throw err;
    }
}

module.exports = seedApps;
