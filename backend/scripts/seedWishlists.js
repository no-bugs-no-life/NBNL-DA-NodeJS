const mongoose = require("mongoose");
const Wishlist = require("../schemas/wishlists");
const User = require("../schemas/users");
const App = require("../schemas/apps");

async function seedWishlists() {
    try {
        console.log("Starting Wishlists Seeding...");

        const normalUser = await User.findOne({ username: "user" });
        const apps = await App.find().limit(3);

        if (!normalUser || apps.length === 0) {
            console.log("⚠️ user or apps not found. Skipping wishlist seeding.");
            return;
        }

        await Wishlist.findOneAndUpdate(
            { userId: normalUser._id },
            {
                appIds: apps.map(app => app._id),
                isDeleted: false
            },
            { upsert: true, new: true }
        );

        console.log("✅ Wishlists seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Wishlists seeding: ", err);
        throw err;
    }
}

module.exports = seedWishlists;
