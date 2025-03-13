const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const inventoryRoutes = require('./routes/inventoryRoutes');
const appConfig = require('./config/appConfig');  // Import appConfig.js

// Middleware để xử lý JSON request body
app.use(bodyParser.json());

// Import các middleware
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import các routes
const materialRoutes = require('./routes/materialRoutes');

// Middleware để xử lý body request JSON
app.use(bodyParser.json());

// Sử dụng route cho material
app.use('/api/materials', authMiddleware, materialRoutes);

// Middleware kiểm tra quyền admin
app.use('/api/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.send('Admin access');
});

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Định nghĩa route cho /home
app.get('/home', (req, res) => {
  res.send('Welcome to the Home Page!');
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});