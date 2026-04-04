var express = require('express');
var router = express.Router();
let developerModel = require('../schemas/developers');
let appModel = require('../schemas/apps');
let userController = require('../controllers/users');
let { checkLogin, checkRole } = require('../utils/authHandler.js');
let { uploadImage } = require('../utils/uploadHandler');
let path = require('path');
let fs = require('fs');

// ============================================================
// GET /api/v1/developers              - List all developers (public)
// GET /api/v1/developers/my           - Get current developer profile (login required)
// GET /api/v1/developers/:id          - Get developer detail (public)
// ============================================================

// List all developers (public)
router.get('/', async function (req, res, next) {
    try {
        let queries = req.query;
        let limit = queries.limit ? parseInt(queries.limit) : 20;
        let page = queries.page ? parseInt(queries.page) : 1;
        let sortBy = queries.sortBy || 'createdAt';
        let order = queries.order === 'asc' ? 1 : -1;

        let sortObj = {};
        sortObj[sortBy] = order;

        let developers = await developerModel.find({ isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .sort(sortObj)
            .skip(limit * (page - 1))
            .limit(limit);

        res.send(developers);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get current developer profile (login required)
router.get('/my', checkLogin, async function (req, res, next) {
    try {
        let developer = await developerModel.findOne({ userId: req.userId, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate('apps', 'name iconUrl status');
        if (!developer) {
            return res.status(404).send({ message: "Developer profile not found" });
        }
        res.send(developer);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Get developer detail (public)
router.get('/:id', async function (req, res, next) {
    try {
        let developer = await developerModel.findOne({ _id: req.params.id, isDeleted: false })
            .populate('userId', 'fullName email avatarUrl')
            .populate('apps', 'name iconUrl status description version');
        if (!developer) {
            return res.status(404).send({ message: "Developer not found" });
        }
        res.send(developer);
    } catch (error) {
        res.status(404).send({ message: "Developer not found" });
    }
});

// ============================================================
// POST /api/v1/developers                         - Create developer profile (user)
// POST /api/v1/developers/upload-avatar/:id       - Upload avatar (developer, owner only)
// ============================================================

// Create developer profile (any logged-in user)
router.post('/', checkLogin, async function (req, res, next) {
    try {
        let userId = req.userId;

        // Kiem tra da ton tai developer chua
        let existing = await developerModel.findOne({ userId, isDeleted: false });
        if (existing) {
            return res.status(400).send({ message: "Developer profile da ton tai" });
        }

        let newDeveloper = new developerModel({
            userId: userId,
            name: req.body.name,
            bio: req.body.bio || "",
            website: req.body.website || "",
            avatarUrl: req.body.avatarUrl || "",
            apps: []
        });
        await newDeveloper.save();
        await newDeveloper.populate('userId', 'fullName email avatarUrl');
        res.status(201).send(newDeveloper);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// Upload avatar (developer, owner only)
router.post('/upload-avatar/:id', checkLogin, uploadImage.single('file'), async function (req, res, next) {
    try {
        let developer = await developerModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!developer) {
            return res.status(404).send({ message: "Developer not found" });
        }
        if (developer.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen tai avatar len developer nay" });
        }
        if (!req.file) {
            return res.status(400).send({ message: "Chua co file avatar duoc gui len" });
        }

        // Xoa avatar cu neu co
        if (developer.avatarUrl) {
            let oldPath = path.join(__dirname, '../', developer.avatarUrl);
            if (fs.existsSync(oldPath)) { fs.unlinkSync(oldPath); }
        }

        developer.avatarUrl = req.file.path;
        await developer.save();
        res.send({ message: "Upload avatar thanh cong", avatarUrl: developer.avatarUrl });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// ============================================================
// PUT /api/v1/developers/:id            - Update developer profile (developer, owner only)
// ============================================================

router.put('/:id', checkLogin, async function (req, res, next) {
    try {
        let developer = await developerModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!developer) {
            return res.status(404).send({ message: "Developer not found" });
        }
        if (developer.userId.toString() !== req.userId) {
            return res.status(403).send({ message: "Ban khong co quyen chinh sua profile nay" });
        }

        let allowedFields = ['name', 'bio', 'website', 'avatarUrl'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                developer[field] = req.body[field];
            }
        });
        await developer.save();
        await developer.populate('userId', 'fullName email avatarUrl');
        res.send(developer);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// ============================================================
// DELETE /api/v1/developers/:id         - Soft delete developer (owner / ADMIN)
// ============================================================

router.delete('/:id', checkLogin, async function (req, res, next) {
    try {
        let developer = await developerModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!developer) {
            return res.status(404).send({ message: "Developer not found" });
        }

        // Chi chu so huu hoac ADMIN moi duoc xoa
        let user = await userController.FindUserById(req.userId);
        let isAdmin = user && user.role && user.role.name === 'ADMIN';
        if (developer.userId.toString() !== req.userId && !isAdmin) {
            return res.status(403).send({ message: "Ban khong co quyen xoa developer nay" });
        }

        // Xoa avatar neu co
        if (developer.avatarUrl) {
            let filePath = path.join(__dirname, '../', developer.avatarUrl);
            if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
        }

        developer.isDeleted = true;
        await developer.save();
        res.send({ message: "Developer da duoc xoa", developer });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
