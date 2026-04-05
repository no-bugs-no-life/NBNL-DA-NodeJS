const tagModel = require("../schemas/tags");
const appModel = require("../schemas/apps");

const tagData = [
    "Thiết kế",
    "Đồ họa",
    "Chỉnh sửa ảnh",
    "Phần mềm",
    "Công cụ AI",
    "Năng suất",
    "Tiện ích",
    "Lập trình"
];

async function seedTags() {
    try {
        console.log("Starting Tags Seeding...");

        // Fetch all existing apps to attach tags to them.
        const allApps = await appModel.find({});
        const appIds = allApps.map(app => app._id);

        for (let tagName of tagData) {
            await tagModel.updateOne(
                { name: tagName.toLowerCase() },
                {
                    $set: {
                        name: tagName,
                        appIds: appIds // Link every mock tag to all available seed apps for demonstration
                    }
                },
                { upsert: true }
            );
        }
        console.log("✅ Tags seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Tags seeding: ", err);
        throw err;
    }
}

module.exports = seedTags;
