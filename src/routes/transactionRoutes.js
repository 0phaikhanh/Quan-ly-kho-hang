// /routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route để lấy tất cả giao dịch
router.get('/transactions', transactionController.getAllTransactions);

// Route nhập/xuất kho
router.post('/transactions/import', transactionController.addImportTransaction);
router.post('/transactions/export', transactionController.addExportTransaction);

module.exports = router;
