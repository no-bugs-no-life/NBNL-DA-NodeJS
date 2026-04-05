const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Reporter ID is required"]
        },
        targetType: {
            type: String,
            required: [true, "Target type is required"],
            enum: ["app", "review"],
            lowercase: true
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Target ID is required"]
        },
        reason: {
            type: String,
            required: [true, "Reason is required"]
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved", "dismissed"],
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

reportSchema.index({ reporterId: 1 });
reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ createdAt: -1 });

const mongoosePaginate = require('mongoose-paginate-v2');
reportSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("report", reportSchema);
