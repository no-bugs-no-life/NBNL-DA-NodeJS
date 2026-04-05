let reportModel = require('../schemas/reports');
let appModel = require('../schemas/apps');
let reviewModel = require('../schemas/reviews');

// Lay role cua user
async function getUserRole(userId) {
    let userController = require('./users');
    let user = await userController.FindUserById(userId);
    if (!user) return null;
    return user.role ? user.role.name : null;
}

module.exports = {
    // GET - List all reports
    getAllReports: async function (queries) {
        let { limit = 20, page = 1, status, targetType } = queries;
        let filter = { isDeleted: false };
        if (status) filter.status = status;
        if (targetType) filter.targetType = targetType;

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: 'reporterId', select: 'fullName email avatarUrl' },
                {
                    path: 'targetId',
                    select: 'name appId rating comment',
                    populate: { path: 'appId', select: 'name iconUrl slug' }
                }
            ]
        };
        return await reportModel.paginate(filter, options);
    },

    // GET - Reports by current user
    getMyReports: async function (userId, queries = {}) {
        let { limit = 20, page = 1 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 }
        };
        return await reportModel.paginate({ reporterId: userId, isDeleted: false }, options);
    },

    // GET - Pending reports
    getPendingReports: async function (queries = {}) {
        let { limit = 20, page = 1 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: 1 },
            populate: { path: 'reporterId', select: 'fullName email avatarUrl' }
        };
        return await reportModel.paginate({ status: "pending", isDeleted: false }, options);
    },

    // GET - Report detail
    getReportById: async function (id, userId) {
        let report = await reportModel.findOne({ _id: id, isDeleted: false })
            .populate('reporterId', 'fullName email avatarUrl');
        if (!report) return { error: "Report not found", code: 404 };

        let role = await getUserRole(userId);
        let isAdminOrMod = role && ['ADMIN', 'MODERATOR'].includes(role);
        if (report.reporterId._id.toString() !== userId && !isAdminOrMod) {
            return { error: "Ban khong co quyen xem report nay", code: 403 };
        }
        return report;
    },

    // POST - Create report
    createReport: async function (userId, data) {
        let { targetType, targetId, reason } = data;
        if (!targetType || !targetId || !reason) {
            return { error: "targetType, targetId va reason la bat buoc", code: 400 };
        }

        // Kiem tra target ton tai
        if (targetType === 'app') {
            let app = await appModel.findOne({ _id: targetId, isDeleted: false });
            if (!app) return { error: "App khong ton tai", code: 404 };
            if (app.developerId.toString() === userId) return { error: "Khong the bao cao app cua chinh minh", code: 400 };
        } else if (targetType === 'review') {
            let review = await reviewModel.findOne({ _id: targetId, isDeleted: false });
            if (!review) return { error: "Review khong ton tai", code: 404 };
            if (review.userId.toString() === userId) return { error: "Khong the bao cao review cua chinh minh", code: 400 };
        } else {
            return { error: "targetType khong hop le", code: 400 };
        }

        let newReport = new reportModel({
            reporterId: userId,
            targetType,
            targetId,
            reason,
            status: "pending"
        });
        await newReport.save();
        await newReport.populate('reporterId', 'fullName email avatarUrl');
        return newReport;
    },

    // PUT - Update report
    updateReport: async function (id, data) {
        let report = await reportModel.findOne({ _id: id, isDeleted: false });
        if (!report) return { error: "Report not found", code: 404 };

        let allowedFields = ['reason', 'status', 'adminNote'];
        allowedFields.forEach(field => {
            if (data[field] !== undefined) report[field] = data[field];
        });
        report.updatedFieldsAt = new Date();
        await report.save();
        await report.populate('reporterId', 'fullName email avatarUrl');
        return report;
    },

    // PUT - Update report status
    updateReportStatus: async function (id, status, adminNote = "") {
        let report = await reportModel.findOne({ _id: id, isDeleted: false });
        if (!report) return { error: "Report not found", code: 404 };

        let validStatuses = ["pending", "reviewed", "resolved", "dismissed"];
        if (!validStatuses.includes(status)) {
            return { error: "status khong hop le", code: 400 };
        }

        report.status = status;
        if (adminNote) report.adminNote = adminNote;
        report.updatedFieldsAt = new Date();
        await report.save();
        await report.populate('reporterId', 'fullName email avatarUrl');
        return report;
    },

    // DELETE - Soft delete report
    deleteReport: async function (id) {
        let report = await reportModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!report) return { error: "Report not found", code: 404 };
        return report;
    }
};
