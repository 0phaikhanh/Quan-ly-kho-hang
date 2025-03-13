const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// Lấy tổng doanh thu
router.get('/sales/total', salesController.getTotalSales);

module.exports = router;
