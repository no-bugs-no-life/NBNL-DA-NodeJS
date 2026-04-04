const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tag name is required"],
            trim: true,
            lowercase: true
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

tagSchema.index({ name: 1 }, { unique: true });
tagSchema.index({ appIds: 1 });

module.exports = mongoose.model("tag", tagSchema);
