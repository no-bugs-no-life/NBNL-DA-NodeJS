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


router.get('/name/:name', tagsController.getAppsByTagName);


router.get('/:id', tagsController.getTagById);


router.post('/', checkLogin, checkRole('ADMIN', 'MODERATOR'), tagsController.createTag);


router.put('/:id', checkLogin, checkRole('ADMIN', 'MODERATOR'), tagsController.updateTag);


router.delete('/:id', checkLogin, checkRole('ADMIN'), tagsController.deleteTag);


router.post('/:id/apps', checkLogin, tagsController.addTagToApp);


router.delete('/:id/apps', checkLogin, tagsController.removeTagFromApp);

module.exports = router;
