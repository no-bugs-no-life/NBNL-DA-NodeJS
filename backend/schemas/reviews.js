const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        appId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "app",
            required: [true, "App ID is required"]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required"]
        },
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating must not exceed 5"]
        },
        comment: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index({ appId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ status: 1 });

// Mỗi user chỉ đánh giá 1 app 1 lần
reviewSchema.index({ appId: 1, userId: 1 }, { unique: true });

const mongoosePaginate = require('mongoose-paginate-v2');
reviewSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("review", reviewSchema);
