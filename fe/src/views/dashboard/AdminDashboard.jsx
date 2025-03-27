// src/views/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Admin Dashboard hiển thị thông tin quản trị và phân quyền người dùng
const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    roles: {
      admin: 0,
      manager: 0,
      user: 0
    },
    recentUsers: [],
    pendingApprovals: []
  });

  // Giả lập việc lấy dữ liệu thống kê từ API
  useEffect(() => {
    // Trong thực tế, đây sẽ là một API call
    const fetchStats = async () => {
      // Demo data
      setStats({
        totalUsers: 24,
        roles: {
          admin: 2,
          manager: 5,
          user: 17
        },
        recentUsers: [
          { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'user', createdAt: '2024-03-25' },
          { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'manager', createdAt: '2024-03-23' },
          { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'user', createdAt: '2024-03-20' }
        ],
        pendingApprovals: [
          { id: 4, name: 'Phạm Văn D', email: 'phamvand@example.com', requestedRole: 'manager', createdAt: '2024-03-26' },
          { id: 5, name: 'Hoàng Thị E', email: 'hoangthie@example.com', requestedRole: 'user', createdAt: '2024-03-26' }
        ]
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="container py-4">
        <h1 className="mb-4">Quản trị hệ thống</h1>
        
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Tổng người dùng</h5>
                <h2 className="card-text">{stats.totalUsers}</h2>
                <Link to="/admin/users" className="text-white">Quản lý người dùng</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card bg-success text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Quản lý</h5>
                <h2 className="card-text">{stats.roles.manager}</h2>
                <Link to="/admin/users?role=manager" className="text-white">Xem danh sách</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card bg-info text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Nhân viên kho</h5>
                <h2 className="card-text">{stats.roles.user}</h2>
                <Link to="/admin/users?role=user" className="text-white">Xem danh sách</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-3">
            <div className="card bg-warning text-dark mb-3">
              <div className="card-body">
                <h5 className="card-title">Yêu cầu phê duyệt</h5>
                <h2 className="card-text">{stats.pendingApprovals.length}</h2>
                <Link to="/admin/approvals" className="text-dark">Xem yêu cầu</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Người dùng gần đây</h5>
                <Link to="/admin/users" className="btn btn-sm btn-outline-primary">Xem tất cả</Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${
                              user.role === 'admin' ? 'bg-danger' : 
                              user.role === 'manager' ? 'bg-success' : 'bg-info'
                            }`}>
                              {user.role === 'admin' ? 'Quản trị viên' : 
                               user.role === 'manager' ? 'Quản lý' : 'Nhân viên kho'}
                            </span>
                          </td>
                          <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <div className="btn-group">
                              <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button className="btn btn-sm btn-outline-danger">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Yêu cầu phê duyệt</h5>
                <Link to="/admin/approvals" className="btn btn-sm btn-outline-warning">Xem tất cả</Link>
              </div>
              <div className="card-body">
                {stats.pendingApprovals.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Tên</th>
                          <th>Email</th>
                          <th>Yêu cầu vai trò</th>
                          <th>Ngày yêu cầu</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.pendingApprovals.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                              <span className={`badge ${
                                user.requestedRole === 'admin' ? 'bg-danger' : 
                                user.requestedRole === 'manager' ? 'bg-success' : 'bg-info'
                              }`}>
                                {user.requestedRole === 'admin' ? 'Quản trị viên' : 
                                 user.requestedRole === 'manager' ? 'Quản lý' : 'Nhân viên kho'}
                              </span>
                            </td>
                            <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td>
                              <div className="btn-group">
                                <button className="btn btn-sm btn-success">
                                  <i className="bi bi-check"></i> Duyệt
                                </button>
                                <button className="btn btn-sm btn-danger">
                                  <i className="bi bi-x"></i> Từ chối
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-3">Không có yêu cầu phê duyệt nào</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Quản lý người dùng</h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <Link to="/admin/users/add" className="btn btn-primary">
                    <i className="bi bi-person-plus me-2"></i> Thêm người dùng mới
                  </Link>
                  <Link to="/admin/roles" className="btn btn-info text-white">
                    <i className="bi bi-gear me-2"></i> Quản lý vai trò
                  </Link>
                  <Link to="/admin/permissions" className="btn btn-secondary">
                    <i className="bi bi-shield-lock me-2"></i> Quản lý quyền hạn
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Thống kê người dùng</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6>Phân bố vai trò</h6>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-danger" 
                      role="progressbar" 
                      style={{ width: `${(stats.roles.admin / stats.totalUsers * 100).toFixed(1)}%` }} 
                      aria-valuenow={stats.roles.admin} 
                      aria-valuemin="0" 
                      aria-valuemax={stats.totalUsers}
                    >
                      Admin ({stats.roles.admin})
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${(stats.roles.manager / stats.totalUsers * 100).toFixed(1)}%` }} 
                      aria-valuenow={stats.roles.manager} 
                      aria-valuemin="0" 
                      aria-valuemax={stats.totalUsers}
                    >
                      Manager ({stats.roles.manager})
                    </div>
                  </div>
                  <div className="progress mb-2">
                    <div 
                      className="progress-bar bg-info" 
                      role="progressbar" 
                      style={{ width: `${(stats.roles.user / stats.totalUsers * 100).toFixed(1)}%` }} 
                      aria-valuenow={stats.roles.user} 
                      aria-valuemin="0" 
                      aria-valuemax={stats.totalUsers}
                    >
                      User ({stats.roles.user})
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Nhật ký hoạt động</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Cập nhật quyền người dùng</strong>
                        <p className="text-muted small mb-0">Admin đã thay đổi quyền của Trần Thị B</p>
                      </div>
                      <small className="text-muted">Hôm nay, 10:45</small>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Thêm người dùng mới</strong>
                        <p className="text-muted small mb-0">Người dùng Hoàng Thị E đã được tạo</p>
                      </div>
                      <small className="text-muted">Hôm nay, 09:30</small>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Cập nhật hệ thống</strong>
                        <p className="text-muted small mb-0">Cập nhật phiên bản v1.2.0</p>
                      </div>
                      <small className="text-muted">Hôm qua, 15:20</small>
                    </div>
                  </li>
                </ul>
                <div className="text-center mt-3">
                  <Link to="/admin/logs" className="btn btn-sm btn-outline-secondary">Xem tất cả nhật ký</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;