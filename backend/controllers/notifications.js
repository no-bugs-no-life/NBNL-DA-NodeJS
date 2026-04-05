let notificationModel = require('../schemas/notifications');

// Lay user by ID
async function getUserById(userId) {
    let userController = require('./users');
    return await userController.FindUserById(userId);
}

// Lay role cua user
async function getUserRole(userId) {
    let user = await getUserById(userId);
    if (!user) return null;
    return user.role ? user.role.name : null;
}

// Gui email khi channel = email
async function dispatchByChannel(notification) {
    await notification.populate('userId', 'fullName email avatarUrl');
    const user = notification.userId;

    if (notification.channel === 'email' && user.email) {
        try {
            let emailService = require('../services/emailService');
            await emailService.sendNotificationEmail({
                toEmail: user.email,
                userName: user.fullName || user.username,
                type: notification.type,
                message: notification.message,
            });
            notification.sentAt = new Date();
            await notification.save();
        } catch (err) {
            console.error('[Notification] Email send error:', err.message);
        }
    }
    // firebase: cho sap ra mat (placeholder)
    if (notification.channel === 'firebase') {
        console.log(`[Notification] Firebase push placeholder for user ${user._id}: ${notification.message}`);
    }
}

module.exports = {
    // GET - List notifications of user
    getNotifications: async function (userId, queries) {
        let { limit = 20, page = 1, isRead } = queries;
        let filter = { userId, isDeleted: false };
        if (isRead !== undefined) filter.isRead = isRead === 'true';

        return await notificationModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(parseInt(limit) * (parseInt(page) - 1))
            .limit(parseInt(limit));
    },

    // GET - List ALL notifications (ADMIN) with pagination
    getAllNotificationsAdmin: async function (queries) {
        let { limit = 20, page = 1, type, isRead } = queries;
        let filter = { isDeleted: false };
        if (type) filter.type = type;
        if (isRead !== undefined) filter.isRead = isRead === 'true';

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: { path: 'userId', select: 'fullName email avatarUrl' }
        };
        return await notificationModel.paginate(filter, options);
    },

    // GET - Count unread notifications
    getUnreadCount: async function (userId) {
        return await notificationModel.countDocuments({
            userId,
            isRead: false,
            isDeleted: false
        });
    },

    // GET - Notification detail
    getNotificationById: async function (id, userId) {
        let notification = await notificationModel.findOne({ _id: id, isDeleted: false });
        if (!notification) return { error: "Notification not found", code: 404 };
        if (notification.userId.toString() !== userId) {
            return { error: "Ban khong co quyen xem thong bao nay", code: 403 };
        }
        return notification;
    },

    // POST - Create notification
    createNotification: async function (data) {
        let newNotification = new notificationModel({
            userId: data.userId,
            type: data.type,
            message: data.message,
            channel: data.channel || 'inapp',
            isRead: false
        });
        await newNotification.save();
        // Gui thong bao theo kenh
        await dispatchByChannel(newNotification);
        return newNotification;
    },

    // PUT - Update notification
    updateNotification: async function (id, userId, data) {
        let notification = await notificationModel.findOne({ _id: id, isDeleted: false });
        if (!notification) return { error: "Notification not found", code: 404 };
        if (notification.userId.toString() !== userId) {
            return { error: "Ban khong co quyen chinh sua thong bao nay", code: 403 };
        }

        let allowedFields = ['message', 'isRead'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) notification[field] = data[field];
        });
        await notification.save();
        return notification;
    },

    // PUT - Mark as read
    markAsRead: async function (id, userId) {
        let notification = await notificationModel.findOne({ _id: id, isDeleted: false });
        if (!notification) return { error: "Notification not found", code: 404 };
        if (notification.userId.toString() !== userId) {
            return { error: "Ban khong co quyen danh dau thong bao nay", code: 403 };
        }
        notification.isRead = true;
        await notification.save();
        return notification;
    },

    // DELETE - Soft delete notification
    deleteNotification: async function (id, userId) {
        let notification = await notificationModel.findOne({ _id: id, isDeleted: false });
        if (!notification) return { error: "Notification not found", code: 404 };

        let isAdmin = (await getUserRole(userId)) === 'ADMIN';
        if (notification.userId.toString() !== userId && !isAdmin) {
            return { error: "Ban khong co quyen xoa thong bao nay", code: 403 };
        }

        notification.isDeleted = true;
        await notification.save();
        return notification;
    },

    // PATCH - Update notification (ADMIN)
    updateNotificationAdmin: async function (id, data) {
        let notification = await notificationModel.findOne({ _id: id, isDeleted: false });
        if (!notification) return { error: "Notification not found", code: 404 };

        let allowedFields = ['message', 'isRead', 'type', 'channel'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) notification[field] = data[field];
        });
        await notification.save();
        // Gui email neu kenh doi thanh email
        await dispatchByChannel(notification);
        await notification.populate('userId', 'fullName email avatarUrl');
        return notification;
    },

    // DELETE - Soft delete notification (ADMIN)
    deleteNotificationAdmin: async function (id) {
        let notification = await notificationModel.findOne({ _id: id, isDeleted: false });
        if (!notification) return { error: "Notification not found", code: 404 };

        notification.isDeleted = true;
        await notification.save();
        return notification;
    }
};
