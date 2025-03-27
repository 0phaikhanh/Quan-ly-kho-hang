// src/services/userService.js
import api from './api';

/**
 * Lấy danh sách người dùng
 * @param {Object} params Tham số truy vấn (search, page, limit, sortBy, sortOrder, role)
 * @returns {Promise<Object>} Danh sách người dùng và thông tin phân trang
 */
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Không thể lấy danh sách người dùng');
  }
};

/**
 * Lấy chi tiết người dùng
 * @param {string} id ID người dùng
 * @returns {Promise<Object>} Thông tin người dùng
 */
export const getUser = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Không thể lấy thông tin người dùng');
  }
};

/**
 * Tạo người dùng mới (chỉ dành cho admin)
 * @param {Object} userData Thông tin người dùng
 * @returns {Promise<Object>} Người dùng đã tạo
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Tạo người dùng thất bại');
  }
};

/**
 * Cập nhật thông tin người dùng (chỉ dành cho admin)
 * @param {string} id ID người dùng
 * @param {Object} userData Thông tin cần cập nhật
 * @returns {Promise<Object>} Người dùng đã cập nhật
 */
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Cập nhật người dùng thất bại');
  }
};

/**
 * Xóa người dùng (chỉ dành cho admin)
 * @param {string} id ID người dùng
 * @returns {Promise<Object>} Kết quả xóa
 */
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Xóa người dùng thất bại');
  }
};

/**
 * Thay đổi vai trò người dùng (chỉ dành cho admin)
 * @param {string} id ID người dùng
 * @param {string} role Vai trò mới ('admin', 'manager', 'user')
 * @returns {Promise<Object>} Người dùng sau khi cập nhật
 */
export const changeUserRole = async (id, role) => {
  try {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Thay đổi vai trò thất bại');
  }
};

/**
 * Lấy thống kê người dùng (chỉ dành cho admin)
 * @returns {Promise<Object>} Thống kê người dùng
 */
export const getUserStats = async () => {
  try {
    const response = await api.get('/users/stats');
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Không thể lấy thống kê người dùng');
  }
};