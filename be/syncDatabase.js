// syncDatabase.js
const dotenv = require('dotenv');
const { sequelize } = require('./config/database');
const { syncDatabase } = require('./models');

// Load environment variables
dotenv.config();

// Tạo database và bảng
const initializeDatabase = async () => {
  try {
    // Kết nối tới MySQL
    await sequelize.authenticate();
    console.log('MySQL connected...');

    // Tạo bảng
    await syncDatabase();
    console.log('Tables created successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();