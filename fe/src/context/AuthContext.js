// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa khi tải trang
    const checkLoggedIn = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
          setUserRole(userData.role);
        }
      } catch (err) {
        console.error('Không thể xác thực người dùng:', err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const userData = await loginUser(email, password);
      setCurrentUser(userData);
      setUserRole(userData.role);
      return userData;
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const newUser = await registerUser(userData);
      return newUser;
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserRole(null);
    } catch (err) {
      console.error('Đăng xuất thất bại:', err);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    login,
    register,
    logout,
    isAdmin: userRole === 'admin',
    isManager: userRole === 'manager',
    isUser: userRole === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;