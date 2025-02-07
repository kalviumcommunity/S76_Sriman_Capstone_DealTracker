const express = require('express');
const router = express.Router();
const { getProducts, createProduct , updateProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);

module.exports = router; 