// /routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Thêm nguyên liệu vào kho
router.post('/add', inventoryController.addInventoryItem);

module.exports = router;
