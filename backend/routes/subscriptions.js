var express = require('express');
var router = express.Router();
let subscriptionController = require('../controllers/subscriptions');
let userController = require('../controllers/users');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/subscriptions                  - List all subscriptions (ADMIN/MOD)
// GET /api/v1/subscriptions/my               - My subscriptions (login)
// GET /api/v1/subscriptions/my/:appId      - My subscription for specific app
// GET /api/v1/subscriptions/:id              - Get subscription detail
// ============================================================

// List all subscriptions (ADMIN / MODERATOR only)
router.get('/',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let subscriptions = await subscriptionController.getAllSubscriptions(req.query);
            res.send(subscriptions);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// My subscriptions (login required)
router.get('/my',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, async function (req, res, next) {
        try {
            let subscriptions = await subscriptionController.getMySubscriptions(req.userId, req.query);
            res.send(subscriptions);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// My subscription for specific app (login required)
router.get('/my/:appId',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, async function (req, res, next) {
        try {
            let subscription = await subscriptionController.getSubscriptionByApp(req.userId, req.params.appId);
            if (!subscription) {
                return res.status(404).send({ message: "Subscription not found for this app" });
            }
            res.send(subscription);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// Get subscription detail (ADMIN/MOD or owner)
router.get('/:id',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, async function (req, res, next) {
        try {
            let subscription = await subscriptionController.getSubscriptionById(req.params.id);
            if (!subscription) {
                return res.status(404).send({ message: "Subscription not found" });
            }

            let user = await userController.FindUserById(req.userId);
            let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);
            if (subscription.userId._id.toString() !== req.userId && !isAdminOrMod) {
                return res.status(403).send({ message: "Ban khong co quyen xem subscription nay" });
            }

            res.send(subscription);
        } catch (error) {
            res.status(404).send({ message: "Subscription not found" });
        }
    });

// ============================================================
// POST /api/v1/subscriptions                        - Create subscription (ADMIN/MOD)
// ============================================================

router.post('/',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let { userId, appId, packageId } = req.body;
            if (!userId || !appId || !packageId) {
                return res.status(400).send({ message: "userId, appId va packageId la bat buoc" });
            }
            let result = await subscriptionController.createSubscription({ userId, appId, packageId });
            if (result && result.error) {
                return res.status(result.code || 400).send({ message: result.error });
            }
            res.status(201).send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// ============================================================
// PUT /api/v1/subscriptions/:id/renew    - Renew subscription (ADMIN/MOD)
// PUT /api/v1/subscriptions/:id/cancel   - Cancel subscription (owner or ADMIN)
// ============================================================

router.put('/:id/renew',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let { packageId } = req.body;
            if (!packageId) {
                return res.status(400).send({ message: "packageId la bat buoc" });
            }
            let result = await subscriptionController.renewSubscription(req.params.id, packageId);
            if (result && result.error) {
                return res.status(result.code || 400).send({ message: result.error });
            }
            res.send({ message: "Gia han thanh cong", subscription: result });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.put('/:id/cancel',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, async function (req, res, next) {
        try {
            let user = await userController.FindUserById(req.userId);
            let isAdmin = user && user.role && user.role.name === 'ADMIN';
            let result = await subscriptionController.cancelSubscription(req.params.id, req.userId, isAdmin);
            if (result && result.error) {
                return res.status(result.code || 400).send({ message: result.error });
            }
            res.send({ message: "Huy subscription thanh cong", subscription: result });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// ============================================================
// DELETE /api/v1/subscriptions/:id       - Soft delete (ADMIN/MOD only)
// ============================================================

router.delete('/:id',
    /* #swagger.tags = ['Subscriptions'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await subscriptionController.deleteSubscription(req.params.id);
            if (result && result.error) {
                return res.status(result.code || 400).send({ message: result.error });
            }
            res.send({ message: "Subscription da duoc xoa", subscription: result });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

module.exports = router;
