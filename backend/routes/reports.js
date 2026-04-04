var express = require('express');
var router = express.Router();
let reportController = require('../controllers/reports');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

// ============================================================
// GET /api/v1/reports                              - List all reports (ADMIN/MOD)
// GET /api/v1/reports/my                          - My reports (login)
// GET /api/v1/reports/pending                      - Pending reports (ADMIN/MOD)
// GET /api/v1/reports/:id                          - Get detail
// ============================================================

router.get('/', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let reports = await reportController.getAllReports(req.query);
        res.send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/my', checkLogin, async function (req, res, next) {
    try {
        let reports = await reportController.getMyReports(req.userId, req.query);
        res.send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/pending', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let reports = await reportController.getPendingReports();
        res.send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.get('/:id', checkLogin, async function (req, res, next) {
    try {
        let result = await reportController.getReportById(req.params.id, req.userId);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: "Report not found" });
    }
});

// ============================================================
// POST /api/v1/reports                                   - Create report
// ============================================================

router.post('/', checkLogin, async function (req, res, next) {
    try {
        let result = await reportController.createReport(req.userId, req.body);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/reports/:id                    - Update report (ADMIN/MOD)
// PUT /api/v1/reports/:id/status             - Update status (ADMIN/MOD)
// ============================================================

router.put('/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let result = await reportController.updateReport(req.params.id, req.body);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put('/:id/status', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let { status } = req.body;
        if (!status) return res.status(400).send({ message: "status la bat buoc" });
        let result = await reportController.updateReportStatus(req.params.id, status);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send({ message: "Cap nhat trang thai thanh cong", report: result });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/reports/:id     - Soft delete (ADMIN/MOD only)
// ============================================================

router.delete('/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let result = await reportController.deleteReport(req.params.id);
        if (result && result.error) return res.status(result.code || 400).send({ message: result.error });
        res.send({ message: "Report da duoc xoa", report: result });
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
