let appModel = require('../schemas/apps');
let path = require('path');
let fs = require('fs');
let slugify = require('slugify');

// Kiem tra app co thuoc ve developer khong
async function isAppOwner(appId, userId) {
    let app = await appModel.findOne({ _id: appId, isDeleted: false });
    if (!app) return false;
    return app.developerId.toString() === userId;
}

// Lay role cua user
async function getUserRole(userId) {
    let userController = require('./users');
    let user = await userController.FindUserById(userId);
    if (!user) return null;
    return user.role ? user.role.name : null;
}

module.exports = {
    // GET - List published apps (public)
    getAllApps: async function (queries) {
        let { limit = 20, page = 1, categoryId, type, flag } = queries;
        let filter = { status: "published", isDeleted: false };
        if (categoryId) filter.categoryId = categoryId;
        if (type) filter.type = type;
        if (flag) filter.flags = { $in: [flag] };

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: 'developerId', select: 'fullName email avatarUrl' },
                { path: 'categoryId', select: 'name' }
            ]
        };
        return await appModel.paginate(filter, options);
    },

    // GET - List apps by current developer
    getMyApps: async function (userId, queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: { path: 'categoryId', select: 'name' }
        };
        return await appModel.paginate({ developerId: userId, isDeleted: false }, options);
    },

    // GET - List pending apps
    getPendingApps: async function (queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: 1 },
            populate: [
                { path: 'developerId', select: 'fullName email avatarUrl' },
                { path: 'categoryId', select: 'name' }
            ]
        };
        return await appModel.paginate({ status: "pending", isDeleted: false }, options);
    },

    // GET - App detail
    getAppById: async function (id) {
        let app = await appModel.findOne({ _id: id, isDeleted: false })
            .populate('developerId', 'fullName email avatarUrl')
            .populate('categoryId', 'name');

        if (app) {
            let reviewModel = require('../schemas/reviews');
            let reviews = await reviewModel.find({ appId: app._id, status: "approved", isDeleted: false })
                .populate('userId', 'fullName avatarUrl');

            app = app.toObject();
            app.reviews = reviews.map(r => ({
                userId: r.userId,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt
            }));
        }
        return app;
    },

    // GET - App detail by slug
    getAppBySlug: async function (slug) {
        let app = await appModel.findOne({ slug: slug, isDeleted: false })
            .populate('developerId', 'fullName email avatarUrl')
            .populate('categoryId', 'name');

        if (app) {
            let reviewModel = require('../schemas/reviews');
            let reviews = await reviewModel.find({ appId: app._id, status: "approved", isDeleted: false })
                .populate('userId', 'fullName avatarUrl');

            app = app.toObject();
            app.reviews = reviews.map(r => ({
                userId: r.userId,
                rating: r.rating,
                comment: r.comment,
                createdAt: r.createdAt
            }));
            return app;
        }

        // Neu khong tim thay trong apps, tim trong products (Games) va map ve dinh dang app
        let productModel = require('../schemas/products');
        let product = await productModel.findOne({ slug: slug, isDeleted: false });
        if (product) {
            return {
                ...product._doc,
                _id: product._id,
                name: product.title,
                slug: product.slug,
                description: product.description,
                price: product.price,
                fileUrl: "",
                iconUrl: (product.images && product.images.length > 0) ? product.images[0] : "",
                version: "1.0.0",
                status: "published",
                developerId: { fullName: "APKBugs Games Publisher", email: "", avatarUrl: "" },
                categoryId: { name: product.category },
                screenshots: product.images || [],
                ratingScore: 4.8,
                ratingCount: 15600,
                size: "45.2 GB",
                platforms: ["PC"],
                tags: product.tags || [product.category, "Game", "Action"],
                systemRequirements: {
                    min: { os: "Windows 10 64-bit", cpu: "Intel Core i5-8400", ram: "8 GB RAM", graphics: "NVIDIA GTX 1060" },
                    recommended: { os: "Windows 11", cpu: "Intel Core i7-10700K", ram: "16 GB RAM", graphics: "NVIDIA RTX 3070" }
                },
                features: [
                    { icon: "sports_esports", desc: "Hỗ trợ tay cầm trọn vẹn" },
                    { icon: "cloud_sync", desc: "Lưu trữ đám mây qua APKBugs Cloud" },
                    { icon: "group", desc: "Chế độ nhiều người chơi trực tuyến" }
                ],
                languageSupportCount: 12,
                securityVerified: true,
                inAppPurchases: true,
                reviews: [
                    {
                        name: "Người dùng Khách",
                        initials: "NK",
                        time: "Hôm nay",
                        text: "Một sản phẩm rất thú vị nhưng vẫn cần thêm nhiều cập nhật.",
                        rating: 5
                    }
                ]
            };
        }
        return null;
    },

    // POST - Create app
    createApp: async function (data, userId) {
        let newApp = new appModel({
            name: data.name,
            slug: slugify(data.name, { replacement: '-', remove: undefined, lower: true, locale: 'vi', trim: true }),
            description: data.description || "",
            developerId: userId,
            categoryId: data.categoryId || null,
            version: data.version || "1.0.0",
            status: "pending",
            fileId: null,
            iconUrl: data.iconUrl || "",
            price: data.price || 0,
            subscriptionPrice: data.subscriptionPrice || 0
        });
        await newApp.save();
        await newApp.populate('categoryId', 'name');
        return newApp;
    },

    // POST - Attach App File (APK/IPA/EXE) to App
    uploadFile: async function (appId, userId, fileId) {
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };
        if (app.developerId.toString() !== userId) return { error: "Ban khong co quyen tai file len app nay", code: 403 };

        app.fileId = fileId;
        await app.save();
        return { message: "Gan file chuong trinh vao App thanh cong", fileId: app.fileId, version: app.version };
    },

    // POST - Approve app
    approveApp: async function (id) {
        let app = await appModel.findOne({ _id: id, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };
        app.status = "approved";
        await app.save();
        return app;
    },

    // POST - Reject app
    rejectApp: async function (id) {
        let app = await appModel.findOne({ _id: id, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };
        app.status = "rejected";
        await app.save();
        return app;
    },

    // POST - Publish app
    publishApp: async function (id) {
        let app = await appModel.findOne({ _id: id, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };
        if (app.status !== "approved") return { error: "App phai duoc duyet truoc khi xuat ban", code: 400 };
        app.status = "published";
        await app.save();
        return app;
    },

    // PUT - Update app
    updateApp: async function (id, userId, data) {
        let app = await appModel.findOne({ _id: id, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };
        if (app.developerId.toString() !== userId) return { error: "Ban khong co quyen chinh sua app nay", code: 403 };

        let allowedFields = ['name', 'description', 'categoryId', 'version', 'iconUrl', 'price', 'subscriptionPrice'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) {
                if (field === 'name' && data.name !== app.name) {
                    app.name = data.name;
                    app.slug = slugify(data.name, { replacement: '-', remove: undefined, lower: true, locale: 'vi', trim: true });
                } else {
                    app[field] = data[field];
                }
            }
        });

        // Reset ve pending khi cap nhat thong tin
        app.status = "pending";
        await app.save();
        await app.populate('categoryId', 'name');
        return app;
    },

    // DELETE - Soft delete app
    deleteApp: async function (id, userId) {
        let app = await appModel.findOne({ _id: id, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (app.developerId.toString() !== userId && !isAdmin) {
            return { error: "Ban khong co quyen xoa app nay", code: 403 };
        }

        app.isDeleted = true;
        await app.save();
        return app;
    },

    // GET - Download App
    downloadApp: async function (id, userId) {
        let app = await appModel.findOne({ _id: id, isDeleted: false }).populate('fileId');
        if (!app) return { error: "App not found", code: 404 };

        let actualUrl = app.fileId && app.fileId.url ? app.fileId.url : "";

        if (app.price === 0) {
            return { fileUrl: actualUrl };
        }

        let subscriptionModel = require('../schemas/subscriptions');
        let subscription = await subscriptionModel.findOne({
            userId: userId,
            appId: id,
            status: "active"
        });

        if (!subscription) {
            return { error: "Ban can mua app de co the tai xuong", code: 403 };
        }

        return { fileUrl: actualUrl };
    }
};
