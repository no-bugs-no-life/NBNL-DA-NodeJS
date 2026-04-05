const mongoose = require("mongoose");
const Subscription = require("../schemas/subscriptions");
const SubPackage = require("../schemas/subPackages");
const User = require("../schemas/users");
const App = require("../schemas/apps");

async function seedSubscriptions() {
    try {
        console.log("Starting Subscriptions Seeding...");

        const user = await User.findOne({ username: "user" });
        const subPackage = await SubPackage.findOne({ type: "monthly" });
        const app = await App.findOne();

        if (!user || !subPackage || !app) {
            console.log("⚠️ Prerequisites not found. Skipping subscriptions seeding.");
            return;
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await Subscription.deleteMany({});
        await Subscription.create({
            userId: user._id,
            appId: app._id,
            packageId: subPackage._id,
            startDate,
            endDate,
            status: "active"
        });

        console.log("✅ Subscriptions seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Subscriptions seeding: ", err);
        throw err;
    }
}

module.exports = seedSubscriptions;
