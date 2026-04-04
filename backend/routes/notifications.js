var express = require('express');
var router = express.Router();
let notificationModel = require('../schemas/notifications');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/notifications                    - List notifications of current user
// GET /api/v1/notifications/unread             - Count unread notifications
// GET /api/v1/notifications/:id                - Get notification detail
// ============================================================

// List notifications of current user (login required)
router.get('/', checkLogin, async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 20;
        let page = queries.page ? parseInt(queries.page) : 1;
        let isRead = queries.isRead;

        let filter = { userId: req.userId, isDeleted: false };
        if (isRead !== undefined) {
            filter.isRead = isRead === 'true';
        }

        let notifications = await notificationModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(notifications);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Count unread notifications (login required)
router.get('/unread', checkLogin, async function (req, res, next) {
    try {
        let count = await notificationModel.countDocuments({
            userId: req.userId,
            isRead: false,
            isDeleted: false
        });
        res.send({ unreadCount: count });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get notification detail (owner only)
router.get('/:id', checkLogin, async function (req, res, next) {
    try {
        let notification = await notificationModel.findOne({
            _id: req.params.id,
            isDeleted: false
        });
        if (!notification) {
            return res.status(404).send({ message: "Notification not found" });
        }
        if (notification.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen xem thong bao nay" });
        }
        res.send(notification);
    } catch (error) {
        res.status(404).send({ message: "Notification not found" });
    }
});

// ============================================================
// POST /api/v1/notifications                          - Create notification (ADMIN/MODERATOR only)
// ============================================================

// Create notification (ADMIN / MODERATOR only)
router.post('/', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let newNotification = new notificationModel({
            userId: req.body.userId,
            type: req.body.type,
            message: req.body.message,
            isRead: false
        });
        await newNotification.save();
        res.status(201).send(newNotification);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/notifications/:id              - Update notification (owner only)
// PUT /api/v1/notifications/:id/read         - Mark as read (owner only)
// ============================================================

// Update notification (owner only)
router.put('/:id', checkLogin, async function (req, res, next) {
    try {
        let notification = await notificationModel.findOne({
            _id: req.params.id,
            isDeleted: false
        });
        if (!notification) {
            return res.status(404).send({ message: "Notification not found" });
        }
        if (notification.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen chinh sua thong bao nay" });
        }

        let allowedFields = ['message', 'isRead'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                notification[field] = req.body[field];
            }
        });
        await notification.save();
        res.send(notification);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Mark notification as read (owner only)
router.put('/:id/read', checkLogin, async function (req, res, next) {
    try {
        let notification = await notificationModel.findOne({
            _id: req.params.id,
            isDeleted: false
        });
        if (!notification) {
            return res.status(404).send({ message: "Notification not found" });
        }
        if (notification.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen danh dau thong bao nay" });
        }
        notification.isRead = true;
        await notification.save();
        res.send({ message: "Da danh dau da doc", notification });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/notifications/:id     - Soft delete notification (owner / ADMIN)
// ============================================================

router.delete('/:id', checkLogin, async function (req, res, next) {
    try {
        let notification = await notificationModel.findOne({
            _id: req.params.id,
            isDeleted: false
        });
        if (!notification) {
            return res.status(404).send({ message: "Notification not found" });
        }

        // Chi chu so huu hoac ADMIN moi duoc xoa
        if (notification.userId.toString() !== req.userId) {
            let userController = require('../controllers/users');
            let user = await userController.FindUserById(req.userId);
            let isAdmin = user && user.role && user.role.name === 'ADMIN';
            if (!isAdmin) {
                return res.status(403).send({ message: "Ban khong co quyen xoa thong bao nay" });
            }
        }

        notification.isDeleted = true;
        await notification.save();
        res.send({ message: "Notification da duoc xoa", notification });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
