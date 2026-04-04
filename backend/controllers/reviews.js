let reviewModel = require('../schemas/reviews');

module.exports = {
    getAllReviews: async function (queries) {
        let { limit = 20, page = 1, appId } = queries;
        let filter = { status: "approved", isDeleted: false };
        if (appId) filter.appId = appId;

        return await reviewModel.find(filter)
            .populate('userId', 'fullName avatarUrl')
            .populate('appId', 'name')
            .sort({ createdAt: -1 })
            .skip(parseInt(limit) * (parseInt(page) - 1))
            .limit(parseInt(limit));
    },

    getReviewById: async function (id) {
        return await reviewModel.findOne({ _id: id, isDeleted: false })
            .populate('userId', 'fullName avatarUrl')
            .populate('appId', 'name');
    },

    getMyReviews: async function (userId) {
        return await reviewModel.find({ userId, isDeleted: false })
            .populate('appId', 'name')
            .sort({ createdAt: -1 });
    },

    getPendingReviews: async function () {
        return await reviewModel.find({ status: "pending", isDeleted: false })
            .populate('userId', 'fullName email')
            .populate('appId', 'name')
            .sort({ createdAt: 1 });
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
    }
};
