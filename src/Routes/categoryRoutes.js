const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categorycontroller'); // Adjust the path as needed

// Route to create a category
router.post('/category', categoryController.createCategory);
router.get('/image/:filename', categoryController.getImage);
router.get('/categories', categoryController.getCategories);
module.exports = router;
