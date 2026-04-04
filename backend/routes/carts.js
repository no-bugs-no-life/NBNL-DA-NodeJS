var express = require('express');
var router = express.Router();
let { checkLogin } = require('../utils/authHandler.js');
let cartController = require('../controllers/carts');

router.get('/', checkLogin, async function (req, res, next) {
    try {
        let items = await cartController.getCart(req.userId);
        res.send(items);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/add-items', checkLogin, async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || !quantity) {
            return res.status(400).send({ message: "product va quantity la bat buoc" });
        }
        let cart = await cartController.addItem(req.userId, product, quantity);
        res.send(cart);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post('/decrease-items', checkLogin, async function (req, res) {
    try {
        let { product, quantity } = req.body;
        if (!product || !quantity) {
            return res.status(400).send({ message: "product va quantity la bat buoc" });
        }
        let cart = await cartController.decreaseItem(req.userId, product, quantity);
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        res.send(cart);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete('/', checkLogin, async function (req, res) {
    try {
        let cart = await cartController.clearCart(req.userId);
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        res.send({ message: "Cart da duoc xoa", cart });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
