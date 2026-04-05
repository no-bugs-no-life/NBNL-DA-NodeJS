let mongoose = require("mongoose");

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
        // Trang thai ho so developer
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        // Ly do tu choi (neu bi reject)
        rejectionReason: {
            type: String,
            default: ""
        },
        // Quyen han cua developer
        permissions: {
            canPublishApp: { type: Boolean, default: false },
            canEditOwnApps: { type: Boolean, default: true },
            canDeleteOwnApps: { type: Boolean, default: false },
            canViewAnalytics: { type: Boolean, default: false },
            canManagePricing: { type: Boolean, default: true },
            canRespondReviews: { type: Boolean, default: true }
        },
        // Danh sach app dang quan ly
        apps: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "app"
            }
        ],
        // Thong tin lien he
        contactEmail: {
            type: String,
            default: ""
        },
        socialLinks: {
            type: Map,
            of: String,
            default: {}
        },
        // Thong ke
        stats: {
            totalApps: { type: Number, default: 0 },
            publishedApps: { type: Number, default: 0 },
            totalDownloads: { type: Number, default: 0 },
            avgRating: { type: Number, default: 0 }
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            default: null
        },
        approvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

developerSchema.index({ userId: 1 });
developerSchema.index({ name: 1 });
developerSchema.index({ status: 1 });

const mongoosePaginate = require('mongoose-paginate-v2');
developerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("developer", developerSchema);
