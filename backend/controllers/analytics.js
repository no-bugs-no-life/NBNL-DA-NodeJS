let analyticsModel = require('../schemas/analytics');
let appModel = require('../schemas/apps');

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
    // GET - List analytics (developer: own apps only, ADMIN: all)
    getAnalytics: async function (queries, userId) {
        let { limit = 30, page = 1, appId, startDate, endDate } = queries;
        let filter = {};

        if (appId) {
            let isAdmin = (await getUserRole(userId)) === 'ADMIN';
            if (!isAdmin) {
                let owned = await isAppOwner(appId, userId);
                if (!owned) return { error: "Ban khong co quyen xem analytics cua app nay", code: 403 };
            }
            filter.appId = appId;
        }

        if (startDate) {
            filter.date = filter.date || {};
            filter.date.$gte = new Date(startDate);
        }
        if (endDate) {
            filter.date = filter.date || {};
            filter.date.$lte = new Date(endDate);
        }

        return await analyticsModel.find(filter)
            .populate('appId', 'name iconUrl')
            .sort({ date: -1 })
            .skip(parseInt(limit) * (parseInt(page) - 1))
            .limit(parseInt(limit));
    },

    // GET - Summary stats for an app
    getSummary: async function (appId, userId) {
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) return { error: "App not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (!isAdmin && app.developerId.toString() !== userId) {
            return { error: "Ban khong co quyen xem analytics cua app nay", code: 403 };
        }

        let stats = await analyticsModel.aggregate([
            { $match: { appId: app._id } },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" },
                    totalDownloads: { $sum: "$downloads" },
                    totalInstalls: { $sum: "$installs" },
                    avgActiveUsers: { $avg: "$activeUsers" },
                    avgRating: { $avg: "$ratingAverage" },
                    totalCrashes: { $sum: "$crashCount" },
                    recordCount: { $sum: 1 }
                }
            }
        ]);

        let summary = stats[0] || {
            totalViews: 0,
            totalDownloads: 0,
            totalInstalls: 0,
            avgActiveUsers: 0,
            avgRating: 0,
            totalCrashes: 0,
            recordCount: 0
        };

        return {
            appId: appId,
            appName: app.name,
            ...summary
        };
    },

    // GET - Analytics record detail
    getAnalyticsById: async function (id, userId) {
        let record = await analyticsModel.findOne({ _id: id })
            .populate('appId', 'name iconUrl developerId');
        if (!record) return { error: "Analytics record not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (!isAdmin) {
            let owned = await isAppOwner(record.appId._id, userId);
            if (!owned) return { error: "Ban khong co quyen xem analytics nay", code: 403 };
        }
        return record;
    },

    // PUT /daily - Upsert daily record (internal)
    upsertDaily: async function (data) {
        let { appId, date, views, downloads, installs, activeUsers, ratingAverage, crashCount } = data;
        if (!appId || !date) return { error: "appId va date la bat buoc", code: 400 };

        let recordDate = new Date(date);
        recordDate.setHours(0, 0, 0, 0);

        let record = await analyticsModel.findOneAndUpdate(
            { appId, date: recordDate },
            {
                $inc: {
                    views: views || 0,
                    downloads: downloads || 0,
                    installs: installs || 0,
                    activeUsers: activeUsers || 0,
                    crashCount: crashCount || 0
                },
                $set: {
                    ratingAverage: ratingAverage !== undefined ? ratingAverage : 0
                }
            },
            { new: true, upsert: true }
        );
        return record;
    },

    // POST - Create analytics record (internal)
    createAnalytics: async function (data) {
        let { appId, date, views, downloads, installs, activeUsers, ratingAverage, crashCount } = data;
        if (!appId || !date) return { error: "appId va date la bat buoc", code: 400 };

        let newRecord = new analyticsModel({
            appId,
            date: new Date(date),
            views: views || 0,
            downloads: downloads || 0,
            installs: installs || 0,
            activeUsers: activeUsers || 0,
            ratingAverage: ratingAverage || 0,
            crashCount: crashCount || 0
        });
        await newRecord.save();
        return newRecord;
    },

    // PUT /:id - Update analytics record (internal)
    updateAnalytics: async function (id, data) {
        let record = await analyticsModel.findOne({ _id: id });
        if (!record) return { error: "Analytics record not found", code: 404 };

        let allowedFields = ['views', 'downloads', 'installs', 'activeUsers', 'ratingAverage', 'crashCount'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) record[field] = data[field];
        });
        await record.save();
        return record;
    },

    // DELETE /:id - Delete analytics record (internal)
    deleteAnalytics: async function (id) {
        let record = await analyticsModel.findOneAndUpdate(
            { _id: id },
            { isDeleted: true },
            { new: true }
        );
        if (!record) return { error: "Analytics record not found", code: 404 };
        return record;
    }
};
