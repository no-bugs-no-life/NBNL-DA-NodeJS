var express = require('express');
var router = express.Router();
let reviewModel = require('../schemas/reviews');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// GET /api/v1/reviews - List approved reviews (public), filter by appId
router.get('/', async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 20;
        let page = queries.page ? parseInt(queries.page) : 1;
        let appId = queries.appId;

        let filter = { status: "approved", isDeleted: false };
        if (appId) { filter.appId = appId; }

        let result = await reviewModel.find(filter)
            .populate('userId', 'fullName avatarUrl')
            .populate('appId', 'name')
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /api/v1/reviews/my - List user's own reviews (login required)
router.get('/my', checkLogin, async function (req, res, next) {
    try {
        let userId = req.userId;
        let reviews = await reviewModel.find({ userId, isDeleted: false })
            .populate('appId', 'name')
            .sort({ createdAt: -1 });
        res.send(reviews);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /api/v1/reviews/pending - List pending reviews (ADMIN/MODERATOR only)
router.get('/pending', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let reviews = await reviewModel.find({ status: "pending", isDeleted: false })
            .populate('userId', 'fullName email')
            .populate('appId', 'name')
            .sort({ createdAt: 1 });
        res.send(reviews);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /api/v1/reviews/:id - Get review detail (public if approved, own if pending)
router.get('/:id', async function (req, res, next) {
    try {
        let review = await reviewModel.findOne({ _id: req.params.id, isDeleted: false })
            .populate('userId', 'fullName avatarUrl')
            .populate('appId', 'name');
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        // If not approved, only owner or admin can see
        if (review.status !== "approved") {
            if (!req.userId || (req.userId !== review.userId.toString() && !['ADMIN', 'MODERATOR'].includes(req.role))) {
                return res.status(403).send({ message: "Access denied" });
            }
        }
        res.send(review);
    } catch (error) {
        res.status(404).send({ message: "Review not found" });
    }
});

// POST /api/v1/reviews - Create new review (login required)
router.post('/', checkLogin, async function (req, res, next) {
    try {
        let userId = req.userId;
        let { appId, rating, comment } = req.body;

        // Check if user already reviewed this app
        let existing = await reviewModel.findOne({ appId, userId, isDeleted: false });
        if (existing) {
            return res.status(400).send({ message: "You have already reviewed this app" });
        }

        let newReview = new reviewModel({
            appId,
            userId,
            rating,
            comment: comment || ""
        });
        await newReview.save();
        await newReview.populate('userId', 'fullName avatarUrl');
        await newReview.populate('appId', 'name');
        res.send(newReview);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT /api/v1/reviews/:id - Update own review (login required, owner only)
router.put('/:id', checkLogin, async function (req, res, next) {
    try {
        let review = await reviewModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        if (review.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "You can only update your own reviews" });
        }
        if (review.status !== "pending") {
            return res.status(400).send({ message: "Cannot update approved/rejected reviews" });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment !== undefined ? req.body.comment : review.comment;
        await review.save();
        await review.populate('userId', 'fullName avatarUrl');
        await review.populate('appId', 'name');
        res.send(review);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE /api/v1/reviews/:id - Soft delete own review (login required, owner only)
router.delete('/:id', checkLogin, async function (req, res, next) {
    try {
        let review = await reviewModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        if (review.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "You can only delete your own reviews" });
        }
        review.isDeleted = true;
        await review.save();
        res.send({ message: "Review deleted" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /api/v1/reviews/:id/approve - Approve review (ADMIN/MODERATOR only)
router.post('/:id/approve', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let review = await reviewModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        review.status = "approved";
        await review.save();
        res.send({ message: "Review approved", review });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /api/v1/reviews/:id/reject - Reject review (ADMIN/MODERATOR only)
router.post('/:id/reject', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let review = await reviewModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!review) {
            return res.status(404).send({ message: "Review not found" });
        }
        review.status = "rejected";
        await review.save();
        res.send({ message: "Review rejected", review });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;