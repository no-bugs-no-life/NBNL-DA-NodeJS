var express = require('express');
var router = express.Router();
let analyticsModel = require('../schemas/analytics');
let appModel = require('../schemas/apps');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// Helper: kiem tra app co thuoc ve developer khong
// ============================================================
async function isAppOwner(appId, userId) {
    let app = await appModel.findOne({ _id: appId, isDeleted: false });
    if (!app) return false;
    return app.developerId.toString() === userId;
}

// ============================================================
// GET /api/v1/analytics                        - List analytics (developer/admin)
// GET /api/v1/analytics/summary/:appId         - Get summary stats for an app
// GET /api/v1/analytics/:id                     - Get analytics record detail
// ============================================================

// List analytics with filters (developer: own apps only, ADMIN: all)
router.get('/', checkLogin, async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 30;
        let page = queries.page ? parseInt(queries.page) : 1;
        let appId = queries.appId;
        let startDate = queries.startDate;
        let endDate = queries.endDate;

        let filter = { isDeleted: false };

        // Loc theo appId
        if (appId) {
            // Developer chi xem duoc analytics cua app minh
            if (!queries._internal) {
                let userController = require('../controllers/users');
                let user = await userController.FindUserById(req.userId);
                let isAdmin = user && user.role && user.role.name === 'ADMIN';
                if (!isAdmin) {
                    let owned = await isAppOwner(appId, req.userId);
                    if (!owned) {
                        return res.status(403).send({ message: "Ban khong co quyen xem analytics cua app nay" });
                    }
                }
            }
            filter.appId = appId;
        }

        // Loc theo khoang ngay
        if (startDate) {
            filter.date = filter.date || {};
            filter.date.$gte = new Date(startDate);
        }
        if (endDate) {
            filter.date = filter.date || {};
            filter.date.$lte = new Date(endDate);
        }

        let analytics = await analyticsModel.find(filter)
            .populate('appId', 'name iconUrl')
            .sort({ date: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(analytics);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get summary stats for an app (developer: own, ADMIN: all)
router.get('/summary/:appId', checkLogin, async function (req, res, next) {
    try {
        let appId = req.params.appId;
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) {
            return res.status(404).send({ message: "App not found" });
        }

        // Kiem tra quyen
        let userController = require('../controllers/users');
        let user = await userController.FindUserById(req.userId);
        let isAdmin = user && user.role && user.role.name === 'ADMIN';
        if (!isAdmin && app.developerId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen xem analytics cua app nay" });
        }

        // Tong hop tu bang analytics
        let stats = await analyticsModel.aggregate([
            { $match: { appId: app._id, isDeleted: false } },
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

        res.send({
            appId: appId,
            appName: app.name,
            ...summary
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get analytics record detail (developer: own app, ADMIN: all)
router.get('/:id', checkLogin, async function (req, res, next) {
    try {
        let record = await analyticsModel.findOne({ _id: req.params.id, isDeleted: false })
            .populate('appId', 'name iconUrl developerId');
        if (!record) {
            return res.status(404).send({ message: "Analytics record not found" });
        }

        // Kiem tra quyen
        let userController = require('../controllers/users');
        let user = await userController.FindUserById(req.userId);
        let isAdmin = user && user.role && user.role.name === 'ADMIN';
        if (!isAdmin) {
            let owned = await isAppOwner(record.appId._id, req.userId);
            if (!owned) {
                return res.status(403).send({ message: "Ban khong co quyen xem analytics nay" });
            }
        }

        res.send(record);
    } catch (error) {
        res.status(404).send({ message: "Analytics record not found" });
    }
});

// ============================================================
// INTERNAL CRUD (no auth - cho events/cron)
// ============================================================

// Create or update daily analytics record (internal - no auth)
// PUT - upsert: neu record theo (appId + date) da ton tai thi update, chua co thi create
router.put('/daily', async function (req, res, next) {
    try {
        let { appId, date, views, downloads, installs, activeUsers, ratingAverage, crashCount } = req.body;
        if (!appId || !date) {
            return res.status(400).send({ message: "appId va date la bat buoc" });
        }

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

        res.send({ message: "Cap nhat analytics thanh cong", record });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /api/v1/analytics - Create new analytics record (internal)
router.post('/', async function (req, res, next) {
    try {
        let { appId, date, views, downloads, installs, activeUsers, ratingAverage, crashCount } = req.body;
        if (!appId || !date) {
            return res.status(400).send({ message: "appId va date la bat buoc" });
        }

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
        res.status(201).send(newRecord);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT /api/v1/analytics/:id - Update analytics record (internal)
router.put('/:id', async function (req, res, next) {
    try {
        let record = await analyticsModel.findOne({ _id: req.params.id });
        if (!record) {
            return res.status(404).send({ message: "Analytics record not found" });
        }

        let allowedFields = ['views', 'downloads', 'installs', 'activeUsers', 'ratingAverage', 'crashCount'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                record[field] = req.body[field];
            }
        });
        await record.save();
        res.send(record);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE /api/v1/analytics/:id - Delete analytics record (internal)
router.delete('/:id', async function (req, res, next) {
    try {
        let record = await analyticsModel.findOneAndUpdate(
            { _id: req.params.id },
            { isDeleted: true },
            { new: true }
        );
        if (!record) {
            return res.status(404).send({ message: "Analytics record not found" });
        }
        res.send({ message: "Analytics record da duoc xoa", record });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;