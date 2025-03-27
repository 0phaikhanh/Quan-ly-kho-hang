// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  // Hiển thị loading trong khi kiểm tra xác thực
  if (loading) {
    return <Loading />;
  }

  // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Cho phép truy cập nếu đã đăng nhập
  return <Outlet />;
};

export default PrivateRoute;