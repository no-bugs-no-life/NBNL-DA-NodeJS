var express = require('express');
var router = express.Router();
let { checkLogin, checkRole } = require('../utils/authHandler.js');
let cartController = require('../controllers/carts');

// ============================================================
// GET /api/v1/carts                    - Get current user's cart
// ============================================================
router.get('/',
    /* #swagger.tags = ['Carts'] */
 checkLogin, async function (req, res) {
    try {
        let cart = await cartController.getCart(req.userId);
        if (!cart) {
            return res.send({ user: req.userId, items: [], totalPrice: 0 });
        }
        res.send(cart);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// POST /api/v1/carts/items                      - Add app to cart
// ============================================================
router.post('/items',
    /* #swagger.tags = ['Carts'] */
 checkLogin, async function (req, res) {
    try {
        let { appId, itemType, plan, quantity } = req.body;
        if (!appId) {
            return res.status(400).send({ message: "appId la bat buoc" });
        }
        let result = await cartController.addItem(req.userId, { appId, itemType, plan, quantity });
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/carts/items/:appId          - Update item in cart
// ============================================================
router.put('/items/:appId',
    /* #swagger.tags = ['Carts'] */
 checkLogin, async function (req, res) {
    try {
        let { quantity, plan } = req.body;
        let result = await cartController.updateItem(req.userId, req.params.appId, { quantity, plan });
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/carts/items/:appId    - Remove item from cart
// ============================================================
router.delete('/items/:appId',
    /* #swagger.tags = ['Carts'] */
 checkLogin, async function (req, res) {
    try {
        let result = await cartController.removeItem(req.userId, req.params.appId);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send({ message: "Da xoa khoi gio hang", cart: result });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// POST /api/v1/carts/admin/:userId/items  - Add item to a user's cart (ADMIN)
// GET  /api/v1/carts/all          - List all carts (ADMIN)
// DELETE /api/v1/carts/:id        - Soft delete cart (ADMIN)
// DELETE /api/v1/carts             - Clear entire cart
// ============================================================
router.post('/admin/:userId/items',
    /* #swagger.tags = ['Carts'] */
 checkLogin, checkRole('ADMIN'), async function (req, res) {
    try {
        let { appId, itemType, plan, quantity } = req.body;
        if (!appId) return res.status(400).send({ message: "appId la bat buoc" });
        let result = await cartController.addItem(req.params.userId, { appId, itemType, plan, quantity });
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.get('/all',
    /* #swagger.tags = ['Carts'] */
 checkLogin, checkRole('ADMIN'), async function (req, res) {
    try {
        let carts = await cartController.getAllCarts(req.query);
        res.send(carts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.delete('/:id',
    /* #swagger.tags = ['Carts'] */
 checkLogin, checkRole('ADMIN'), async function (req, res) {
    try {
        let result = await cartController.deleteCart(req.params.id);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send({ message: "Cart da duoc xoa", cart: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.delete('/',
    /* #swagger.tags = ['Carts'] */
 checkLogin, async function (req, res) {
    try {
        let cart = await cartController.clearCart(req.userId);
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        res.send({ message: "Gio hang da duoc xoa", cart });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
