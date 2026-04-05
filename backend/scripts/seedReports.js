const mongoose = require("mongoose");
const Report = require("../schemas/reports");
const User = require("../schemas/users");
const App = require("../schemas/apps");
const Review = require("../schemas/reviews");

async function seedReports() {
    try {
        console.log("Starting Reports Seeding...");

        const user = await User.findOne({ username: "user" });
        const app = await App.findOne();
        const review = await Review.findOne();

        if (!user || (!app && !review)) {
            console.log("⚠️ Prerequisites not found. Skipping reports seeding.");
            return;
        }

        const reports = [];
        if (app) {
            reports.push({
                reporterId: user._id,
                targetType: "app",
                targetId: app._id,
                reason: "Chứa nội dung không phù hợp.",
                status: "pending"
            });
        }

        if (review) {
            reports.push({
                reporterId: user._id,
                targetType: "review",
                targetId: review._id,
                reason: "Review spam / chửi thề.",
                status: "reviewed",
                adminNote: "Đã đánh dấu ẩn đánh giá này."
            });
        }

        await Report.deleteMany({});
        await Report.insertMany(reports);

        console.log("✅ Reports seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Reports seeding: ", err);
        throw err;
    }
}

module.exports = seedReports;
