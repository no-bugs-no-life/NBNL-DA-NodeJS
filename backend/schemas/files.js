const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        ownerType: {
            type: String,
            required: [true, "Owner type is required"],
            enum: ["app", "user", "developer"],
            lowercase: true
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "Owner ID is required"]
        },
        fileType: {
            type: String,
            required: [true, "File type is required"],
            enum: ["apk", "ipa", "icon", "banner", "screenshot", "avatar", "other"],
            lowercase: true
        },
        url: {
            type: String,
            required: [true, "File URL is required"]
        },
        size: {
            type: Number,
            min: 0,
            default: 0
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

fileSchema.index({ ownerType: 1, ownerId: 1 });
fileSchema.index({ fileType: 1 });

module.exports = mongoose.model("file", fileSchema);
