import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ role, children }) => {
  const { user } = useContext(AuthContext);

  // Nếu chưa đăng nhập, chuyển hướng đến login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập nhưng không đúng vai trò, chuyển về trang chính
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
