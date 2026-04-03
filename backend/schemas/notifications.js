const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required"]
        },
        type: {
            type: String,
            required: [true, "Notification type is required"],
            enum: [
                "app_approved",
                "app_rejected",
                "new_review",
                "new_download",
                "system",
                "promotion",
                "update"
            ]
        },
        message: {
            type: String,
            required: [true, "Message is required"]
        },
        isRead: {
            type: Boolean,
            default: false
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

notificationSchema.index({ userId: 1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("notification", notificationSchema);
