const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);  // In lỗi ra console (nếu có)
    
    res.status(500).json({
      message: err.message || 'Something went wrong!',
      stack: err.stack,
    });
  };
  
  module.exports = errorMiddleware;
  