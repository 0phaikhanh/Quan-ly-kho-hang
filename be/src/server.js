require('dotenv').config();  // Load biến môi trường từ .env
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');  // ✅ Import routes đăng nhập/đăng ký
const inventoryRoutes = require('./routes/inventoryRoutes');
const appConfig = require('./config/appConfig'); 

// Middleware để xử lý JSON request body
app.use(bodyParser.json());

// Import các middleware
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// ✅ Đăng ký route đăng nhập / đăng ký
app.use('/api/auth', authRoutes);

// Import các routes khác
const materialRoutes = require('./routes/materialRoutes');
app.use('/api/materials', authMiddleware, materialRoutes);

// Middleware kiểm tra quyền admin
app.use('/api/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.send('Admin access');
});

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Trang chủ
app.get('/home', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Check kho hàng
app.get('/api/check-stock', (req, res) => {
  const query = `
      SELECT id, name, quantity, min_quantity
      FROM materials
      WHERE quantity < min_quantity
  `;
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Lỗi kiểm tra nguyên liệu', error: err });
      }
      res.status(200).json({
          message: results.length > 0 ? 'Nguyên liệu dưới mức cảnh báo.' : 'Nguyên liệu ổn định.',
          lowStock: results
      });
  });
});

// Khởi động server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
