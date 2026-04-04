var express = require('express');
var router = express.Router();
let categoryController = require('../controllers/categories');
let { checkLogin, checkRole } = require('../utils/authHandler.js');

/* GET all categories. */
router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryController.getAllCategories();
    res.send(categories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

/* GET category by id. */
router.get('/:id', async function(req, res, next) {
  try {
    let category = await categoryController.getCategoryById(req.params.id);
    if (category) {
      res.send(category);
    } else {
      res.status(404).send({ message: "Category not found" });
    }
  } catch (error) {
    res.status(404).send({ message: "Category not found" });
  }
});

/* POST create category. */
router.post('/', checkLogin, checkRole("ADMIN", "MODERATOR"), async function(req, res, next) {
  try {
    let { name, parentId, iconUrl } = req.body;
    let newCategory = await categoryController.createCategory(name, parentId, iconUrl);
    res.status(201).send(newCategory);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* PUT update category. */
router.put('/:id', checkLogin, checkRole("ADMIN", "MODERATOR"), async function(req, res, next) {
  try {
    let updatedCategory = await categoryController.updateCategory(req.params.id, req.body);
    if (!updatedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.send(updatedCategory);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/* DELETE category. */
router.delete('/:id', checkLogin, checkRole("ADMIN", "MODERATOR"), async function(req, res, next) {
  try {
    let deletedCategory = await categoryController.deleteCategory(req.params.id);
    if (!deletedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.send({ message: "Category deleted successfully", deletedCategory });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
