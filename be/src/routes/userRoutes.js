const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// API cần xác thực JWT
router.get('/profile', authMiddleware, (req, res) => {
  // Nếu token hợp lệ, thông tin người dùng đã được lưu vào req.user
  res.status(200).json({ user: req.user });
});

module.exports = router;
