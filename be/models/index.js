// models/index.js
const User = require('./User');
const Product = require('./Product');
const Transaction = require('./Transaction');
const { sequelize } = require('../config/database');

// Định nghĩa các mối quan hệ giữa các model
User.hasMany(Product, { foreignKey: 'created_by', as: 'products' });
Product.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Product.hasMany(Transaction, { foreignKey: 'product_id', as: 'transactions' });
Transaction.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Transaction, { foreignKey: 'performed_by', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'performed_by', as: 'performer' });

// Tạo bảng trong database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

module.exports = {
  User,
  Product,
  Transaction,
  syncDatabase
};