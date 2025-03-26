// /routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const materialController = require('../controllers/materialController');

// Lấy tất cả nguyên liệu
router.get('/materials', materialController.getAllMaterials);

// Thêm nguyên liệu mới vào kho
router.post('/materials', materialController.addMaterial);

// Cập nhật thông tin nguyên liệu
router.put('/materials/:id', materialController.updateMaterial);

// Xóa nguyên liệu khỏi kho
router.delete('/materials/:id', materialController.deleteMaterial);

module.exports = router;
