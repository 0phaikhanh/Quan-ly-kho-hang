const roleMiddleware = (roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Truy cập bị từ chối' });  // Nếu người dùng không có quyền, trả về lỗi 403
      }
      next();  // Nếu có quyền, tiếp tục với middleware hoặc route handler tiếp theo
    };
  };
  
  module.exports = roleMiddleware;
  