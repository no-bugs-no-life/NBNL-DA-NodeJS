var express = require('express');
var router = express.Router();
let subPackageController = require('../controllers/subPackages');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/sub-packages              - List all packages (ADMIN/MOD)
// GET /api/v1/sub-packages/:id         - Get package by id
// POST /api/v1/sub-packages              - Create package (ADMIN/MOD)
// PUT /api/v1/sub-packages/:id          - Update package (ADMIN/MOD)
// DELETE /api/v1/sub-packages/:id       - Delete package (ADMIN/MOD)
// ============================================================

// List all packages (ADMIN / MODERATOR only)
router.get('/',
    /* #swagger.tags = ['SubPackages'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let packages = await subPackageController.getAllPackages(req.query);
            res.send(packages);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// Get package by id
router.get('/:id',
    /* #swagger.tags = ['SubPackages'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let pkg = await subPackageController.getPackageById(req.params.id);
            if (!pkg) {
                return res.status(404).send({ message: "Package not found" });
            }
            res.send(pkg);
        } catch (error) {
            res.status(404).send({ message: "Package not found" });
        }
    });

// Create package
router.post('/',
    /* #swagger.tags = ['SubPackages'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let { name, type, price, durationDays, description, appId } = req.body;
            if (!name || price === undefined || !appId) {
                return res.status(400).send({ message: "name, price và appId là bắt buộc" });
            }
            let newPkg = await subPackageController.createPackage({ name, type, price, durationDays, description, appId });
            res.status(201).send(newPkg);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// Update package
router.put('/:id',
    /* #swagger.tags = ['SubPackages'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await subPackageController.updatePackage(req.params.id, req.body);
            if (result && result.error) {
                return res.status(result.code || 400).send({ message: result.error });
            }
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// Delete package (soft delete)
router.delete('/:id',
    /* #swagger.tags = ['SubPackages'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await subPackageController.deletePackage(req.params.id);
            if (result && result.error) {
                return res.status(result.code || 400).send({ message: result.error });
            }
            res.send({ message: "Package da duoc xoa" });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

module.exports = router;
