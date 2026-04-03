const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required"],
            unique: true
        },
        name: {
            type: String,
            required: [true, "Developer name is required"],
            trim: true
        },
        bio: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
        avatarUrl: {
            type: String,
            default: ""
        },
        apps: [
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

developerSchema.index({ userId: 1 });
developerSchema.index({ name: 1 });

module.exports = mongoose.model("developer", developerSchema);
