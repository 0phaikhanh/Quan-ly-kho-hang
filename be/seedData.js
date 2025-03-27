// seedData.js
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { User, Product, Transaction, syncDatabase } = require('./models');
const { sequelize } = require('./config/database');

// Load environment variables
dotenv.config();

// Seed Data
const seedData = async () => {
  try {
    // Kết nối tới MySQL
    await sequelize.authenticate();
    console.log('MySQL connected...');

    // Tạo bảng nếu chưa tồn tại
    await syncDatabase();

    // Xóa dữ liệu cũ
    await Transaction.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('Dữ liệu cũ đã được xóa');

    // Tạo người dùng mẫu
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('123456', salt);

    const users = await User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password,
        role: 'admin'
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        password,
        role: 'manager'
      },
      {
        name: 'Normal User',
        email: 'user@example.com',
        password,
        role: 'user'
      }
    ]);

    console.log('Người dùng mẫu đã được tạo');

    // Tạo sản phẩm mẫu
    const products = await Product.bulkCreate([
      {
        code: 'SP001',
        name: 'Màn hình Dell 24"',
        category: 'Màn hình',
        quantity: 15,
        min_quantity: 5,
        price: 4500000,
        unit: 'Cái',
        description: 'Màn hình Dell 24 inch Full HD với công nghệ IPS, độ phản hồi 5ms',
        supplier: 'Công ty ABC',
        location: 'Kho A - Kệ 1',
        status: 'active',
        created_by: users[0].id
      },
      {
        code: 'SP002',
        name: 'Laptop Dell XPS 13',
        category: 'Laptop',
        quantity: 3,
        min_quantity: 5,
        price: 35000000,
        unit: 'Cái',
        description: 'Laptop Dell XPS 13 với Intel Core i7, 16GB RAM, 512GB SSD',
        supplier: 'Công ty XYZ',
        location: 'Kho A - Kệ 2',
        status: 'low-stock',
        created_by: users[0].id
      },
      {
        code: 'SP003',
        name: 'Bàn phím Logitech MK470',
        category: 'Bàn phím',
        quantity: 25,
        min_quantity: 10,
        price: 1200000,
        unit: 'Cái',
        description: 'Bàn phím không dây Logitech MK470 với thiết kế mỏng gọn',
        supplier: 'Công ty DEF',
        location: 'Kho B - Kệ 1',
        status: 'active',
        created_by: users[1].id
      },
      {
        code: 'SP004',
        name: 'Chuột không dây Logitech M185',
        category: 'Chuột',
        quantity: 0,
        min_quantity: 5,
        price: 450000,
        unit: 'Cái',
        description: 'Chuột không dây Logitech M185 với kết nối USB',
        supplier: 'Công ty DEF',
        location: 'Kho B - Kệ 1',
        status: 'out-of-stock',
        created_by: users[1].id
      },
      {
        code: 'SP005',
        name: 'Tai nghe Sony WH-1000XM4',
        category: 'Tai nghe',
        quantity: 8,
        min_quantity: 10,
        price: 2500000,
        unit: 'Cái',
        description: 'Tai nghe chụp tai Sony WH-1000XM4 với khả năng chống ồn chủ động',
        supplier: 'Công ty GHI',
        location: 'Kho B - Kệ 2',
        status: 'low-stock',
        created_by: users[2].id
      }
    ]);

    console.log('Sản phẩm mẫu đã được tạo');

    // Tạo transaction mẫu
    await Transaction.bulkCreate([
      {
        type: 'import',
        product_id: products[0].id,
        quantity: 20,
        previous_quantity: 0,
        new_quantity: 20,
        price: products[0].price,
        note: 'Nhập kho ban đầu',
        supplier: 'Công ty ABC',
        performed_by: users[0].id
      },
      {
        type: 'export',
        product_id: products[0].id,
        quantity: 5,
        previous_quantity: 20,
        new_quantity: 15,
        price: products[0].price,
        note: 'Xuất cho khách hàng XYZ',
        customer: 'Khách hàng XYZ',
        performed_by: users[2].id
      },
      {
        type: 'import',
        product_id: products[1].id,
        quantity: 5,
        previous_quantity: 0,
        new_quantity: 5,
        price: products[1].price,
        note: 'Nhập kho ban đầu',
        supplier: 'Công ty XYZ',
        performed_by: users[1].id
      },
      {
        type: 'export',
        product_id: products[1].id,
        quantity: 2,
        previous_quantity: 5,
        new_quantity: 3,
        price: products[1].price,
        note: 'Xuất cho khách hàng ABC',
        customer: 'Khách hàng ABC',
        performed_by: users[2].id
      }
    ]);

    console.log('Transaction mẫu đã được tạo');

    console.log('Dữ liệu mẫu đã được tạo thành công');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu:', error);
    process.exit(1);
  }
};

seedData();