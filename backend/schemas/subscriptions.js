const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required"]
        },
        appId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "app",
            required: [true, "App ID is required"]
        },
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subPackage",
            required: [true, "Package ID is required"]
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"]
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"]
        },
        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active"
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

subscriptionSchema.index({ userId: 1 });
subscriptionSchema.index({ appId: 1 });
subscriptionSchema.index({ packageId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ endDate: 1 });

const mongoosePaginate = require('mongoose-paginate-v2');
subscriptionSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("subscription", subscriptionSchema);
