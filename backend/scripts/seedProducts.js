const mongoose = require("mongoose");
const productModel = require("../schemas/products");

const bestSellingGamesData = [
    { title: "Cyber Odyssey", description: "Sci-fi open world", price: 59.99, category: "Game", slug: "cyber-odyssey", sku: "GAME-CYBO" },
    { title: "Ethereal Realm", description: "Fantasy MMORPG", price: 0, category: "Game", slug: "ethereal-realm", sku: "GAME-ETH" },
    { title: "Tactical Strike", description: "Action shooter", price: 29.99, category: "Game", slug: "tactical-strike", sku: "GAME-TAC" },
    { title: "Velocity X", description: "Racing simulator", price: 19.99, category: "Game", slug: "velocity-x", sku: "GAME-VEL" },
    { title: "Wonder Woods", description: "Adventure puzzle", price: 14.99, category: "Game", slug: "wonder-woods", sku: "GAME-WON" },
    { title: "Gothic Legends", description: "Dark fantasy RPG", price: 0, category: "Game", slug: "gothic-legends", sku: "GAME-GOTH" }
];

async function seedProducts() {
    try {
        console.log("Starting Games/Products Seeding...");
        for (let game of bestSellingGamesData) {
            await productModel.updateOne(
                { title: game.title },
                { $set: game },
                { upsert: true }
            );
        }
        console.log("✅ Games/Products seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Products seeding: ", err);
        throw err;
    }
}

module.exports = seedProducts;
