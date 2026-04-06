let mongoose = require('mongoose');

const appSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "App name is required"],
            trim: true
        },
        slug: {
            type: String,
            unique: true,
            sparse: true
        },
        description: {
            type: String,
            default: ""
        },
        developerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "developer",
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
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "file",
            default: null
        },
        iconUrl: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
            min: 0,
            default: 0
        },
        subscriptionPrice: {
            type: Number,
            min: 0,
            default: 0
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isDisabled: {
            type: Boolean,
            default: false
        },
        screenshots: { type: [String], default: [] },
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "review"
        }],
        size: { type: String, default: "" },
        platforms: { type: [String], default: [] },
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "tag"
        }],
        systemRequirements: {
            min: { os: String, cpu: String, ram: String, graphics: String },
            recommended: { os: String, cpu: String, ram: String, graphics: String }
        },
        features: { type: [{ icon: String, desc: String }], default: [] },
        languageSupportCount: { type: Number, default: 0 },
        securityVerified: { type: Boolean, default: false },
        inAppPurchases: { type: Boolean, default: false },
        type: {
            type: String,
            enum: ["app", "game"],
            default: "app"
        },
        flags: {
            type: [String],
            enum: ["bestseller", "trending", "featured", "editors_choice"],
            default: []
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

const mongoosePaginate = require('mongoose-paginate-v2');
appSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("app", appSchema);