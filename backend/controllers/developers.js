let developerModel = require('../schemas/developers');
let path = require('path');
let fs = require('fs');

// Lay role cua user
async function getUserRole(userId) {
    let userController = require('./users');
    let user = await userController.FindUserById(userId);
    if (!user) return null;
    return user.role ? user.role.name : null;
}

module.exports = {
    // GET - List all developers (public)
    getAllDevelopers: async function (queries) {
        let { limit = 20, page = 1, sortBy = 'createdAt', order = -1 } = queries;
        let sortObj = {};
        sortObj[sortBy] = parseInt(order);

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: sortObj,
            populate: { path: 'userId', select: 'fullName email avatarUrl' }
        };

        return await developerModel.paginate({ isDeleted: false }, options);
    },

    // GET - My developer profile
    getMyProfile: async function (userId) {
        return await developerModel.findOne({ userId, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate('apps', 'name iconUrl status');
    },

    // GET - Developer detail
    getDeveloperById: async function (id) {
        return await developerModel.findOne({ _id: id, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate('apps', 'name iconUrl status description version');
    },

    // POST - Create developer profile
    createDeveloper: async function (userId, data) {
        let existing = await developerModel.findOne({ userId, isDeleted: false });
        if (existing) return { error: "Developer profile da ton tai", code: 400 };

        let newDeveloper = new developerModel({
            userId,
            name: data.name,
            bio: data.bio || "",
            website: data.website || "",
            avatarUrl: data.avatarUrl || "",
            apps: []
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

        // Xoa avatar cu neu co
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
        if (developer.userId.toString() !== userId) return { error: "Ban khong co quyen chinh sua profile nay", code: 403 };

        let allowedFields = ['name', 'bio', 'website', 'avatarUrl'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) developer[field] = data[field];
        });
        await developer.save();
        await developer.populate('userId', 'fullName email avatarUrl');
        return developer;
    },

    // DELETE - Soft delete developer
    deleteDeveloper: async function (id, userId) {
        let developer = await developerModel.findOne({ _id: id, isDeleted: false });
        if (!developer) return { error: "Developer not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (developer.userId.toString() !== userId && !isAdmin) {
            return { error: "Ban khong co quyen xoa developer nay", code: 403 };
        }

        // Xoa avatar neu co
        if (developer.avatarUrl) {
            let filePath = path.join(__dirname, '../', developer.avatarUrl);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        developer.isDeleted = true;
        await developer.save();
        return developer;
    }
};
