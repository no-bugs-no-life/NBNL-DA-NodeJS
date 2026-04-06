let appModel = require('../schemas/apps');
let developerModel = require('../schemas/developers');
let path = require('path');
let fs = require('fs');
let slugify = require('slugify');

// Kiem tra app co thuoc ve developer khong
async function isAppOwner(appId, userId) {
    let app = await appModel.findOne({ _id: appId, isDeleted: false });
    if (!app) return false;
    let developer = await developerModel.findOne({ userId: userId, isDeleted: false });
    if (!developer) return false;
    return app.developerId.toString() === developer._id.toString();
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

        // Chi hien thi app cua cac developer da duoc approved
        let approvedDevs = await developerModel.find({ status: "approved", isDeleted: false }).select('_id');
        let approvedDevIds = approvedDevs.map(d => d._id);
        filter.developerId = { $in: approvedDevIds };

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: 'developerId', select: 'name contactEmail avatarUrl userId' },
                { path: 'categoryId', select: 'name' },
                { path: 'tags', select: 'name' },
                { path: 'reviews', select: 'rating status' }
            ]
        };
        let result = await appModel.paginate(filter, options);
        result.docs = result.docs.map(app => {
            let doc = app.toObject ? app.toObject() : app;
            let approvedReviews = (doc.reviews || []).filter(r => r.status === 'approved');
            doc.ratingCount = approvedReviews.length;
            doc.ratingScore = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length) : 0;
            return doc;
        });
        return result;
    },

    // GET - List all apps (ADMIN/MODERATOR)
    getAdminApps: async function (queries) {
        let { limit = 20, page = 1, categoryId, type, flag, status, isDeleted } = queries;
        let filter = { isDeleted: false };

        if (isDeleted === 'true') {
            filter.isDeleted = true;
        } else if (isDeleted === 'all') {
            delete filter.isDeleted;
        }

        if (status) {
            filter.status = status;
        }

        if (categoryId) filter.categoryId = categoryId;
        if (type) filter.type = type;
        if (flag) filter.flags = { $in: [flag] };

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: 'developerId', select: 'name contactEmail avatarUrl userId' },
                { path: 'categoryId', select: 'name' },
                { path: 'tags', select: 'name' },
                { path: 'reviews', select: 'rating status' }
            ]
        };
        let result = await appModel.paginate(filter, options);
        result.docs = result.docs.map(app => {
            let doc = app.toObject ? app.toObject() : app;
            let approvedReviews = (doc.reviews || []).filter(r => r.status === 'approved');
            doc.ratingCount = approvedReviews.length;
            doc.ratingScore = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length) : 0;
            return doc;
        });
        return result;
    },

    // GET - List apps by current developer
    getMyApps: async function (userId, queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let developer = await developerModel.findOne({ userId: userId, isDeleted: false });
        if (!developer) return { docs: [], totalDocs: 0, limit, page, totalPages: 0 };

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: 'categoryId', select: 'name' },
                { path: 'tags', select: 'name' },
                { path: 'reviews', select: 'rating status' }
            ]
        };
        let result = await appModel.paginate({ developerId: developer._id, isDeleted: false }, options);
        result.docs = result.docs.map(app => {
            let doc = app.toObject ? app.toObject() : app;
            let approvedReviews = (doc.reviews || []).filter(r => r.status === 'approved');
            doc.ratingCount = approvedReviews.length;
            doc.ratingScore = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length) : 0;
            return doc;
        });
        return result;
    },

    // GET - List pending apps
    getPendingApps: async function (queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: 1 },
            populate: [
                { path: 'developerId', select: 'name contactEmail avatarUrl userId' },
                { path: 'categoryId', select: 'name' },
                { path: 'tags', select: 'name' },
                { path: 'reviews', select: 'rating status' }
            ]
        };
        let result = await appModel.paginate({ status: { $in: ["pending", "approved", "rejected"] }, isDeleted: false }, options);
        result.docs = result.docs.map(app => {
            let doc = app.toObject ? app.toObject() : app;
            let approvedReviews = (doc.reviews || []).filter(r => r.status === 'approved');
            doc.ratingCount = approvedReviews.length;
            doc.ratingScore = approvedReviews.length > 0 ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length) : 0;
            return doc;
        });
        return result;
    },

    // GET - App detail
    getAppById: async function (id) {
        let app = await appModel.findOne({ _id: id, isDeleted: false })
            .populate({ path: 'developerId', match: { isDeleted: false }, select: 'name contactEmail avatarUrl userId status' })
            .populate('categoryId', 'name')
            .populate('tags', 'name');

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
            app.ratingCount = reviews.length;
            app.ratingScore = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
        }
        return app;
    },

    // GET - App detail by slug
    getAppBySlug: async function (slug) {
        let app = await appModel.findOne({ slug: slug, isDeleted: false })
            .populate({ path: 'developerId', match: { status: 'approved', isDeleted: false }, select: 'name contactEmail avatarUrl userId status' })
            .populate('categoryId', 'name')
            .populate('tags', 'name');

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
            app.ratingCount = reviews.length;
            app.ratingScore = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0;
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
    createApp: async function (data, authUserId) {
        let isAdmin = (await getUserRole(authUserId)) === 'ADMIN';
        let developer;

        if (isAdmin && data.developerId) {
            developer = await developerModel.findOne({ _id: data.developerId, isDeleted: false });
        } else {
            developer = await developerModel.findOne({ userId: authUserId, isDeleted: false });
        }

        if (!developer || developer.status !== 'approved') {
            return { error: "Bạn phải đăng ký và được duyệt hồ sơ Developer trước khi tạo App", code: 403 };
        }

        let baseSlug = slugify(data.name, { replacement: '-', remove: undefined, lower: true, locale: 'vi', trim: true });
        let finalSlug = baseSlug;
        let counter = 1;
        while (true) {
            let existingApp = await appModel.findOne({ slug: finalSlug, isDeleted: false });
            if (!existingApp) break;
            finalSlug = `${baseSlug}-${counter}`;
            counter++;
        }

        let newApp = new appModel({
            name: data.name,
            slug: finalSlug,
            description: data.description || "",
            developerId: developer._id,
            categoryId: data.categoryId || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
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
        let isOwner = await isAppOwner(appId, userId);
        if (!isOwner) return { error: "Ban khong co quyen tai file len app nay", code: 403 };

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
        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        let isOwner = await isAppOwner(id, userId);
        if (!isOwner && !isAdmin) {
            return { error: "Ban khong co quyen chinh sua app nay", code: 403 };
        }

        let allowedFields = ['name', 'description', 'categoryId', 'tags', 'version', 'iconUrl', 'price', 'subscriptionPrice'];
        for (let field of allowedFields) {
            if (data[field] !== undefined) {
                if (field === 'name' && data.name !== app.name) {
                    app.name = data.name;
                    let baseSlug = slugify(data.name, { replacement: '-', remove: undefined, lower: true, locale: 'vi', trim: true });
                    let finalSlug = baseSlug;
                    let counter = 1;
                    while (true) {
                        let existingApp = await appModel.findOne({ slug: finalSlug, _id: { $ne: app._id }, isDeleted: false });
                        if (!existingApp) break;
                        finalSlug = `${baseSlug}-${counter}`;
                        counter++;
                    }
                    app.slug = finalSlug;
                } else {
                    app[field] = data[field];
                }
            }
        }

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
        let isOwner = await isAppOwner(id, userId);
        if (!isOwner && !isAdmin) {
            return { error: "Ban khong co quyen xoa app nay", code: 403 };
        }

        app.isDeleted = true;
        await app.save();
        return app;
    },

    // PATCH - Toggle disable/enable app (ADMIN only)
    toggleDisableApp: async function (id) {
        let app = await appModel.findOne({ _id: id, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };
        app.isDisabled = !app.isDisabled;
        await app.save();
        return { message: app.isDisabled ? "App da bi vo hieu hoa" : "App da duoc kich hoat", isDisabled: app.isDisabled };
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
