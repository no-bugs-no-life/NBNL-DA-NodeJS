let wishlistModel = require('../schemas/wishlists');
let appModel = require('../schemas/apps');

module.exports = {
    // GET - Lay wishlist cua user hien tai (populate app details)
    getMyWishlist: async function (userId) {
        return await wishlistModel.findOne({ userId, isDeleted: false })
            .populate({
                path: 'appIds',
                select: 'name iconUrl price subscriptionPrice developerId status',
                populate: { path: 'developerId', select: 'fullName' }
            });
    },

    // GET - Lay wishlist by ID (ADMIN/MOD)
    getWishlistById: async function (id) {
        return await wishlistModel.findOne({ _id: id, isDeleted: false })
            .populate({
                path: 'appIds',
                select: 'name iconUrl price developerId'
            });
    },

    // GET - List all wishlists with pagination (ADMIN/MOD)
    getAllWishlists: async function (queries) {
        let { limit = 20, page = 1 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 }
        };
        return await wishlistModel.paginate(
            { isDeleted: false },
            {
                ...options,
                populate: [
                    { path: 'userId', select: 'fullName email avatarUrl' },
                    { path: 'appIds', select: 'name iconUrl price subscriptionPrice developerId status' }
                ]
            }
        );
    },

    // POST - Them app vao wishlist
    addApp: async function (userId, appId) {
        // Kiem tra app ton tai
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };

        // Tim hoac tao wishlist
        let wishlist = await wishlistModel.findOne({ userId, isDeleted: false });
        if (!wishlist) {
            wishlist = new wishlistModel({ userId, appIds: [] });
        }

        // Kiem tra da co trong wishlist chua
        if (wishlist.appIds.some(id => id.toString() === appId)) {
            return { error: "App da co trong wishlist", code: 400 };
        }

        wishlist.appIds.push(appId);
        await wishlist.save();
        await wishlist.populate({
            path: 'appIds',
            select: 'name iconUrl price subscriptionPrice developerId status',
            populate: { path: 'developerId', select: 'fullName' }
        });
        return wishlist;
    },

    // DELETE - Xoa app khoi wishlist
    removeApp: async function (userId, appId) {
        let wishlist = await wishlistModel.findOne({ userId, isDeleted: false });
        if (!wishlist) return { error: "Wishlist not found", code: 404 };

        let before = wishlist.appIds.length;
        wishlist.appIds = wishlist.appIds.filter(id => id.toString() !== appId);

        if (wishlist.appIds.length === before) {
            return { error: "App khong co trong wishlist", code: 404 };
        }

        await wishlist.save();
        await wishlist.populate({
            path: 'appIds',
            select: 'name iconUrl price subscriptionPrice developerId status',
            populate: { path: 'developerId', select: 'fullName' }
        });
        return wishlist;
    },

    // DELETE - Xoa toan bo wishlist (reset)
    clearWishlist: async function (userId) {
        let wishlist = await wishlistModel.findOne({ userId, isDeleted: false });
        if (!wishlist) return null;
        wishlist.appIds = [];
        await wishlist.save();
        return wishlist;
    },

    // DELETE - Xoa mem wishlist (ADMIN/MOD)
    deleteWishlist: async function (id) {
        let wishlist = await wishlistModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!wishlist) return { error: "Wishlist not found", code: 404 };
        return wishlist;
    },

    // POST - Tao wishlist cho user bat ky (ADMIN)
    createWishlistAdmin: async function (userId, appIds) {
        // Kiem tra app ton tai
        if (!appIds || appIds.length === 0) {
            return { error: "appIds la bat buoc", code: 400 };
        }
        let validApps = await appModel.find({ _id: { $in: appIds }, isDeleted: false });
        if (validApps.length !== appIds.length) {
            return { error: "Mot hoac nhieu app khong ton tai", code: 404 };
        }

        // Tim hoac tao wishlist
        let wishlist = await wishlistModel.findOne({ userId, isDeleted: false });
        if (!wishlist) {
            wishlist = new wishlistModel({ userId, appIds: [] });
        }

        // Them app chua co
        for (let appId of appIds) {
            if (!wishlist.appIds.some(id => id.toString() === appId)) {
                wishlist.appIds.push(appId);
            }
        }

        await wishlist.save();
        await wishlist.populate([
            { path: 'userId', select: 'fullName email avatarUrl' },
            { path: 'appIds', select: 'name iconUrl price subscriptionPrice developerId status' }
        ]);
        return wishlist;
    }
};
