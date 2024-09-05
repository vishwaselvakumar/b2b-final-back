const express = require('express');
const router = express.Router();
const {addProduct,getProductById,getProducts,getImage,getProductsByCategory} = require('../controller/productController');

router.post('/product',addProduct);
router.get('/products', getProducts);
router.get('/product/:id', getProductById);
router.get('/image/:filename', getImage);
router.get('/products/category/:categoryId', getProductsByCategory);

module.exports = router;
