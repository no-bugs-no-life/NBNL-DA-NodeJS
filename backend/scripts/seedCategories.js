const mongoose = require("mongoose");
const categoryModel = require("../schemas/categories");

const categoriesData = [
    { name: "Racing Essentials", iconUrl: "speed" },
    { name: "Windows Themes", iconUrl: "palette" },
    { name: "Productivity", iconUrl: "task_alt" }
];

async function seedCategories() {
    try {
        console.log("Starting Categories Seeding...");
        for (let cat of categoriesData) {
            await categoryModel.updateOne(
                { name: cat.name },
                { $set: cat },
                { upsert: true }
            );
        }
        console.log("✅ Categories seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Categories seeding: ", err);
        throw err;
    }
}

module.exports = seedCategories;
