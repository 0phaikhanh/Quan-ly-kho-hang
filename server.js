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

//route 
app.get('/home', (req, res) => {
  res.send('Welcome to the Home Page!');
});

//check kho
app.get('/api/check-stock', (req, res) => {
  res.json({ message: 'Stock check API is working.' });
  const query = `
      SELECT id, name, quantity, min_quantity
      FROM materials
      WHERE quantity < min_quantity
  `;

  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'Loi kiem tra nguyen lieu', error: err });
      }

      if (results.length > 0) {
          res.status(200).json({
              message: 'Nguyen lieu duoi day o muc canh bao.',
              lowStock: results
          });
      } else {
          res.status(200).json({
              message: 'Nguyen lieu on dinh.'
          });
      }
  });
});


// Khởi động server
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});