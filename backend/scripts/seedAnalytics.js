const mongoose = require("mongoose");
const Analytics = require("../schemas/analytics");
const App = require("../schemas/apps");

async function seedAnalytics() {
    try {
        console.log("Starting Analytics Seeding...");

        const apps = await App.find().limit(5);
        if (apps.length === 0) {
            console.log("⚠️ No apps found. Skipping analytics seeding.");
            return;
        }

        const analyticsRecords = [];
        const today = new Date();

        for (const app of apps) {
            // Seed last 7 days of analytics for each app
            for (let i = 0; i < 7; i++) {
                const statDate = new Date(today);
                statDate.setDate(statDate.getDate() - i);
                statDate.setHours(0, 0, 0, 0);

                analyticsRecords.push({
                    appId: app._id,
                    date: statDate,
                    views: Math.floor(Math.random() * 1000) + 100,
                    downloads: Math.floor(Math.random() * 500) + 50,
                    installs: Math.floor(Math.random() * 400) + 40,
                    activeUsers: Math.floor(Math.random() * 300) + 30,
                    ratingAverage: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
                    crashCount: Math.floor(Math.random() * 5)
                });
            }
        }

        await Analytics.deleteMany({ appId: { $in: apps.map(a => a._id) } }); // Clean old ones for these apps
        await Analytics.insertMany(analyticsRecords);

        console.log("✅ Analytics seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Analytics seeding: ", err);
        throw err;
    }
}

module.exports = seedAnalytics;
