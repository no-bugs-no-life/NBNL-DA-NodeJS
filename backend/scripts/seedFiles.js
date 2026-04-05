const mongoose = require("mongoose");
const File = require("../schemas/files");
const App = require("../schemas/apps");
const User = require("../schemas/users");

async function seedFiles() {
    try {
        console.log("Starting Files Seeding...");

        const apps = await App.find().limit(3);
        const user = await User.findOne({ username: "admin" });

        const fileRecords = [];

        // Seed App Files
        for (const app of apps) {
            fileRecords.push({
                ownerType: "app",
                ownerId: app._id,
                fileType: "apk",
                url: `https://example.com/downloads/${app.slug}.apk`,
                size: Math.floor(Math.random() * 100000) + 10000
            });
            fileRecords.push({
                ownerType: "app",
                ownerId: app._id,
                fileType: "icon",
                url: app.iconUrl || `https://picsum.photos/seed/${app._id}/200`,
                size: 512
            });
        }

        // Seed User File (Avatar)
        if (user) {
            fileRecords.push({
                ownerType: "user",
                ownerId: user._id,
                fileType: "avatar",
                url: "https://ui-avatars.com/api/?name=Admin&background=random",
                size: 256
            });
        }

        await File.deleteMany({}); // Clean before seed
        await File.insertMany(fileRecords);

        console.log("✅ Files seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Files seeding: ", err);
        throw err;
    }
}

module.exports = seedFiles;
