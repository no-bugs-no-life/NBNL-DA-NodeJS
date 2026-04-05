const mongoose = require("mongoose");
const appModel = require("../schemas/apps");
const categoryModel = require("../schemas/categories");
const userModel = require("../schemas/users");
const slugify = require("slugify");

const trendingAppsData = [
    { name: "Designer Pro 2024", description: "The industry standard for vector graphics and digital illustration.", price: 49.99, status: "published" },
    { name: "StreamConnect", description: "Conferencing platform", price: 0, status: "published" },
    { name: "TaskFlow AI", description: "Productivity task manager", price: 2.99, status: "published" },
    { name: "Echo Studio", description: "Audio Editing suite", price: 0, status: "published" },
    { name: "CloudDrive X", description: "Utilities cloud storage", price: 12.00, status: "published" },
    { name: "WriteNow Editor", description: "Focus-driven word processor", price: 0, status: "published" },
    { name: "DataScope Pro", description: "Advanced visualization & stats", price: 14.99, status: "published" },
    { name: "APKBugs Mail", description: "Intelligent inbox management", price: 0, status: "published" },
    { name: "RenderMax 3D", description: "Công cụ dựng hình 3D chuyên nghiệp với hiệu năng cao.", price: 89.99, status: "published" },
    { name: "BeatMaker Studio", description: "Phần mềm sáng tác và mix nhạc dành cho nhà sản xuất.", price: 15.00, status: "published" },
    { name: "CodeCraft IDE", description: "Môi trường lập trình mượt mà, hỗ trợ đa ngôn ngữ.", price: 0, status: "published" },
    { name: "MindMap AI", description: "Sắp xếp ý tưởng thông minh với trợ lý AI.", price: 5.99, status: "published" },
    { name: "VideoSync Pro", description: "Phần mềm chỉnh sửa và biên tập video chuẩn điện ảnh.", price: 59.99, status: "published" },
    { name: "PixelArt Maker", description: "Công cụ vẽ pixel đơn giản nhưng mạnh mẽ.", price: 0, status: "published" },
    { name: "FinanceTracker Plus", description: "Quản lý tài chính cá nhân và đầu tư dễ dàng.", price: 4.99, status: "published" }
];

const mockDetailData = {
    ratingScore: 4.8,
    ratingCount: 25000,
    size: "2.4 GB",
    platforms: ["PC", "Tablet"],
    tags: ["Thiết kế", "Năng suất", "Sáng tạo"],
    systemRequirements: {
        min: { os: "Windows 10 64-bit", cpu: "Intel Core i5", ram: "8 GB", graphics: "DirectX 12 support" },
        recommended: { os: "Windows 11", cpu: "Intel Core i7+", ram: "16 GB hoặc hơn", graphics: "4GB VRAM GPU" }
    },
    features: [
        { icon: "auto_fix_high", desc: "Công cụ AI thông minh để hỗ trợ tự động hóa luồng làm việc." },
        { icon: "layers", desc: "Hệ thống chuyên sâu cho phép quản lý vòng đời dữ liệu." },
        { icon: "cloud_done", desc: "Đồng bộ hóa đám mây mượt mà giữa các thiết bị." }
    ],
    languageSupportCount: 26,
    securityVerified: true,
    inAppPurchases: false
};

async function seedApps() {
    try {
        console.log("Starting Apps Seeding...");
        const devUser = await userModel.findOne({ username: "system_dev" });
        const prodCategory = await categoryModel.findOne({ name: "Productivity" });

        for (let app of trendingAppsData) {
            const slug = slugify(app.name, { replacement: '-', lower: true, locale: 'vi', trim: true });

            // Random images per app for diversity
            const randomSeed = Math.floor(Math.random() * 1000);
            const dynamicMockData = {
                ...mockDetailData,
                iconUrl: `https://picsum.photos/seed/icon-${slug}-${randomSeed}/200/200`,
                screenshots: [
                    `https://picsum.photos/seed/screenshot1-${slug}-${randomSeed}/800/450`,
                    `https://picsum.photos/seed/screenshot2-${slug}-${randomSeed}/800/450`,
                    `https://picsum.photos/seed/screenshot3-${slug}-${randomSeed}/800/450`
                ]
            };

            await appModel.updateOne(
                { name: app.name },
                {
                    $set: {
                        ...app,
                        ...dynamicMockData,
                        slug,
                        developerId: devUser ? devUser._id : null,
                        categoryId: prodCategory ? prodCategory._id : null
                    }
                },
                { upsert: true }
            );
        }
        console.log("✅ Apps seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Apps seeding: ", err);
        throw err;
    }
}

module.exports = seedApps;
