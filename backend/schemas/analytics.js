const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
    {
        appId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "app",
            required: [true, "App ID is required"]
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now
        },
        views: {
            type: Number,
            min: 0,
            default: 0
        },
        downloads: {
            type: Number,
            min: 0,
            default: 0
        },
        installs: {
            type: Number,
            min: 0,
            default: 0
        },
        activeUsers: {
            type: Number,
            min: 0,
            default: 0
        },
        ratingAverage: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        crashCount: {
            type: Number,
            min: 0,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

analyticsSchema.index({ appId: 1, date: -1 });
analyticsSchema.index({ date: -1 });

// Mỗi app chỉ có 1 record mỗi ngày
analyticsSchema.index({ appId: 1, date: 1 }, { unique: true });

const mongoosePaginate = require('mongoose-paginate-v2');
analyticsSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("analytics", analyticsSchema);
