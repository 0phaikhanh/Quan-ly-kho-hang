// models/Transaction.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('import', 'export'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vui lòng chọn loại giao dịch'
      }
    }
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: 'Số lượng phải lớn hơn 0'
      }
    }
  },
  previous_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  new_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: {
        args: 0,
        msg: 'Giá không được âm'
      }
    }
  },
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  customer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  performed_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'transactions',
  hooks: {
    beforeCreate: (transaction) => {
      // Tự động tính total_amount
      if (transaction.price && transaction.quantity) {
        transaction.total_amount = parseFloat(transaction.price) * transaction.quantity;
      }
    }
  }
});

module.exports = Transaction;