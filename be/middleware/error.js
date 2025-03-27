// middleware/error.js
const { ValidationError, DatabaseError, UniqueConstraintError } = require('sequelize');

const errorHandler = (err, req, res, next) => {
  // Log error
  console.error(err);

  // Sequelize validation error
  if (err instanceof ValidationError) {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }

  // Sequelize unique constraint error
  if (err instanceof UniqueConstraintError) {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Dữ liệu đã tồn tại trong hệ thống',
      messages
    });
  }

  // Sequelize database error
  if (err instanceof DatabaseError) {
    return res.status(500).json({
      success: false,
      error: 'Lỗi cơ sở dữ liệu',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token không hợp lệ'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token đã hết hạn'
    });
  }

  // Default error response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Lỗi server'
  });
};

module.exports = { errorHandler };