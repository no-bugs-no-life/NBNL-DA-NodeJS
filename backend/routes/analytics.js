var express = require('express');
var router = express.Router();
let analyticsController = require('../controllers/analytics');
let { checkLogin } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/analytics                        - List analytics (developer/admin)
// GET /api/v1/analytics/summary/:appId         - Get summary stats for an app
// GET /api/v1/analytics/:id                     - Get analytics record detail
// ============================================================

// List analytics with filters (developer: own apps only, ADMIN: all)
router.get('/',
    /* #swagger.tags = ['Analytics'] */
 checkLogin, async function (req, res, next) {
    try {
        let result = await analyticsController.getAnalytics(req.query, req.userId);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get summary stats for an app (developer: own, ADMIN: all)
router.get('/summary/:appId',
    /* #swagger.tags = ['Analytics'] */
 checkLogin, async function (req, res, next) {
    try {
        let result = await analyticsController.getSummary(req.params.appId, req.userId);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get analytics record detail (developer: own app, ADMIN: all)
router.get('/:id',
    /* #swagger.tags = ['Analytics'] */
 checkLogin, async function (req, res, next) {
    try {
        let result = await analyticsController.getAnalyticsById(req.params.id, req.userId);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "Analytics record not found" });
    }
});

// ============================================================
// INTERNAL CRUD (no auth - cho events/cron)
// ============================================================

// PUT /api/v1/analytics/daily - Upsert daily record (internal)
router.put('/daily',
    /* #swagger.tags = ['Analytics'] */
 async function (req, res, next) {
    try {
        let result = await analyticsController.upsertDaily(req.body);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send({ message: "Cap nhat analytics thanh cong", record: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST /api/v1/analytics - Create new analytics record (internal)
router.post('/',
    /* #swagger.tags = ['Analytics'] */
 async function (req, res, next) {
    try {
        let result = await analyticsController.createAnalytics(req.body);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// PUT /api/v1/analytics/:id - Update analytics record (internal)
router.put('/:id',
    /* #swagger.tags = ['Analytics'] */
 async function (req, res, next) {
    try {
        let result = await analyticsController.updateAnalytics(req.params.id, req.body);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// DELETE /api/v1/analytics/:id - Delete analytics record (internal)
router.delete('/:id',
    /* #swagger.tags = ['Analytics'] */
 async function (req, res, next) {
    try {
        let result = await analyticsController.deleteAnalytics(req.params.id);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send({ message: "Analytics record da duoc xoa", record: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
