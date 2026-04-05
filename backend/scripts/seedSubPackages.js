const mongoose = require("mongoose");
const SubPackage = require("../schemas/subPackages");

async function seedSubPackages() {
    try {
        console.log("Starting SubPackages Seeding...");

        const packages = [
            {
                name: "Basic Monthly",
                type: "monthly",
                price: 9.99,
                durationDays: 30,
                description: "Gói cơ bản hàng tháng cho các chức năng tiêu chuẩn."
            },
            {
                name: "Pro Yearly",
                type: "yearly",
                price: 99.99,
                durationDays: 365,
                description: "Gói chuyên nghiệp năm tiết kiệm hơn."
            },
            {
                name: "Lifetime Premium",
                type: "lifetime",
                price: 199.99,
                durationDays: 0,
                description: "Sở hữu vĩnh viễn mọi chức năng."
            }
        ];

        await SubPackage.deleteMany({});
        await SubPackage.insertMany(packages);

        console.log("✅ SubPackages seeded successfully.");
    } catch (err) {
        console.error("❌ Error during SubPackages seeding: ", err);
        throw err;
    }
}

module.exports = seedSubPackages;
