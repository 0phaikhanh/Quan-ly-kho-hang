// src/components/common/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, userRole, isAdmin, isManager, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-boxes me-2"></i>
            Quản lý kho hàng
          </Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            {currentUser ? (
              <>
                <ul className="navbar-nav me-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={`/dashboard/${userRole}`}>
                      <i className="bi bi-speedometer2 me-1"></i> Dashboard
                    </Link>
                  </li>
                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/inventory">
                      <i className="bi bi-box me-1"></i> Kho hàng
                    </Link>
                  </li>
                  
                  {(isAdmin || isManager) && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/reports">
                        <i className="bi bi-graph-up me-1"></i> Báo cáo
                      </Link>
                    </li>
                  )}
                  
                  {isAdmin && (
                    <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#" id="navbarAdminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-shield-lock me-1"></i> Quản trị
                      </a>
                      <ul className="dropdown-menu" aria-labelledby="navbarAdminDropdown">
                        <li>
                          <Link className="dropdown-item" to="/admin/users">
                            <i className="bi bi-people me-2"></i> Quản lý người dùng
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/admin/roles">
                            <i className="bi bi-person-badge me-2"></i> Phân quyền
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <Link className="dropdown-item" to="/admin/settings">
                            <i className="bi bi-gear me-2"></i> Cài đặt hệ thống
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                </ul>
                
                <ul className="navbar-nav">
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarUserDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <i className="bi bi-person-circle me-1"></i> {currentUser.name || 'Tài khoản'}
                      {userRole && (
                        <span className="badge rounded-pill bg-light text-dark ms-2">
                          {userRole === 'admin' ? 'Admin' : 
                           userRole === 'manager' ? 'Quản lý' : 'Nhân viên'}
                        </span>
                      )}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarUserDropdown">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <i className="bi bi-person me-2"></i> Hồ sơ cá nhân
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/change-password">
                          <i className="bi bi-key me-2"></i> Đổi mật khẩu
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>
                          <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            ) : (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i> Đăng ký
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;