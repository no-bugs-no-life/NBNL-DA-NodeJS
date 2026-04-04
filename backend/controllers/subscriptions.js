let subscriptionModel = require('../schemas/subscriptions');
let appModel = require('../schemas/apps');

module.exports = {
    // GET - Lay tat ca subscriptions (ADMIN/MODERATOR)
    getAllSubscriptions: async function (queries) {
        let { limit = 20, page = 1, userId, appId, status } = queries;
        let filter = { isDeleted: false };
        if (userId) filter.userId = userId;
        if (appId) filter.appId = appId;
        if (status) filter.status = status;

        return await subscriptionModel.find(filter)
            .populate('userId', 'fullName email avatarUrl')
            .populate('appId', 'name iconUrl')
            .sort({ createdAt: -1 })
            .skip(parseInt(limit) * (parseInt(page) - 1))
            .limit(parseInt(limit));
    },

    // GET - Lay subscriptions cua user hien tai
    getMySubscriptions: async function (userId) {
        return await subscriptionModel.find({ userId, isDeleted: false })
            .populate('appId', 'name iconUrl')
            .sort({ createdAt: -1 });
    },

    // GET - Lay subscription cua user cho 1 app cu the
    getSubscriptionByApp: async function (userId, appId) {
        return await subscriptionModel.findOne({ userId, appId, isDeleted: false })
            .populate('appId', 'name iconUrl');
    },

    // GET - Lay chi tiet subscription
    getSubscriptionById: async function (id) {
        return await subscriptionModel.findOne({ _id: id, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate('appId', 'name iconUrl');
    },

    // POST - Tao subscription moi (ADMIN/MODERATOR)
    createSubscription: async function (data) {
        let { userId, appId, type } = data;

        // Kiem tra app ton tai
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };

        // Tinh ngay
        let startDate = new Date();
        let endDate = new Date(startDate);
        if (type === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (type === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else if (type === 'lifetime') {
            endDate = new Date('2099-12-31');
        }

        let newSub = new subscriptionModel({
            userId,
            appId,
            type,
            startDate,
            endDate,
            status: 'active'
        });
        await newSub.save();
        await newSub.populate('userId', 'fullName email avatarUrl');
        await newSub.populate('appId', 'name iconUrl');
        return newSub;
    },

    // PUT - Gia han subscription (ADMIN/MODERATOR)
    renewSubscription: async function (id, type) {
        let sub = await subscriptionModel.findOne({ _id: id, isDeleted: false });
        if (!sub) return { error: "Subscription not found", code: 404 };
        if (sub.status === 'cancelled') {
            return { error: "Khong the gia han subscription da bi huy", code: 400 };
        }

        let startDate = sub.endDate > new Date() ? sub.endDate : new Date();
        let endDate = new Date(startDate);
        if (type === 'monthly') {
            endDate.setMonth(endDate.getMonth() + 1);
        } else if (type === 'yearly') {
            endDate.setFullYear(endDate.getFullYear() + 1);
        } else if (type === 'lifetime') {
            endDate = new Date('2099-12-31');
        }

        sub.type = type;
        sub.startDate = startDate;
        sub.endDate = endDate;
        sub.status = 'active';
        await sub.save();
        await sub.populate('userId', 'fullName email avatarUrl');
        await sub.populate('appId', 'name iconUrl');
        return sub;
    },

    // PUT - Huy subscription (user hoac ADMIN)
    cancelSubscription: async function (id, userId, isAdmin) {
        let sub = await subscriptionModel.findOne({ _id: id, isDeleted: false });
        if (!sub) return { error: "Subscription not found", code: 404 };
        if (!isAdmin && sub.userId.toString() !== userId) {
            return { error: "Ban khong co quyen huy subscription nay", code: 403 };
        }
        sub.status = 'cancelled';
        await sub.save();
        await sub.populate('userId', 'fullName email avatarUrl');
        await sub.populate('appId', 'name iconUrl');
        return sub;
    },

    // DELETE - Xoa mem subscription (ADMIN/MODERATOR)
    deleteSubscription: async function (id) {
        let sub = await subscriptionModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!sub) return { error: "Subscription not found", code: 404 };
        return sub;
    }
};
