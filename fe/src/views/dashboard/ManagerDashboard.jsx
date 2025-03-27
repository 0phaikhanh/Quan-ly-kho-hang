// src/views/dashboard/ManagerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Manager Dashboard hiển thị thông tin tổng quan và các chức năng quản lý kho
const ManagerDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    lastReceived: []
  });

  // Giả lập việc lấy dữ liệu thống kê từ API
  useEffect(() => {
    // Trong thực tế, đây sẽ là một API call
    const fetchStats = async () => {
      // Demo data
      setStats({
        totalProducts: 152,
        lowStockProducts: 8,
        pendingOrders: 5,
        lastReceived: [
          { id: 'PO2403-001', date: '2024-03-25', items: 12, supplier: 'Công ty ABC' },
          { id: 'PO2403-002', date: '2024-03-23', items: 8, supplier: 'Công ty XYZ' },
          { id: 'PO2403-003', date: '2024-03-20', items: 15, supplier: 'Công ty DEF' }
        ]
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="manager-dashboard">
      <div className="container py-4">
        <h1 className="mb-4">Quản lý kho hàng</h1>
        
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Tổng sản phẩm</h5>
                <h2 className="card-text">{stats.totalProducts}</h2>
                <Link to="/inventory" className="text-white">Xem danh sách</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-warning text-dark mb-3">
              <div className="card-body">
                <h5 className="card-title">Sản phẩm sắp hết</h5>
                <h2 className="card-text">{stats.lowStockProducts}</h2>
                <Link to="/inventory?filter=low-stock" className="text-dark">Kiểm tra ngay</Link>
              </div>
            </div>
          </div>
          
          <div className="col-md-4">
            <div className="card bg-info text-white mb-3">
              <div className="card-body">
                <h5 className="card-title">Đơn hàng chờ xử lý</h5>
                <h2 className="card-text">{stats.pendingOrders}</h2>
                <Link to="/orders?status=pending" className="text-white">Xử lý đơn hàng</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-6">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Hàng hóa nhận gần đây</h5>
                <Link to="/inventory/receiving" className="btn btn-sm btn-outline-primary">Nhập hàng mới</Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Mã đơn</th>
                        <th>Ngày nhận</th>
                        <th>SL mặt hàng</th>
                        <th>Nhà cung cấp</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.lastReceived.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{new Date(order.date).toLocaleDateString('vi-VN')}</td>
                          <td>{order.items}</td>
                          <td>{order.supplier}</td>
                          <td>
                            <Link to={`/inventory/receiving/${order.id}`} className="btn btn-sm btn-outline-secondary">
                              Chi tiết
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Thao tác nhanh</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <Link to="/inventory/add" className="btn btn-primary d-block p-3">
                      <i className="bi bi-plus-circle me-2"></i>
                      Thêm sản phẩm mới
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/inventory/export" className="btn btn-success d-block p-3">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Xuất kho hàng
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/inventory/stock-take" className="btn btn-info d-block p-3 text-white">
                      <i className="bi bi-clipboard-check me-2"></i>
                      Kiểm kê kho
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/reports" className="btn btn-secondary d-block p-3">
                      <i className="bi bi-graph-up me-2"></i>
                      Báo cáo tồn kho
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mt-3">
              <div className="card-header">
                <h5 className="mb-0">Tìm kiếm sản phẩm</h5>
              </div>
              <div className="card-body">
                <div className="input-group mb-3">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nhập mã hoặc tên sản phẩm..." 
                    aria-label="Tìm kiếm sản phẩm" 
                  />
                  <button className="btn btn-outline-primary" type="button">
                    <i className="bi bi-search"></i> Tìm
                  </button>
                </div>
                <div className="small text-muted">
                  Nhập mã sản phẩm, tên hoặc mô tả để tìm kiếm nhanh
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;