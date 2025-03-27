// controllers/userController.js
const asyncHandler = require('express-async-handler');
const { Op } = require('sequelize');
const { User, sequelize } = require('../models');

// @desc    Lấy danh sách người dùng
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  // Xử lý filter
  const filter = {};
  
  if (req.query.role) {
    filter.role = req.query.role;
  }
  
  if (req.query.search) {
    filter[Op.or] = [
      { name: { [Op.like]: `%${req.query.search}%` } },
      { email: { [Op.like]: `%${req.query.search}%` } }
    ];
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;
  
  // Sorting
  const order = [];
  if (req.query.sortBy) {
    const sortField = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'desc' ? 'DESC' : 'ASC';
    order.push([sortField, sortOrder]);
  } else {
    order.push(['created_at', 'DESC']); // Default sort by newest
  }

  // Execute query
  const { count, rows: users } = await User.findAndCountAll({
    where: filter,
    attributes: { exclude: ['password'] },
    order,
    offset,
    limit
  });

  // Pagination result
  const pagination = {
    total: count,
    page,
    limit,
    pages: Math.ceil(count / limit)
  };

  res.json({
    success: true,
    count: users.length,
    pagination,
    data: users
  });
});

// @desc    Lấy thông tin một người dùng
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Tạo người dùng mới (bởi admin)
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('Email đã được sử dụng');
  }

  // Tạo người dùng mới
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ');
  }
});

// @desc    Cập nhật thông tin người dùng (bởi admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, password } = req.body;

  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  // Kiểm tra xem email mới đã tồn tại chưa (nếu đổi email)
  if (email && email !== user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email đã được sử dụng');
    }
  }

  // Cập nhật thông tin cơ bản
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  
  // Cập nhật mật khẩu nếu được cung cấp
  if (password) {
    user.password = password;
  }

  await user.save();

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      updatedAt: user.updated_at
    }
  });
});

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  // Không cho phép xóa tài khoản admin cuối cùng
  if (user.role === 'admin') {
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error('Không thể xóa tài khoản admin cuối cùng');
    }
  }

  // Không cho phép admin xóa chính mình
  if (user.id === req.user.id) {
    res.status(400);
    throw new Error('Không thể xóa tài khoản của chính mình');
  }

  await user.destroy();

  res.json({
    success: true,
    message: 'Xóa người dùng thành công'
  });
});

// @desc    Thay đổi vai trò người dùng
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['admin', 'manager', 'user'].includes(role)) {
    res.status(400);
    throw new Error('Vai trò không hợp lệ');
  }

  const user = await User.findByPk(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  // Không cho phép thay đổi vai trò của chính mình
  if (user.id === req.user.id) {
    res.status(400);
    throw new Error('Không thể thay đổi vai trò của chính mình');
  }

  // Không cho phép hạ cấp admin cuối cùng
  if (user.role === 'admin' && role !== 'admin') {
    const adminCount = await User.count({ where: { role: 'admin' } });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error('Không thể hạ cấp tài khoản admin cuối cùng');
    }
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Lấy thống kê người dùng (số lượng theo vai trò)
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.findAll({
    attributes: [
      'role',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['role']
  });

  // Tạo đối tượng kết quả
  const result = {
    total: 0,
    admin: 0,
    manager: 0,
    user: 0
  };

  stats.forEach(item => {
    result[item.role] = parseInt(item.getDataValue('count'));
    result.total += parseInt(item.getDataValue('count'));
  });

  res.json({
    success: true,
    data: result
  });
});