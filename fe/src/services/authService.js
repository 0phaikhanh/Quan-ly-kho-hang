// src/services/authService.js
import api from './api';
import User from '../models/userModel';

/**
 * Đăng nhập người dùng
 * @param {string} email Email đăng nhập
 * @param {string} password Mật khẩu
 * @returns {Promise<User>} Thông tin người dùng đã đăng nhập
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Lưu token vào localStorage
    localStorage.setItem('token', token);
    
    // Chuyển đổi dữ liệu JSON thành đối tượng User
    return User.fromJson(user);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Đăng nhập thất bại');
  }
};

/**
 * Đăng ký người dùng mới
 * @param {Object} userData Thông tin người dùng đăng ký
 * @returns {Promise<User>} Thông tin người dùng đã đăng ký
 */
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return User.fromJson(response.data.user);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Đăng ký thất bại');
  }
};

/**
 * Đăng xuất người dùng hiện tại
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    return true;
  } catch (error) {
    throw new Error('Đăng xuất thất bại');
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @returns {Promise<User|null>} Thông tin người dùng hoặc null nếu chưa đăng nhập
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await api.get('/auth/me');
    return User.fromJson(response.data.user);
  } catch (error) {
    // Xóa token nếu không hợp lệ
    localStorage.removeItem('token');
    return null;
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param {Object} userData Thông tin người dùng cần cập nhật
 * @returns {Promise<User>} Thông tin người dùng sau khi cập nhật
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return User.fromJson(response.data.user);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Cập nhật thông tin thất bại');
  }
};

/**
 * Đổi mật khẩu người dùng
 * @param {string} currentPassword Mật khẩu hiện tại
 * @param {string} newPassword Mật khẩu mới
 * @returns {Promise<boolean>} Kết quả đổi mật khẩu
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    await api.post('/auth/change-password', { currentPassword, newPassword });
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Đổi mật khẩu thất bại');
  }
};