// src/components/forms/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      
      // Điều hướng dựa trên vai trò
      if (isAdmin) {
        navigate('/dashboard/admin');
      } else if (isManager) {
        navigate('/dashboard/manager');
      } else {
        navigate('/dashboard/user');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="card shadow border-0 rounded-lg">
        <div className="card-header bg-primary text-white text-center py-4">
          <h3 className="font-weight-light my-1">Đăng nhập</h3>
        </div>
        <div className="card-body p-4 p-md-5">
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email</label>
            </div>
            
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Mật khẩu</label>
            </div>
            
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">
                Ghi nhớ đăng nhập
              </label>
            </div>
            
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang đăng nhập...
                  </>
                ) : 'Đăng nhập'}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <div className="small mb-2">
              <Link to="/forgot-password" className="text-decoration-none">Quên mật khẩu?</Link>
            </div>
            <div className="small">
              Chưa có tài khoản? <Link to="/register" className="fw-bold text-decoration-none">Đăng ký ngay</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;