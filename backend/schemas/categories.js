const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            default: null
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

categorySchema.index({ name: 1 });
categorySchema.index({ parentId: 1 });

const mongoosePaginate = require('mongoose-paginate-v2');
categorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("category", categorySchema);
