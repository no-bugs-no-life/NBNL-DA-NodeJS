var express = require('express');
var router = express.Router();
let developerController = require('../controllers/developers');
let { checkLogin, checkRole } = require('../utils/authHandler.js.js');
let { uploadImage } = require('../utils/uploadHandler');

// ============================================================
// PUBLIC
// GET /api/v1/developers              - List all developers
// GET /api/v1/developers/:id          - Developer detail
// ============================================================

router.get('/',
    /* #swagger.tags = ['Developers'] */
    async function (req, res, next) {
        try {
            let developers = await developerController.getAllDevelopers(req.query);
            res.send(developers);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get('/my',
    /* #swagger.tags = ['Developers'] */
    checkLogin, async function (req, res, next) {
        try {
            let developer = await developerController.getMyProfile(req.userId);
            if (!developer) return res.status(404).send({ message: "Developer profile not found" });
            res.send(developer);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get('/my/apps',
    /* #swagger.tags = ['Developers'] */
    checkLogin, async function (req, res, next) {
        try {
            let apps = await developerController.getMyApps(req.userId);
            res.send(apps);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get('/:id',
    /* #swagger.tags = ['Developers'] */
    async function (req, res, next) {
        try {
            let developer = await developerController.getDeveloperById(req.params.id);
            if (!developer) return res.status(404).send({ message: "Developer not found" });
            res.send(developer);
        } catch (error) {
            res.status(404).send({ message: "Developer not found" });
        }
    });

// ============================================================
// USER / DEVELOPER
// POST /api/v1/developers                       - Create developer profile
// PUT  /api/v1/developers/:id                  - Update developer profile
// POST /api/v1/developers/upload-avatar/:id    - Upload avatar
// ============================================================

router.post('/',
    /* #swagger.tags = ['Developers'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await developerController.createDeveloper(req.userId, req.body);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.status(201).send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.put('/:id',
    /* #swagger.tags = ['Developers'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await developerController.updateDeveloper(req.params.id, req.userId, req.body);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.post('/upload-avatar/:id',
    /* #swagger.tags = ['Developers'] */
    checkLogin, uploadImage.single('file'), async function (req, res, next) {
        try {
            if (!req.file) return res.status(400).send({ message: "Chua co file avatar duoc gui len" });
            let result = await developerController.uploadAvatar(req.params.id, req.userId, req.file);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// ============================================================
// ADMIN ONLY
// PUT  /api/v1/developers/:id/approve    - Approve developer
// PUT  /api/v1/developers/:id/reject     - Reject developer
// PUT  /api/v1/developers/:id/permissions - Update permissions
// ============================================================

router.put('/:id/approve',
    /* #swagger.tags = ['Developers'] */
    checkLogin, checkRole('ADMIN'), async function (req, res, next) {
        try {
            let result = await developerController.approveDeveloper(req.params.id, req.userId, req.body);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.put('/:id/reject',
    /* #swagger.tags = ['Developers'] */
    checkLogin, checkRole('ADMIN'), async function (req, res, next) {
        try {
            let { reason } = req.body;
            let result = await developerController.rejectDeveloper(req.params.id, reason);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.put('/:id/permissions',
    /* #swagger.tags = ['Developers'] */
    checkLogin, checkRole('ADMIN'), async function (req, res, next) {
        try {
            let result = await developerController.updatePermissions(req.params.id, req.body.permissions);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// ============================================================
// DELETE /api/v1/developers/:id         - Soft delete (owner / ADMIN)
// ============================================================

router.delete('/:id',
    /* #swagger.tags = ['Developers'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await developerController.deleteDeveloper(req.params.id, req.userId);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send({ message: "Developer da duoc xoa", developer: result });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

module.exports = router;
