var express = require('express');
var router = express.Router();
let productController = require('../controllers/products');
let mongoose = require('mongoose');

router.get('/',
    /* #swagger.tags = ['Products'] */
 async function (req, res, next) {
    try {
        let products = await productController.getAllProducts(req.query);
        res.send(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id',
    /* #swagger.tags = ['Products'] */
 async function (req, res, next) {
    try {
        let product = await productController.getProductById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "ID not found" });
        }
        res.send(product);
    } catch (error) {
        res.status(404).send({ message: "ID not found" });
    }
});

router.post('/',
    /* #swagger.tags = ['Products'] */
 async function (req, res, next) {
    let session = await mongoose.startSession();
    session.startTransaction();
    try {
        let newProduct = await productController.createProduct(req.body, session);
        await session.commitTransaction();
        session.endSession();
        res.status(201).send(newProduct);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id',
    /* #swagger.tags = ['Products'] */
 async function (req, res, next) {
    try {
        let product = await productController.updateProduct(req.params.id, req.body);
        if (!product) {
            return res.status(404).send({ message: "ID not found" });
        }
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete('/:id',
    /* #swagger.tags = ['Products'] */
 async function (req, res, next) {
    try {
        let product = await productController.deleteProduct(req.params.id);
        if (!product) {
            return res.status(404).send({ message: "ID not found" });
        }
        res.send(product);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
