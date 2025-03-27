// src/views/auth/Login.jsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/forms/LoginForm';

const Login = () => {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông báo từ trang đăng ký (nếu có)
  const message = location.state?.message || '';
  
  // Điều hướng nếu người dùng đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      switch (userRole) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'manager':
          navigate('/dashboard/manager');
          break;
        default:
          navigate('/dashboard/user');
          break;
      }
    }
  }, [currentUser, userRole, navigate]);

  return (
    <div className="login-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            {message && (
              <div className="alert alert-success mb-4">
                <i className="bi bi-check-circle-fill me-2"></i>
                {message}
              </div>
            )}
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold text-primary">
                <i className="bi bi-boxes me-2"></i>
                Quản lý kho hàng
              </h1>
              <p className="text-muted">Đăng nhập để tiếp tục</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;