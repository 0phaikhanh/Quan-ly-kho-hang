// src/routes/RoleRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

const RoleRoute = ({ allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  // Hiển thị loading trong khi kiểm tra xác thực
  if (loading) {
    return <Loading />;
  }

  // Điều hướng đến trang đăng nhập nếu chưa đăng nhập
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Kiểm tra quyền truy cập
  if (!allowedRoles.includes(userRole)) {
    // Điều hướng về dashboard tương ứng với vai trò
    switch (userRole) {
      case 'admin':
        return <Navigate to="/dashboard/admin" />;
      case 'manager':
        return <Navigate to="/dashboard/manager" />;
      default:
        return <Navigate to="/dashboard/user" />;
    }
  }

  // Cho phép truy cập nếu có quyền
  return <Outlet />;
};

export default RoleRoute;