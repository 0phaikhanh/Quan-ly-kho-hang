// models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Mã sản phẩm đã tồn tại'
    },
    validate: {
      notEmpty: {
        msg: 'Vui lòng nhập mã sản phẩm'
      }
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vui lòng nhập tên sản phẩm'
      },
      len: {
        args: [2, 200],
        msg: 'Tên sản phẩm phải có từ 2 đến 200 ký tự'
      }
    }
  },
  category: {
    type: DataTypes.ENUM(
      'Màn hình',
      'Laptop',
      'Bàn phím',
      'Chuột',
      'Tai nghe',
      'Thiết bị mạng',
      'Linh kiện',
      'Phụ kiện',
      'Khác'
    ),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Vui lòng chọn loại sản phẩm'
      }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: 0,
        msg: 'Số lượng không được âm'
      }
    }
  },
  min_quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: 0,
        msg: 'Số lượng tối thiểu không được âm'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: {
        args: 0,
        msg: 'Giá không được âm'
      }
    }
  },
  unit: {
    type: DataTypes.ENUM('Cái', 'Hộp', 'Thùng', 'Kg', 'Gói', 'Lít', 'Mét', 'Bộ'),
    defaultValue: 'Cái'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('images');
      return value ? JSON.parse(value) : [];
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val));
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'low-stock', 'out-of-stock'),
    defaultValue: 'active'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'products',
  hooks: {
    beforeSave: async (product) => {
      // Cập nhật trạng thái dựa trên số lượng
      if (product.quantity <= 0) {
        product.status = 'out-of-stock';
      } else if (product.quantity <= product.min_quantity) {
        product.status = 'low-stock';
      } else {
        product.status = 'active';
      }
    }
  }
});

module.exports = Product;