const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken } = require('../config/jwtConfig');

// Middleware để kiểm tra token
const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization']; // Lấy token từ header

  if (!token) {
    return res.status(403).json({ message: 'Token không xác thực' });
  }

  try {
    const decoded = await verifyToken(token); // Xác thực token
    req.user = decoded; // Lưu thông tin người dùng vào request object
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không đúng hoặc đã hết hạn' });
  }
};

module.exports = authMiddleware;
