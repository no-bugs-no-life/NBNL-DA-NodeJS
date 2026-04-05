const mongoose = require("mongoose");
const appModel = require("../schemas/apps");
const productModel = require("../schemas/products");
const categoryModel = require("../schemas/categories");
const userModel = require("../schemas/users");
const roleModel = require("../schemas/roles");

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

const bestSellingGamesData = [
    { title: "Cyber Odyssey", description: "Sci-fi open world", price: 59.99, category: "Game", slug: "cyber-odyssey", sku: "GAME-CYBO" },
    { title: "Ethereal Realm", description: "Fantasy MMORPG", price: 0, category: "Game", slug: "ethereal-realm", sku: "GAME-ETH" },
    { title: "Tactical Strike", description: "Action shooter", price: 29.99, category: "Game", slug: "tactical-strike", sku: "GAME-TAC" },
    { title: "Velocity X", description: "Racing simulator", price: 19.99, category: "Game", slug: "velocity-x", sku: "GAME-VEL" },
    { title: "Wonder Woods", description: "Adventure puzzle", price: 14.99, category: "Game", slug: "wonder-woods", sku: "GAME-WON" },
    { title: "Gothic Legends", description: "Dark fantasy RPG", price: 0, category: "Game", slug: "gothic-legends", sku: "GAME-GOTH" }
];

const categoriesData = [
    { name: "Racing Essentials", iconUrl: "speed" },
    { name: "Windows Themes", iconUrl: "palette" },
    { name: "Productivity", iconUrl: "task_alt" }
];

async function seed() {
    try {
        console.log("Starting aggregated seating for Home Page...");

        // Ensure we have a developer role and user
        let devRole = await roleModel.findOneAndUpdate(
            { name: "DEVELOPER" },
            { name: "DEVELOPER", description: "App Developer" },
            { upsert: true, new: true }
        );

        let devUser = await userModel.findOneAndUpdate(
            { username: "system_dev" },
            { username: "system_dev", password: "hashed_password", email: "dev@horizon.com", role: devRole._id },
            { upsert: true, new: true }
        );

        // Seed Categories
        for (let cat of categoriesData) {
            await categoryModel.updateOne(
                { name: cat.name },
                { $set: cat },
                { upsert: true }
            );
        }
        console.log("Categories seeded (upsert).");

        let prodCategory = await categoryModel.findOne({ name: "Productivity" });

        // Seed Apps
        for (let app of trendingAppsData) {
            await appModel.updateOne(
                { name: app.name },
                {
                    $set: {
                        ...app,
                        developerId: devUser._id,
                        categoryId: prodCategory ? prodCategory._id : null
                    }
                },
                { upsert: true }
            );
        }
        console.log("Apps seeded (upsert).");

        // Seed Products
        for (let game of bestSellingGamesData) {
            await productModel.updateOne(
                { title: game.title },
                { $set: game },
                { upsert: true }
            );
        }
        console.log("Games/Products seeded (upsert).");

        console.log("✅ Home Seeding finished successfully.");
    } catch (err) {
        console.error("❌ Error during Home seeding: ", err);
        throw err;
    }
}

module.exports = seed;
