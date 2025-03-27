// routes/products.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  importProduct,
  exportProduct,
  getLowStockProducts,
  getProductTransactions
} = require('../controllers/productController');
const { protect, isAdmin, isManager } = require('../middleware/auth');

// Áp dụng middleware xác thực cho tất cả routes
router.use(protect);

// Get all products and create product
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Low stock products
router.get('/low-stock', getLowStockProducts);

// Get, update and delete specific product
router.route('/:id')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

// Import and export products
router.post('/:id/import', importProduct);
router.post('/:id/export', exportProduct);

// Get product transactions
router.get('/:id/transactions', getProductTransactions);

module.exports = router;