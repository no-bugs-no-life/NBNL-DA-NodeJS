var express = require('express');
var router = express.Router();
let { checkLogin, checkRole } = require('../utils/authHandler.js.js');
let tagsController = require('../controllers/tags');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /api/v1/tags
// Lấy toàn bộ tags, hỗ trợ: ?search=&page=&limit=&sortBy=&order=
router.get('/', tagsController.getAllTags);

// GET /api/v1/tags/name/:name
// SEO-friendly: lấy apps theo tên tag (slug), hỗ trợ ?page=&limit=&categoryId=
router.get('/name/:name', tagsController.getAppsByTagName);

// GET /api/v1/tags/:id
// Lấy chi tiết tag + danh sách app thuộc tag
router.get('/:id', tagsController.getTagById);

// ============================================================
// PROTECTED ROUTES - ADMIN / MODERATOR
// ============================================================

// POST /api/v1/tags
// Tạo tag mới
// Body: { name }
router.post('/', checkLogin, checkRole('ADMIN', 'MODERATOR'), tagsController.createTag);

// PUT /api/v1/tags/:id
// Cập nhật tên tag
// Body: { name }
router.put('/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), tagsController.updateTag);

// DELETE /api/v1/tags/:id
// Soft delete tag (chỉ ADMIN)
router.delete('/:id', checkLogin, checkRole('ADMIN'), tagsController.deleteTag);

// ============================================================
// PROTECTED ROUTES - Developer (chủ app) hoặc ADMIN
// ============================================================

// POST /api/v1/tags/:id/apps
// Gắn tag vào app
// Body: { appId }
router.post('/:id/apps', checkLogin, tagsController.addTagToApp);

// DELETE /api/v1/tags/:id/apps
// Gỡ tag khỏi app
// Body: { appId }
router.delete('/:id/apps', checkLogin, tagsController.removeTagFromApp);

module.exports = router;
