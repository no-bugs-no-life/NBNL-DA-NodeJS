let notificationModel = require('../schemas/notifications');

// Lay role cua user
async function getUserRole(userId) {
    let userController = require('./users');
    let user = await userController.FindUserById(userId);
    if (!user) return null;
    return user.role ? user.role.name : null;
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
            isRead: false
        });
        await newNotification.save();
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
    }
};
