// routes/users.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  getUserStats
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/auth');

// Áp dụng middleware xác thực admin cho tất cả routes
router.use(protect);
router.use(isAdmin);

// Get all users and create user
router.route('/')
  .get(getUsers)
  .post(createUser);

// Get stats
router.get('/stats', getUserStats);

// Get, update and delete specific user
router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

// Change user role
router.put('/:id/role', changeUserRole);

module.exports = router;