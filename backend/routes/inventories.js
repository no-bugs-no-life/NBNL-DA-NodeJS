var express = require('express');
var router = express.Router();
let inventoryController = require('../controllers/inventories');

router.get('/',
    /* #swagger.tags = ['Inventories'] */
 async function (req, res, next) {
    try {
        let inventories = await inventoryController.getAllInventories();
        res.send(inventories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/increase-stock',
    /* #swagger.tags = ['Inventories'] */
 async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || quantity === undefined) {
            return res.status(400).send({ message: "product va quantity la bat buoc" });
        }
        let inventory = await inventoryController.increaseStock(product, quantity);
        if (!inventory) {
            return res.status(404).send({ message: "Product not found" });
        }
        res.send(inventory);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/decrease-stock',
    /* #swagger.tags = ['Inventories'] */
 async function (req, res, next) {
    try {
        let { product, quantity } = req.body;
        if (!product || quantity === undefined) {
            return res.status(400).send({ message: "product va quantity la bat buoc" });
        }
        let inventory = await inventoryController.decreaseStock(product, quantity);
        if (!inventory) {
            return res.status(404).send({ message: "Product not found" });
        }
        if (inventory.error) {
            return res.status(400).send({ message: inventory.error });
        }
        res.send(inventory);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
