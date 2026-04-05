const mongoose = require("mongoose");
const reviewModel = require("../schemas/reviews");
const appModel = require("../schemas/apps");
const userModel = require("../schemas/users");

const sampleReviews = [
    { text: "Tuyệt vời! Ứng dụng này đã giúp tôi tiết kiệm được rất nhiều thời gian.", rating: 5 },
    { text: "Khá ổn, nhưng đôi khi vẫn gặp lỗi lặt vặt. Mong nhà phát triển sẽ sớm khắc phục.", rating: 4 },
    { text: "Giá hơi cao so với tính năng cung cấp, nhưng xài cũng tốt.", rating: 3 },
    { text: "Phiên bản mới chạy mượt mà hơn hẳn, giao diện đẹp và dễ sử dụng.", rating: 5 },
    { text: "Hỗ trợ khách hàng rất nhiệt tình khi mình gặp vấn đề về dữ liệu.", rating: 5 },
    { text: "Thiết kế đẹp nhưng tốc độ phản hồi từ server đôi lúc hơi chậm.", rating: 4 }
];

async function seedReviews() {
    try {
        console.log("Starting Reviews Seeding...");

        const apps = await appModel.find();
        let users = await userModel.find();

        if (users.length === 0 || apps.length === 0) {
            console.log("⚠️ Not enough users or apps to seed reviews. Run seedUser and seedApps first.");
            return;
        }

        // Drop current reviews for clean slate
        await reviewModel.deleteMany({});

        for (let app of apps) {
            // Assign 1-3 random reviews per app
            const reviewCount = Math.floor(Math.random() * 3) + 1;

            // Randomly select distinct users for reviews
            let selectedUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, reviewCount);

            for (let user of selectedUsers) {
                const randomReview = sampleReviews[Math.floor(Math.random() * sampleReviews.length)];

                let review = new reviewModel({
                    appId: app._id,
                    userId: user._id,
                    rating: randomReview.rating,
                    comment: randomReview.text,
                    status: "approved"
                });
                await review.save();
            }
        }

        console.log("✅ Reviews seeded successfully.");
    } catch (err) {
        console.error("❌ Error during Reviews seeding: ", err);
        throw err;
    }
}

module.exports = seedReviews;
