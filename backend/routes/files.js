var express = require('express');
var router = express.Router();
let fileController = require('../controllers/files');
let userController = require('../controllers/users');
let { checkLogin, checkRole } = require('../utils/authHandler.js');
let { uploadImage, uploadApk, uploadIpa } = require('../utils/uploadHandler');
let path = require('path');
let fs = require('fs');

// ============================================================
// GET /api/v1/files                          - List files (filter)
// GET /api/v1/files/:id                      - Get file detail
// GET /api/v1/files/:id/download             - Download file
// ============================================================

// List files (ADMIN/MOD or owner)
router.get('/',
    /* #swagger.tags = ['Files'] */
 checkLogin, async function (req, res, next) {
    try {
        let user = await userController.FindUserById(req.userId);
        let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);

        // Developer/User chi xem file cua minh
        let filter = { isDeleted: false };
        if (!isAdminOrMod) {
            filter.ownerId = req.userId;
        }

        // Loc them theo query
        if (req.query.ownerType) filter.ownerType = req.query.ownerType;
        if (req.query.fileType) filter.fileType = req.query.fileType;

        let files = await fileController.getFiles({ ...req.query, ...filter });
        res.send(files);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get file detail (ADMIN/MOD or owner)
router.get('/:id',
    /* #swagger.tags = ['Files'] */
 checkLogin, async function (req, res, next) {
    try {
        let file = await fileController.getFileById(req.params.id);
        if (!file) {
            return res.status(404).send({ message: "File not found" });
        }

        let user = await userController.FindUserById(req.userId);
        let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);
        if (!isAdminOrMod && file.ownerId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen xem file nay" });
        }

        res.send(file);
    } catch (error) {
        res.status(404).send({ message: "File not found" });
    }
});

// Download file (ADMIN/MOD or owner)
router.get('/:id/download',
    /* #swagger.tags = ['Files'] */
 checkLogin, async function (req, res, next) {
    try {
        let file = await fileController.getFileById(req.params.id);
        if (!file) {
            return res.status(404).send({ message: "File not found" });
        }

        let user = await userController.FindUserById(req.userId);
        let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);
        if (!isAdminOrMod && file.ownerId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen tai file nay" });
        }

        let filePath = path.join(__dirname, '../', file.url);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send({ message: "File khong ton tai tren server" });
        }
        res.download(filePath);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// POST /api/v1/files/upload-image      - Upload image (icon, banner, screenshot, avatar)
// POST /api/v1/files/upload-apk         - Upload APK
// POST /api/v1/files/upload-ipa         - Upload IPA
// ============================================================

// Upload image
router.post('/upload-image',
    /* #swagger.tags = ['Files'] */
 checkLogin, uploadImage.single('file'), async function (req, res, next) {
    try {
        let { ownerType, ownerId, fileType } = req.body;
        if (!req.file) {
            return res.status(400).send({ message: "Chua co file duoc gui len" });
        }
        if (!ownerType || !ownerId || !fileType) {
            // Xoa file neu thieu thong tin
            let tmpPath = req.file.path;
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            return res.status(400).send({ message: "ownerType, ownerId, fileType la bat buoc" });
        }

        let validImageTypes = ['icon', 'banner', 'screenshot', 'avatar'];
        if (!validImageTypes.includes(fileType)) {
            let tmpPath = req.file.path;
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            return res.status(400).send({ message: `fileType phai la mot trong: ${validImageTypes.join(', ')}` });
        }

        let file = await fileController.saveFileMetadata({
            ownerType, ownerId, fileType,
            url: req.file.path,
            size: req.file.size
        });
        res.status(201).send(file);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Upload APK
router.post('/upload-apk',
    /* #swagger.tags = ['Files'] */
 checkLogin, uploadApk.single('file'), async function (req, res, next) {
    try {
        let { ownerType, ownerId } = req.body;
        if (!req.file) {
            return res.status(400).send({ message: "Chua co file duoc gui len" });
        }
        if (!ownerType || !ownerId) {
            let tmpPath = req.file.path;
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            return res.status(400).send({ message: "ownerType va ownerId la bat buoc" });
        }

        let file = await fileController.saveFileMetadata({
            ownerType, ownerId, fileType: 'apk',
            url: req.file.path,
            size: req.file.size
        });
        res.status(201).send(file);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Upload IPA
router.post('/upload-ipa',
    /* #swagger.tags = ['Files'] */
 checkLogin, uploadIpa.single('file'), async function (req, res, next) {
    try {
        let { ownerType, ownerId } = req.body;
        if (!req.file) {
            return res.status(400).send({ message: "Chua co file duoc gui len" });
        }
        if (!ownerType || !ownerId) {
            let tmpPath = req.file.path;
            if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            return res.status(400).send({ message: "ownerType va ownerId la bat buoc" });
        }

        let file = await fileController.saveFileMetadata({
            ownerType, ownerId, fileType: 'ipa',
            url: req.file.path,
            size: req.file.size
        });
        res.status(201).send(file);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/files/:id           - Update file metadata (owner / ADMIN/MOD)
// ============================================================

router.put('/:id',
    /* #swagger.tags = ['Files'] */
 checkLogin, async function (req, res, next) {
    try {
        let user = await userController.FindUserById(req.userId);
        let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);

        let result = await fileController.updateFile(req.params.id, req.userId, isAdminOrMod, req.body);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/files/:id       - Delete file + physical file (owner / ADMIN/MOD)
// ============================================================

router.delete('/:id',
    /* #swagger.tags = ['Files'] */
 checkLogin, async function (req, res, next) {
    try {
        let user = await userController.FindUserById(req.userId);
        let isAdminOrMod = user && ['ADMIN', 'MODERATOR'].includes(user.role.name);

        let result = await fileController.deleteFile(req.params.id, req.userId, isAdminOrMod);
        if (result && result.error) {
            return res.status(result.code || 400).send({ message: result.error });
        }
        res.send(result);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
