// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { User } = require('../models');

// Middleware bảo vệ các route yêu cầu xác thực
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra token trong headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Xác minh token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ token và gán vào req.user
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Không được phép truy cập, token không hợp lệ');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Không được phép truy cập, không có token');
  }
});

// Middleware kiểm tra quyền admin
exports.isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Không được phép, yêu cầu quyền Admin');
  }
});

// Middleware kiểm tra quyền manager
exports.isManager = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403);
    throw new Error('Không được phép, yêu cầu quyền Manager');
  }
});

// Middleware kiểm tra quyền user (bất kỳ người dùng nào đã đăng nhập)
exports.isUser = asyncHandler(async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(403);
    throw new Error('Không được phép, yêu cầu đăng nhập');
  }
});