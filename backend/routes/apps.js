var express = require('express');
var router = express.Router();
let appModel = require('../schemas/apps');
let { checkLogin, checkRole } = require('../utils/authHandler.js');
let { uploadApk, uploadIpa } = require('../utils/uploadHandler');
let path = require('path');
let fs = require('fs');

// ============================================================
// GET /api/v1/apps              - List all published apps (public)
// GET /api/v1/apps/my           - List apps by current developer (login required)
// GET /api/v1/apps/pending      - List pending apps (ADMIN/MODERATOR only)
// GET /api/v1/apps/:id          - Get app detail (public)
// ============================================================

// List published apps (public)
router.get('/', async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 20;
        let page = queries.page ? parseInt(queries.page) : 1;
        let categoryId = queries.categoryId;

        let filter = { status: "published", isDeleted: false };
        if (categoryId) { filter.categoryId = categoryId; }

        let result = await appModel.find(filter)
            .populate('developerId', 'fullName email avatarUrl')
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 })
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// List apps by current developer (login required)
router.get('/my', checkLogin, async function (req, res, next) {
    try {
        let developerId = req.userId;
        let apps = await appModel.find({ developerId, isDeleted: false })
            .populate('categoryId', 'name')
            .sort({ createdAt: -1 });
        res.send(apps);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// List pending apps (ADMIN / MODERATOR only)
router.get('/pending', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let apps = await appModel.find({ status: "pending", isDeleted: false })
            .populate('developerId', 'fullName email avatarUrl')
            .populate('categoryId', 'name')
            .sort({ createdAt: 1 });
        res.send(apps);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get app detail (public)
router.get('/:id', async function (req, res, next) {
    try {
        let app = await appModel.findOne({ _id: req.params.id, isDeleted: false })
            .populate('developerId', 'fullName email avatarUrl')
            .populate('categoryId', 'name');
        if (!app) {
            return res.status(404).send({ message: "App not found" });
        }
        res.send(app);
    } catch (error) {
        res.status(404).send({ message: "App not found" });
    }
});

// ============================================================
// POST /api/v1/apps                         - Create new app (developer)
// POST /api/v1/apps/upload-apk/:id          - Upload APK (developer, owner only)
// POST /api/v1/apps/upload-ipa/:id          - Upload IPA (developer, owner only)
// POST /api/v1/apps/approve/:id             - Approve app (ADMIN/MODERATOR)
// POST /api/v1/apps/reject/:id              - Reject app (ADMIN/MODERATOR)
// POST /api/v1/apps/publish/:id             - Publish app (ADMIN/MODERATOR)
// ============================================================

// Create new app (developer only)
router.post('/', checkLogin, async function (req, res, next) {
    try {
        let developerId = req.userId;
        let newApp = new appModel({
            name: req.body.name,
            description: req.body.description || "",
            developerId: developerId,
            categoryId: req.body.categoryId || null,
            version: req.body.version || "1.0.0",
            status: "pending",
            fileUrl: "",
            iconUrl: req.body.iconUrl || ""
        });
        await newApp.save();
        await newApp.populate('categoryId', 'name');
        res.send(newApp);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Upload APK file (developer, owner only)
router.post('/upload-apk/:id', checkLogin, uploadApk.single('file'), async function (req, res, next) {
    try {
        let appId = req.params.id;
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }
        if (app.developerId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen tai file len app nay" });
        }
        if (!req.file) { return res.status(400).send({ message: "Chua co file apk duoc gui len" }); }

        // Xoa file cu neu co
        if (app.fileUrl) {
            let oldPath = path.join(__dirname, '../', app.fileUrl);
            if (fs.existsSync(oldPath)) { fs.unlinkSync(oldPath); }
        }

        app.fileUrl = req.file.path;
        await app.save();
        res.send({ message: "Upload APK thanh cong", fileUrl: app.fileUrl, version: app.version });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Upload IPA file (developer, owner only)
router.post('/upload-ipa/:id', checkLogin, uploadIpa.single('file'), async function (req, res, next) {
    try {
        let appId = req.params.id;
        let app = await appModel.findOne({ _id: appId, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }
        if (app.developerId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen tai file len app nay" });
        }
        if (!req.file) { return res.status(400).send({ message: "Chua co file ipa duoc gui len" }); }

        // Xoa file cu neu co
        if (app.fileUrl) {
            let oldPath = path.join(__dirname, '../', app.fileUrl);
            if (fs.existsSync(oldPath)) { fs.unlinkSync(oldPath); }
        }

        app.fileUrl = req.file.path;
        await app.save();
        res.send({ message: "Upload IPA thanh cong", fileUrl: app.fileUrl, version: app.version });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Approve app (ADMIN / MODERATOR only)
router.post('/approve/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let app = await appModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }
        app.status = "approved";
        await app.save();
        res.send({ message: "App da duoc duyet", app });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Reject app (ADMIN / MODERATOR only)
router.post('/reject/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let app = await appModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }
        app.status = "rejected";
        await app.save();
        res.send({ message: "App da bi tu choi", app });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Publish approved app (ADMIN / MODERATOR only)
router.post('/publish/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), async function (req, res, next) {
    try {
        let app = await appModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }
        if (app.status !== "approved") {
            return res.status(400).send({ message: "App phai duoc duyet truoc khi xuat ban" });
        }
        app.status = "published";
        await app.save();
        res.send({ message: "App da duoc xuat ban", app });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/apps/:id            - Update app info (developer, owner only)
// ============================================================

router.put('/:id', checkLogin, async function (req, res, next) {
    try {
        let app = await appModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }
        if (app.developerId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen chinh sua app nay" });
        }
        // Cho phep cap nhat mot so truong
        let allowedFields = ['name', 'description', 'categoryId', 'version', 'iconUrl'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                app[field] = req.body[field];
            }
        });
        // Reset ve pending khi cap nhat thong tin
        app.status = "pending";
        await app.save();
        await app.populate('categoryId', 'name');
        res.send(app);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/apps/:id         - Soft delete app (developer owner / ADMIN)
// ============================================================

router.delete('/:id', checkLogin, async function (req, res, next) {
    try {
        let app = await appModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!app) { return res.status(404).send({ message: "App not found" }); }

        // Chi chu so huu hoac ADMIN moi duoc xoa
        let userController = require('../controllers/users');
        let user = await userController.FindUserById(req.userId);
        let isAdmin = user && user.role && user.role.name === 'ADMIN';
        if (app.developerId.toString() !== req.userId && !isAdmin) {
            return res.status(403).send({ message: "Ban khong co quyen xoa app nay" });
        }

        // Xoa file neu co
        if (app.fileUrl) {
            let filePath = path.join(__dirname, '../', app.fileUrl);
            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
        }

        app.isDeleted = true;
        await app.save();
        res.send({ message: "App da duoc xoa", app });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
