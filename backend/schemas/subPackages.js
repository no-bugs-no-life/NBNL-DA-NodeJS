const mongoose = require("mongoose");

const subPackageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Package name is required"],
            trim: true
        },
        type: {
            type: String,
            required: [true, "Package type is required"],
            enum: ["monthly", "yearly", "lifetime"],
            lowercase: true
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"]
        },
        // Duration in days (0 for lifetime)
        durationDays: {
            type: Number,
            required: [true, "Duration is required"],
            min: 0
        },
        description: {
            type: String,
            default: ""
        },
        isActive: {
            type: Boolean,
            default: true
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

subPackageSchema.index({ type: 1 });
subPackageSchema.index({ isActive: 1 });
subPackageSchema.index({ price: 1 });

const mongoosePaginate = require('mongoose-paginate-v2');
subPackageSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("subPackage", subPackageSchema);
