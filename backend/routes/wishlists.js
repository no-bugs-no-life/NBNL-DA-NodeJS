var express = require('express');
var router = express.Router();
let wishlistController = require('../controllers/wishlists');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/wishlists                - Get current user's wishlist
// GET /api/v1/wishlists/all            - List all wishlists (ADMIN/MOD)
// ============================================================

// Get current user's wishlist (login required)
router.get('/',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, async function (req, res, next) {
    try {
        let wishlist = await wishlistController.getMyWishlist(req.userId);
        if (!wishlist) {
            return res.send({ userId: req.userId, appIds: [] });
        }
        res.send(wishlist);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// List all wishlists (ADMIN / MODERATOR only)
router.get('/all',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let wishlists = await wishlistController.getAllWishlists(req.query);
        res.send(wishlists);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /api/v1/wishlists/admin     - Create wishlist for any user (ADMIN)
// ============================================================

router.post('/admin',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, checkRole('ADMIN'), async function (req, res, next) {
    try {
        let { userId, appIds } = req.body;
        if (!userId) {
            return res.status(400).send({ message: "userId la bat buoc" });
        }
        let result = await wishlistController.createWishlistAdmin(userId, appIds || []);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.status(201).send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// POST /api/v1/wishlists          - Add app to wishlist
// ============================================================

router.post('/',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, async function (req, res, next) {
    try {
        let { appId } = req.body;
        if (!appId) {
            return res.status(400).send({ message: "appId la bat buoc" });
        }
        let result = await wishlistController.addApp(req.userId, appId);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/wishlists/:id           - Soft delete wishlist (ADMIN)
// DELETE /api/v1/wishlists/:appId       - Remove app from wishlist
// DELETE /api/v1/wishlists              - Clear wishlist
// ============================================================

router.delete('/:id',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, checkRole('ADMIN'), async function (req, res, next) {
    try {
        let result = await wishlistController.deleteWishlist(req.params.id);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send({ message: "Wishlist da duoc xoa", wishlist: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.delete('/:appId',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, async function (req, res, next) {
    try {
        let result = await wishlistController.removeApp(req.userId, req.params.appId);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send({ message: "Da xoa khoi wishlist", wishlist: result });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete('/',
    /* #swagger.tags = ['Wishlists'] */
 checkLogin, async function (req, res, next) {
    try {
        let wishlist = await wishlistController.clearWishlist(req.userId);
        res.send({ message: "Wishlist da duoc xoa", wishlist });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
