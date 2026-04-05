var express = require('express');
var router = express.Router();
let appController = require('../controllers/apps');
let { checkLogin, checkRole } = require('../utils/authHandler.js');
let { uploadApk, uploadIpa } = require('../utils/uploadHandler');

// ============================================================
// GET /api/v1/apps              - List published apps (public)
// GET /api/v1/apps/my           - List apps by current developer (login)
// GET /api/v1/apps/pending      - List pending apps (ADMIN/MODERATOR)
// GET /api/v1/apps/detail/:slug - Get app detail by slug (public)
// GET /api/v1/apps/download/:id - Download app if accessible
// GET /api/v1/apps/:id          - Get app detail by ID (public)
// ============================================================

router.get('/',
    /* #swagger.tags = ['Apps'] */
    async function (req, res, next) {
        try {
            let apps = await appController.getAllApps(req.query);
            res.send(apps);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get('/my',
    /* #swagger.tags = ['Apps'] */
    checkLogin, async function (req, res, next) {
        try {
            let apps = await appController.getMyApps(req.userId, req.query);
            res.send(apps);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get('/pending',
    /* #swagger.tags = ['Apps'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let apps = await appController.getPendingApps(req.query);
            res.send(apps);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.get('/detail/:slug',
    /* #swagger.tags = ['Apps'] */
    async function (req, res, next) {
        try {
            let app = await appController.getAppBySlug(req.params.slug);
            if (!app) return res.status(404).send({ message: "App not found" });
            res.send(app);
        } catch (error) {
            res.status(404).send({ message: "App not found" });
        }
    });

router.get('/:id',
    /* #swagger.tags = ['Apps'] */
    async function (req, res, next) {
        try {
            let app = await appController.getAppById(req.params.id);
            if (!app) return res.status(404).send({ message: "App not found" });
            res.send(app);
        } catch (error) {
            res.status(404).send({ message: "App not found" });
        }
    });

router.get('/download/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await appController.downloadApp(req.params.id, req.userId);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// ============================================================
// POST /api/v1/apps                         - Create app
// POST /api/v1/apps/upload-file/:id         - Attach File (APK, IPA, EXE)
// POST /api/v1/apps/approve/:id             - Approve
// POST /api/v1/apps/reject/:id              - Reject
// POST /api/v1/apps/publish/:id             - Publish
// ============================================================

router.post('/',
    /* #swagger.tags = ['Apps'] */
    checkLogin, async function (req, res, next) {
        try {
            let app = await appController.createApp(req.body, req.userId);
            res.status(201).send(app);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

router.post('/upload-file/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, async function (req, res, next) {
        try {
            if (!req.body.fileId) return res.status(400).send({ message: "Chua co fileId duoc gui len" });
            let result = await appController.uploadFile(req.params.id, req.userId, req.body.fileId);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.post('/approve/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await appController.approveApp(req.params.id);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send({ message: "App da duoc duyet", app: result });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.post('/reject/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await appController.rejectApp(req.params.id);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send({ message: "App da bi tu choi", app: result });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

router.post('/publish/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
        try {
            let result = await appController.publishApp(req.params.id);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send({ message: "App da duoc xuat ban", app: result });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

// ============================================================
// PUT /api/v1/apps/:id            - Update app (owner only)
// ============================================================

router.put('/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await appController.updateApp(req.params.id, req.userId, req.body);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send(result);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    });

// ============================================================
// DELETE /api/v1/apps/:id         - Soft delete app (owner / ADMIN)
// ============================================================

router.delete('/:id',
    /* #swagger.tags = ['Apps'] */
    checkLogin, async function (req, res, next) {
        try {
            let result = await appController.deleteApp(req.params.id, req.userId);
            if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
            res.send({ message: "App da duoc xoa", app: result });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    });

module.exports = router;
