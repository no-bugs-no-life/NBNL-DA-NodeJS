var express = require('express');
var router = express.Router();
let reportModel = require('../schemas/reports');
let appModel = require('../schemas/apps');
let reviewModel = require('../schemas/reviews');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/reports                              - List reports (ADMIN/MODERATOR)
// GET /api/v1/reports/my                          - List reports by current user
// GET /api/v1/reports/pending                      - List pending reports (ADMIN/MODERATOR)
// GET /api/v1/reports/:id                          - Get report detail
// ============================================================

// List all reports (ADMIN / MODERATOR only)
router.get('/', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 20;
        let page = queries.page ? parseInt(queries.page) : 1;
        let status = queries.status;
        let targetType = queries.targetType;

        let filter = { isDeleted: false };
        if (status) { filter.status = status; }
        if (targetType) { filter.targetType = targetType; }

        let reports = await reportModel.find(filter)
            .populate('reporterId', 'fullName email avatarUrl')
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// List reports by current user (login required)
router.get('/my', checkLogin, async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 20;
        let page = queries.page ? parseInt(queries.page) : 1;

        let reports = await reportModel.find({
            reporterId: req.userId,
            isDeleted: false
        })
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// List pending reports (ADMIN / MODERATOR only)
router.get('/pending', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let reports = await reportModel.find({ status: "pending", isDeleted: false })
            .populate('reporterId', 'fullName email avatarUrl')
            .sort({ createdAt: 1 });

        res.send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get report detail (ADMIN/MODERATOR hoac chinh nguoi gui)
router.get('/:id', checkLogin, async function (req, res, next) {
    try {
        let report = await reportModel.findOne({ _id: req.params.id, isDeleted: false })
            .populate('reporterId', 'fullName email avatarUrl');
        if (!report) {
            return res.status(404).send({ message: "Report not found" });
        }

        // ADMIN / MODERATOR hoac chinh nguoi gui moi xem duoc
        let userController = require('../controllers/users');
        let user = await userController.FindUserById(req.userId);
        let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);
        if (report.reporterId._id.toString() !== req.userId && !isAdminOrMod) {
            return res.status(403).send({ message: "Ban khong co quyen xem report nay" });
        }

        res.send(report);
    } catch (error) {
        res.status(404).send({ message: "Report not found" });
    }
});

// ============================================================
// POST /api/v1/reports                                   - Create new report
// ============================================================

// Create new report (any logged-in user)
router.post('/', checkLogin, async function (req, res, next) {
    try {
        let { targetType, targetId, reason } = req.body;
        if (!targetType || !targetId || !reason) {
            return res.status(400).send({ message: "targetType, targetId va reason la bat buoc" });
        }

        // Kiem tra target co ton tai khong
        if (targetType === 'app') {
            let app = await appModel.findOne({ _id: targetId, isDeleted: false });
            if (!app) {
                return res.status(404).send({ message: "App khong ton tai" });
            }
        } else if (targetType === 'review') {
            let review = await reviewModel.findOne({ _id: targetId, isDeleted: false });
            if (!review) {
                return res.status(404).send({ message: "Review khong ton tai" });
            }
        } else {
            return res.status(400).send({ message: "targetType khong hop le" });
        }

        // Khong cho bao cao chinh mình
        if (targetType === 'app') {
            let app = await appModel.findOne({ _id: targetId, isDeleted: false });
            if (app && app.developerId.toString() === req.userId) {
                return res.status(400).send({ message: "Khong the bao cao app cua chinh minh" });
            }
        } else if (targetType === 'review') {
            let review = await reviewModel.findOne({ _id: targetId, isDeleted: false });
            if (review && review.userId.toString() === req.userId) {
                return res.status(400).send({ message: "Khong the bao cao review cua chinh minh" });
            }
        }

        let newReport = new reportModel({
            reporterId: req.userId,
            targetType,
            targetId,
            reason,
            status: "pending"
        });
        await newReport.save();
        await newReport.populate('reporterId', 'fullName email avatarUrl');
        res.status(201).send(newReport);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/reports/:id                    - Update report (ADMIN/MODERATOR)
// PUT /api/v1/reports/:id/status             - Update report status (ADMIN/MODERATOR)
// ============================================================

// Update report info (ADMIN / MODERATOR only)
router.put('/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let report = await reportModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!report) {
            return res.status(404).send({ message: "Report not found" });
        }

        let allowedFields = ['reason', 'status'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                report[field] = req.body[field];
            }
        });
        await report.save();
        await report.populate('reporterId', 'fullName email avatarUrl');
        res.send(report);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Update report status (ADMIN / MODERATOR only)
router.put('/:id/status', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let report = await reportModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!report) {
            return res.status(404).send({ message: "Report not found" });
        }

        let { status } = req.body;
        let validStatuses = ["pending", "reviewed", "resolved", "dismissed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).send({ message: "status khong hop le" });
        }

        report.status = status;
        await report.save();
        await report.populate('reporterId', 'fullName email avatarUrl');
        res.send({ message: "Cap nhat trang thai thanh cong", report });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/reports/:id     - Soft delete report (ADMIN/MODERATOR)
// ============================================================

router.delete('/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let report = await reportModel.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!report) {
            return res.status(404).send({ message: "Report not found" });
        }
        res.send({ message: "Report da duoc xoa", report });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
