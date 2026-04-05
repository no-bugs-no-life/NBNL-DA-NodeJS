var express = require("express");
var router = express.Router();
let profileController = require('../controllers/profile');
let { checkLogin } = require('../utils/authHandler.js.js');

// All profile endpoints demand login
router.use(checkLogin);

router.get("/", profileController.getProfile);
router.put("/settings", profileController.updateSettings);
router.get("/wishlist", profileController.getWishlist);
router.get("/history", profileController.getHistory);
router.get("/library", profileController.getLibrary);

module.exports = router;
