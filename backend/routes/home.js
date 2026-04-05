var express = require("express");
var router = express.Router();
let homeController = require('../controllers/home');

// GET home page data
router.get("/", homeController.getHomeData);

module.exports = router;
