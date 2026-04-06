let developerModel = require('../schemas/developers');
let appModel = require('../schemas/apps');
let path = require('path');
let fs = require('fs');

async function getUserRole(userId) {
    let userController = require('./users');
    let user = await userController.FindUserById(userId);
    if (!user) return null;
    return user.role ? user.role.name : null;
}

module.exports = {
    // GET - List all developers (public)
    getAllDevelopers: async function (queries) {
        let { limit = 20, page = 1, sortBy = 'createdAt', order = -1, status } = queries;
        let sortObj = {};
        sortObj[sortBy] = parseInt(order);

        let filter = { isDeleted: false };
        if (status) filter.status = status;

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: sortObj,
            populate: { path: 'userId', select: 'fullName email avatarUrl' }
        };

        return await developerModel.paginate(filter, options);
    },

    // GET - My developer profile
    getMyProfile: async function (userId) {
        return await developerModel.findOne({ userId, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate({
                path: 'apps',
                select: 'name iconUrl status price ratingScore createdAt'
            });
    },

    // GET - Developer detail
    getDeveloperById: async function (id) {
        return await developerModel.findOne({ _id: id, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate({
                path: 'apps',
                select: 'name iconUrl status price ratingScore description version screenshots'
            });
    },

    // GET - My apps as developer
    getMyApps: async function (userId) {
        let dev = await developerModel.findOne({ userId, isDeleted: false });
        if (!dev) return [];

        let filter = { developerId: userId, isDeleted: false };
        return await appModel.find(filter)
            .populate('categoryId', 'name iconUrl')
            .sort({ createdAt: -1 });
    },

    // POST - Create developer profile (pending approval)
    createDeveloper: async function (authUserId, data) {
        let isAdmin = (await getUserRole(authUserId)) === 'ADMIN';
        let targetUserId = (isAdmin && data.userId) ? data.userId : authUserId;

        let existing = await developerModel.findOne({ userId: targetUserId, isDeleted: false });
        if (existing) return { error: "Developer profile da ton tai cho user nay", code: 400 };

        let newDeveloper = new developerModel({
            userId: targetUserId,
            name: data.name,
            bio: data.bio || "",
            website: data.website || "",
            avatarUrl: data.avatarUrl || "",
            contactEmail: data.contactEmail || "",
            socialLinks: data.socialLinks || {},
            status: 'pending',
            apps: [],
            stats: { totalApps: 0, publishedApps: 0, totalDownloads: 0, avgRating: 0 }
        });
        await newDeveloper.save();
        await newDeveloper.populate('userId', 'fullName email avatarUrl');
        return newDeveloper;
    },

    // POST - Upload avatar
    uploadAvatar: async function (id, userId, file) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };
        if (developer.userId.toString() !== userId) return { error: "Ban khong co quyen tai avatar len developer nay", code: 403 };

        if (developer.avatarUrl) {
            let oldPath = path.join(__dirname, '../', developer.avatarUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        developer.avatarUrl = file.path;
        await developer.save();
        return { message: "Upload avatar thanh cong", avatarUrl: developer.avatarUrl };
    },

    // PUT - Update developer profile
    updateDeveloper: async function (id, userId, data) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (developer.userId.toString() !== userId && !isAdmin) {
            return { error: "Ban khong co quyen chinh sua profile nay", code: 403 };
        }

        let allowedFields = ['name', 'bio', 'website', 'avatarUrl', 'contactEmail', 'socialLinks'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) developer[field] = data[field];
        });

        await developer.save();
        await developer.populate('userId', 'fullName email avatarUrl');
        return developer;
    },

    // PUT - Approve developer (ADMIN only)
    approveDeveloper: async function (id, adminUserId, data = {}) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };
        if (developer.status === 'approved') return { error: "Developer da duoc duyet", code: 400 };

        developer.status = 'approved';
        developer.approvedBy = adminUserId;
        developer.approvedAt = new Date();
        developer.rejectionReason = "";

        if (data.permissions) {
            developer.permissions = { ...developer.permissions.toObject(), ...data.permissions };
        }

        await developer.save();
        await developer.populate('userId', 'fullName email avatarUrl');
        await developer.populate('approvedBy', 'fullName email');
        return developer;
    },

    // PUT - Reject developer (ADMIN only)
    rejectDeveloper: async function (id, reason) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };
        if (developer.status === 'rejected') return { error: "Developer da bi tu choi", code: 400 };

        developer.status = 'rejected';
        developer.rejectionReason = reason || "";
        await developer.save();
        await developer.populate('userId', 'fullName email avatarUrl');
        return developer;
    },

    // PUT - Update developer permissions (ADMIN only)
    updatePermissions: async function (id, permissions) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };

        developer.permissions = { ...developer.permissions.toObject(), ...permissions };
        await developer.save();
        return developer;
    },

    // PUT - Revoke developer (ADMIN only)
    revokeDeveloper: async function (id, adminUserId, reason) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };
        if (developer.status !== 'approved') return { error: "Chỉ có thể thu hồi developer đã được duyệt", code: 400 };

        developer.status = 'rejected';
        developer.rejectionReason = reason || "Bị thu hồi quyền";
        await developer.save();
        await developer.populate('userId', 'fullName email avatarUrl');
        return developer;
    },

    // DELETE - Soft delete developer (DISABLED)
    /*
    deleteDeveloper: async function (id, userId) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (developer.userId.toString() !== userId && !isAdmin) {
            return { error: "Ban khong co quyen xoa developer nay", code: 403 };
        }

        if (developer.avatarUrl) {
            let filePath = path.join(__dirname, '../', developer.avatarUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        developer.isDeleted = true;
        await developer.save();
        return developer;
    },
    */

    // GET - Get developer by userId
    getDeveloperByUserId: async function (userId) {
        return await developerModel.findOne({ userId, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate({
                path: 'apps',
                select: 'name iconUrl status price ratingScore createdAt'
            });
    },

    // PUT - Update developer stats
    updateStats: async function (developerId) {
        let developer = await developerModel.findOne({ _id: developerId, isDeleted: false });
        if (!developer) return null;

        let apps = await appModel.find({ developerId: developer.userId, isDeleted: false });
        developer.apps = apps.map(a => a._id);
        developer.stats.totalApps = apps.length;
        developer.stats.publishedApps = apps.filter(a => a.status === 'published').length;
        developer.stats.totalDownloads = apps.reduce((sum, a) => sum + (a.downloadCount || 0), 0);
        developer.stats.avgRating = apps.length > 0
            ? apps.reduce((sum, a) => sum + (a.ratingScore || 0), 0) / apps.length
            : 0;

        await developer.save();
        return developer;
    }
};
