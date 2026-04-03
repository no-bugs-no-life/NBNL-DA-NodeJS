let mongoose = require('mongoose');

const appSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "App name is required"],
            trim: true
        },
        description: {
            type: String,
            default: ""
        },
        developerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "Developer ID is required"]
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            default: null
        },
        version: {
            type: String,
            default: "1.0.0"
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "published"],
            default: "pending"
        },
        fileUrl: {
            type: String,
            default: ""
        },
        iconUrl: {
            type: String,
            default: ""
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

appSchema.index({ name: 1 });
appSchema.index({ developerId: 1 });
appSchema.index({ categoryId: 1 });
appSchema.index({ status: 1 });

module.exports = mongoose.model("app", appSchema);