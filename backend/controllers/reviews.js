let reviewModel = require('../schemas/reviews');

module.exports = {
    getAllReviews: async function (queries) {
        let { limit = 20, page = 1, appId } = queries;
        let filter = { status: "approved", isDeleted: false };
        if (appId) filter.appId = appId;

        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: [
                { path: 'userId', select: 'fullName avatarUrl' },
                { path: 'appId', select: 'name' }
            ]
        };
        return await reviewModel.paginate(filter, options);
    },

    getReviewById: async function (id) {
        return await reviewModel.findOne({ _id: id, isDeleted: false })
            .populate('userId', 'fullName avatarUrl')
            .populate('appId', 'name');
    },

    getMyReviews: async function (userId, queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: -1 },
            populate: { path: 'appId', select: 'name' }
        };
        return await reviewModel.paginate({ userId, isDeleted: false }, options);
    },

    getPendingReviews: async function (queries = {}) {
        let { page = 1, limit = 20 } = queries;
        let options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 20,
            sort: { createdAt: 1 },
            populate: [
                { path: 'userId', select: 'fullName email' },
                { path: 'appId', select: 'name' }
            ]
        };
        return await reviewModel.paginate({ status: "pending", isDeleted: false }, options);
    },

    createReview: async function (data) {
        let { appId, userId, rating, comment } = data;

        let existing = await reviewModel.findOne({ appId, userId, isDeleted: false });
        if (existing) return { error: "You have already reviewed this app" };

        let newReview = new reviewModel({
            appId,
            userId,
            rating,
            comment: comment || ""
        });
        await newReview.save();
        await newReview.populate('userId', 'fullName avatarUrl');
        await newReview.populate('appId', 'name');
        return newReview;
    },

    createReviewAdmin: async function (data) {
        let { appId, userId, rating, comment, status } = data;

        let existing = await reviewModel.findOne({ appId, userId, isDeleted: false });
        if (existing) return { error: "User has already reviewed this app" };

        let newReview = new reviewModel({
            appId,
            userId,
            rating,
            comment: comment || "",
            status: status || "approved" // admin-created reviews auto-approved
        });
        await newReview.save();
        await newReview.populate('userId', 'fullName avatarUrl');
        await newReview.populate('appId', 'name');
        return newReview;
    },

    updateReview: async function (id, userId, data) {
        let review = await reviewModel.findOne({ _id: id, isDeleted: false });
        if (!review) return { error: "Review not found" };
        if (review.userId.toString() !== userId) return { error: "You can only update your own reviews", code: 403 };
        if (review.status !== "pending") return { error: "Cannot update approved/rejected reviews", code: 400 };

        if (data.rating !== undefined) review.rating = data.rating;
        if (data.comment !== undefined) review.comment = data.comment;
        await review.save();
        await review.populate('userId', 'fullName avatarUrl');
        await review.populate('appId', 'name');
        return review;
    },

    deleteReview: async function (id, userId) {
        let review = await reviewModel.findOne({ _id: id, isDeleted: false });
        if (!review) return { error: "Review not found" };
        if (review.userId.toString() !== userId) return { error: "You can only delete your own reviews", code: 403 };
        review.isDeleted = true;
        await review.save();
        return { message: "Review deleted" };
    },

    approveReview: async function (id) {
        let review = await reviewModel.findOne({ _id: id, isDeleted: false });
        if (!review) return { error: "Review not found" };
        review.status = "approved";
        await review.save();
        return review;
    },

    rejectReview: async function (id) {
        let review = await reviewModel.findOne({ _id: id, isDeleted: false });
        if (!review) return { error: "Review not found" };
        review.status = "rejected";
        await review.save();
        return review;
    },

    resetReview: async function (id) {
        let review = await reviewModel.findOne({ _id: id, isDeleted: false });
        if (!review) return { error: "Review not found" };
        review.status = "pending";
        await review.save();
        return review;
    }
};
