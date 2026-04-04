var express = require('express');
var router = express.Router();
let notificationController = require('../controllers/notifications');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/notifications                    - List notifications
// GET /api/v1/notifications/unread             - Count unread
// GET /api/v1/notifications/:id                - Get detail
// ============================================================

router.get('/', checkLogin, async function (req, res, next) {
    try {
        let notifications = await notificationController.getNotifications(req.userId, req.query);
        res.send(notifications);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/unread', checkLogin, async function (req, res, next) {
    try {
        let count = await notificationController.getUnreadCount(req.userId);
        res.send({ unreadCount: count });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', checkLogin, async function (req, res, next) {
    try {
        let result = await notificationController.getNotificationById(req.params.id, req.userId);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "Notification not found" });
    }
});

// ============================================================
// POST /api/v1/notifications                          - Create notification (ADMIN/MOD)
// ============================================================

router.post('/', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let { userId, type, message } = req.body;
        if (!userId || !type || !message) {
            return res.status(400).send({ message: "userId, type va message la bat buoc" });
        }
        let notification = await notificationController.createNotification({ userId, type, message });
        res.status(201).send(notification);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/notifications/:id              - Update notification (owner only)
// PUT /api/v1/notifications/:id/read         - Mark as read (owner only)
// ============================================================

router.put('/:id', checkLogin, async function (req, res, next) {
    try {
        let result = await notificationController.updateNotification(req.params.id, req.userId, req.body);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id/read', checkLogin, async function (req, res, next) {
    try {
        let result = await notificationController.markAsRead(req.params.id, req.userId);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send({ message: "Da danh dau da doc", notification: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/notifications/:id     - Soft delete (owner / ADMIN)
// ============================================================

router.delete('/:id', checkLogin, async function (req, res, next) {
    try {
        let result = await notificationController.deleteNotification(req.params.id, req.userId);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send({ message: "Notification da duoc xoa", notification: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
