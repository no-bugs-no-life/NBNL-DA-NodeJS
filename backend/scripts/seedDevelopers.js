const mongoose = require("mongoose");
const Developer = require("../schemas/developers");
const User = require("../schemas/users");
const App = require("../schemas/apps");

async function seedDevelopers() {
    try {
        console.log("Starting Developers Seeding...");

        const systemDev = await User.findOne({ username: "system_dev" });
        const adminUser = await User.findOne({ username: "admin" });

        if (!systemDev) {
            console.log("⚠️ system_dev user not found. Skipping developer seeding.");
            return;
        }

        const devUserDoc = await Developer.findOneAndUpdate(
            { userId: systemDev._id },
            {
                name: "System Dev Studio",
                bio: "Chuyên cung cấp các phần mềm tiện ích và game chất lượng cao.",
                website: "https://systemdev.studio",
                avatarUrl: "https://ui-avatars.com/api/?name=System+Dev&background=random",
                status: "approved",
                permissions: {
                    canPublishApp: true,
                    canEditOwnApps: true,
                    canDeleteOwnApps: true,
                    canViewAnalytics: true,
                    canManagePricing: true,
                    canRespondReviews: true
                },
                contactEmail: systemDev.email,
                socialLinks: {
                    twitter: "https://twitter.com/systemdev",
                    github: "https://github.com/systemdev"
                },
                approvedBy: adminUser ? adminUser._id : null,
                approvedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Update developer apps stats
        const apps = await App.find({ developerId: systemDev._id });
        devUserDoc.stats.totalApps = apps.length;
        devUserDoc.stats.publishedApps = apps.filter(a => a.status === 'published').length;
        devUserDoc.apps = apps.map(a => a._id);
        await devUserDoc.save();

        console.log("✅ Developers seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Developers seeding: ", err);
        throw err;
    }
}

module.exports = seedDevelopers;
