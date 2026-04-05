const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: [true, "User ID is required"],
            unique: true
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

wishlistSchema.index({ userId: 1 });

const mongoosePaginate = require('mongoose-paginate-v2');
wishlistSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("wishlist", wishlistSchema);
