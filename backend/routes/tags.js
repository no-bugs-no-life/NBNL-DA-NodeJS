var express = require('express');
var router = express.Router();
let { checkLogin, checkRole } = require('../utils/authHandler.js.js');
let tagsController = require('../controllers/tags');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// GET /api/v1/tags
// Lấy toàn bộ tags, hỗ trợ: ?search=&page=&limit=&sortBy=&order=
router.get('/',
    /* #swagger.tags = ['Tags'] */
 tagsController.getAllTags);


router.get('/name/:name',
    /* #swagger.tags = ['Tags'] */
 tagsController.getAppsByTagName);


router.get('/:id',
    /* #swagger.tags = ['Tags'] */
 tagsController.getTagById);


router.post('/',
    /* #swagger.tags = ['Tags'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), tagsController.createTag);


router.put('/:id',
    /* #swagger.tags = ['Tags'] */
 checkLogin, checkRole('ADMIN', 'MODERATOR'), tagsController.updateTag);


router.delete('/:id',
    /* #swagger.tags = ['Tags'] */
 checkLogin, checkRole('ADMIN'), tagsController.deleteTag);


router.post('/:id/apps',
    /* #swagger.tags = ['Tags'] */
 checkLogin, tagsController.addTagToApp);


router.delete('/:id/apps',
    /* #swagger.tags = ['Tags'] */
 checkLogin, tagsController.removeTagFromApp);

module.exports = router;
