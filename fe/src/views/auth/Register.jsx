// src/views/auth/Register.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../../components/forms/RegisterForm';

const Register = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Điều hướng nếu người dùng đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="register-container py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="text-center mb-4">
              <h1 className="display-6 fw-bold text-primary">
                <i className="bi bi-boxes me-2"></i>
                Quản lý kho hàng
              </h1>
              <p className="text-muted">Tạo tài khoản mới</p>
            </div>
            <RegisterForm />
            <div className="text-center mt-3">
              <Link to="/" className="text-decoration-none">
                <i className="bi bi-arrow-left me-1"></i>
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;