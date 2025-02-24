const express = require('express');
const router = express.Router();
const { createProduct, getProducts, updateProduct, deleteProduct  , upload} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user/:userId', authMiddleware, getProducts);
router.post('/', authMiddleware, upload, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
