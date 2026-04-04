const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Coupon code is required"],
            uppercase: true,
            trim: true
        },
        discountType: {
            type: String,
            required: [true, "Discount type is required"],
            enum: ["percentage", "fixed"],
            lowercase: true
        },
        discountValue: {
            type: Number,
            required: [true, "Discount value is required"],
            min: [0, "Discount value cannot be negative"]
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"]
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"]
        },
        usageLimit: {
            type: Number,
            min: 0,
            default: 0
        },
        usedCount: {
            type: Number,
            min: 0,
            default: 0
        },
        appIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "app"
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("coupon", couponSchema);
