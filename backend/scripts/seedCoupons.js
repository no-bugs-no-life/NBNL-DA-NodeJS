const mongoose = require("mongoose");
const Coupon = require("../schemas/coupons");

async function seedCoupons() {
    try {
        console.log("Starting Coupons Seeding...");

        const now = new Date();
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        const coupons = [
            {
                code: "WELCOME2024",
                discountType: "percentage",
                discountValue: 20,
                startDate: now,
                endDate: nextMonth,
                usageLimit: 1000,
                usedCount: 0,
                appIds: []
            },
            {
                code: "FLAT50",
                discountType: "fixed",
                discountValue: 50,
                startDate: now,
                endDate: nextMonth,
                usageLimit: 500,
                usedCount: 50,
                appIds: []
            }
        ];

        await Coupon.deleteMany({});
        await Coupon.insertMany(coupons);

        console.log("✅ Coupons seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Coupons seeding: ", err);
        throw err;
    }
}

module.exports = seedCoupons;
