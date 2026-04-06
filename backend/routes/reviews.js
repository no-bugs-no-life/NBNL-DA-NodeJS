var express = require('express');
var router = express.Router();
let reviewModel = require('../schemas/reviews');
let reviewController = require('../controllers/reviews');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// GET /api/v1/reviews - List approved reviews (public)
router.get('/',
    /* #swagger.tags = ['Reviews'] */
    async function (req, res, next) {
        try {
            let reviews = await reviewController.getAllReviews(req.query);
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// GET /api/v1/reviews/my - List user's own reviews
router.get('/my',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, async function (req, res, next) {
        try {
            let reviews = await reviewController.getMyReviews(req.userId, req.query);
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// GET /api/v1/reviews/pending - List pending reviews
router.get('/pending',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let reviews = await reviewController.getPendingReviews(req.query);
            res.send(reviews);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// GET /api/v1/reviews/:id - Get review detail
router.get('/:id',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, async function (req, res, next) {
        try {
            let review = await reviewController.getReviewById(req.params.id);
            if (!review) {
                return res.status(404).send({ message: "Review not found" });
            }
            // Non-approved review: only owner or admin/moderator can see
            if (review.status !== "approved") {
                let userController = require('../controllers/users');
                let user = await userController.FindUserById(req.userId);
                let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);
                if (review.userId._id.toString() !== req.userId && !isAdminOrMod) {
                    return res.status(403).send({ message: "Access denied" });
                }
            }
            res.send(review);
        } catch (error) {
            res.status(404).send({ message: "Review not found" });
        }
    });

// POST /api/v1/reviews - Create new review (user)
router.post('/',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, async function (req, res, next) {
        try {
            let { appId, rating, comment } = req.body;
            let result = await reviewController.createReview({
                appId, userId: req.userId, rating, comment
            });
            if (result.error) {
                return res.status(400).send({ message: result.error });
            }
            res.status(201).send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// POST /api/v1/reviews/admin - Create review on behalf of a user (ADMIN/MODERATOR)
router.post('/admin',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let { appId, userId, rating, comment, status } = req.body;
            if (!appId || !userId || !rating) {
                return res.status(400).send({ message: "appId, userId, and rating are required" });
            }
            let result = await reviewController.createReviewAdmin({
                appId, userId, rating, comment, status
            });
            if (result.error) {
                return res.status(400).send({ message: result.error });
            }
            res.status(201).send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// PUT /api/v1/reviews/admin/:id - Update any review (ADMIN/MODERATOR)
router.put('/admin/:id',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await reviewController.updateReviewAdmin(req.params.id, req.body);
            if (result && result.error) {
                let code = result.code || 400;
                return res.status(code).send({ message: result.error });
            }
            if (!result) {
                return res.status(404).send({ message: "Review not found" });
            }
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// PUT /api/v1/reviews/:id - Update own review
router.put('/:id',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await reviewController.updateReview(req.params.id, req.userId, req.body);
            if (result && result.error) {
                let code = result.code || 400;
                return res.status(code).send({ message: result.error });
            }
            if (!result) {
                return res.status(404).send({ message: "Review not found" });
            }
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// DELETE /api/v1/reviews/:id - Soft delete own review
router.delete('/:id',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await reviewController.deleteReview(req.params.id, req.userId);
            if (result && result.error) {
                let code = result.code || 400;
                return res.status(code).send({ message: result.error });
            }
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// POST /api/v1/reviews/:id/approve - Approve review
router.post('/:id/approve',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let review = await reviewController.approveReview(req.params.id);
            if (review && review.error) {
                return res.status(404).send({ message: review.error });
            }
            res.send({ message: "Review approved", review });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// POST /api/v1/reviews/:id/reject - Reject review
router.post('/:id/reject',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let review = await reviewController.rejectReview(req.params.id);
            if (review && review.error) {
                return res.status(404).send({ message: review.error });
            }
            res.send({ message: "Review rejected", review });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// POST /api/v1/reviews/:id/reset - Reset review back to pending
router.post('/:id/reset',
    /* #swagger.tags = ['Reviews'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let review = await reviewController.resetReview(req.params.id);
            if (review && review.error) {
                return res.status(404).send({ message: review.error });
            }
            res.send({ message: "Review reset to pending", review });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

module.exports = router;
