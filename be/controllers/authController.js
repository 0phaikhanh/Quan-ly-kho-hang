// controllers/authController.js
const asyncHandler = require('express-async-handler');
const { User } = require('../models');

// @desc    Đăng ký người dùng mới
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Kiểm tra xem email đã tồn tại chưa
  const userExists = await User.findOne({ where: { email } });

  if (userExists) {
    res.status(400);
    throw new Error('Email đã được sử dụng');
  }

  // Chỉ cho phép admin tạo tài khoản có quyền admin hoặc manager
  let userRole = role || 'user';
  if (userRole !== 'user' && (!req.user || req.user.role !== 'admin')) {
    userRole = 'user'; // Mặc định là user nếu không phải admin đang tạo
  }

  // Tạo người dùng mới
  const user = await User.create({
    name,
    email,
    password,
    role: userRole
  });

  if (user) {
    // Tạo token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } else {
    res.status(400);
    throw new Error('Dữ liệu người dùng không hợp lệ');
  }
});

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra email và password
  if (!email || !password) {
    res.status(400);
    throw new Error('Vui lòng nhập email và mật khẩu');
  }

  // Kiểm tra người dùng tồn tại
  const user = await User.findOne({ where: { email } });

  if (!user) {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  // Kiểm tra mật khẩu
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Email hoặc mật khẩu không chính xác');
  }

  // Tạo token
  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at
    }
  });
});

// @desc    Cập nhật thông tin cá nhân
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Kiểm tra xem email mới đã tồn tại chưa (nếu đổi email)
  if (email && email !== req.user.email) {
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      res.status(400);
      throw new Error('Email đã được sử dụng');
    }
  }

  // Tìm và cập nhật người dùng
  const user = await User.findByPk(req.user.id);
  
  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }
  
  user.name = name || user.name;
  user.email = email || user.email;
  
  await user.save();

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Đổi mật khẩu
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Kiểm tra xem đã cung cấp đủ thông tin chưa
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới');
  }

  // Kiểm tra độ dài mật khẩu mới
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự');
  }

  // Lấy thông tin người dùng
  const user = await User.findByPk(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error('Không tìm thấy người dùng');
  }

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Mật khẩu hiện tại không đúng');
  }

  // Cập nhật mật khẩu mới
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Đổi mật khẩu thành công'
  });
});