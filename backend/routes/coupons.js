var express = require('express');
var router = express.Router();
let couponController = require('../controllers/coupons');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/coupons                        - List all coupons (ADMIN/MOD)
// GET /api/v1/coupons/validate              - Validate coupon (login)
// GET /api/v1/coupons/:id                    - Get coupon detail
// ============================================================

// List all coupons (ADMIN / MODERATOR only)
router.get('/',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let coupons = await couponController.getAllCoupons(req.query);
        res.send(coupons);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Validate coupon (any logged-in user)
router.get('/validate',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, async function (req, res, next) {
    try {
        let { code, appId, cartTotal } = req.query;
        if (!code) {
            return res.status(400).send({ message: "code la bat buoc" });
        }
        let result = await couponController.applyCoupon(
            code,
            req.userId,
            appId || null,
            parseFloat(cartTotal) || 0
        );
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Get coupon by ID (ADMIN / MODERATOR only)
router.get('/:id',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let coupon = await couponController.getCouponById(req.params.id);
        if (!coupon) {
            return res.status(404).send({ message: "Coupon not found" });
        }
        res.send(coupon);
    } catch (error) {
        res.status(404).send({ message: "Coupon not found" });
    }
});

// ============================================================
// POST /api/v1/coupons                        - Create coupon (ADMIN/MOD)
// POST /api/v1/coupons/apply                  - Apply coupon to cart (login)
// ============================================================

// Create coupon (ADMIN / MODERATOR only)
router.post('/',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let result = await couponController.createCoupon(req.body);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Apply coupon (login required)
router.post('/apply',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, async function (req, res, next) {
    try {
        let { code, appId, cartTotal } = req.body;
        if (!code) {
            return res.status(400).send({ message: "code la bat buoc" });
        }
        let result = await couponController.applyCoupon(
            code,
            req.userId,
            appId || null,
            parseFloat(cartTotal) || 0
        );
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/coupons/:id         - Update coupon (ADMIN/MOD only)
// ============================================================

router.put('/:id',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let result = await couponController.updateCoupon(req.params.id, req.body);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/coupons/:id        - Soft delete coupon (ADMIN/MOD only)
// ============================================================

router.delete('/:id',
    /* #swagger.tags = ['Coupons'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let result = await couponController.deleteCoupon(req.params.id);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send({ message: "Coupon da duoc xoa", coupon: result });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
