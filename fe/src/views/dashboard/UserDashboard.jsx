// src/views/dashboard/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// User Dashboard - Cho nhân viên quản lý kho, thêm sửa xóa nguyên liệu
const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [recentProducts, setRecentProducts] = useState([]);
  const [materialsToUpdate, setMaterialsToUpdate] = useState([]);

  // Giả lập việc lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    // Trong thực tế, đây sẽ là một API call
    const fetchData = async () => {
      // Demo data cho sản phẩm gần đây đã thêm/sửa
      setRecentProducts([
        { id: 1, code: 'SP001', name: 'Màn hình Dell 24"', action: 'Thêm mới', date: '2024-03-25 14:30', quantity: 10 },
        { id: 2, code: 'SP015', name: 'Bàn phím Logitech', action: 'Cập nhật', date: '2024-03-24 10:15', quantity: 25 },
        { id: 3, code: 'SP023', name: 'Chuột không dây', action: 'Xuất kho', date: '2024-03-22 16:45', quantity: -5 }
      ]);

      // Demo data cho nguyên liệu cần cập nhật
      setMaterialsToUpdate([
        { id: 1, code: 'NL101', name: 'Linh kiện A', currentStock: 15, minStock: 20, status: 'Thấp' },
        { id: 2, code: 'NL205', name: 'Vật liệu B', currentStock: 8, minStock: 10, status: 'Thấp' },
        { id: 3, code: 'NL310', name: 'Phụ kiện C', currentStock: 2, minStock: 15, status: 'Cạn kiệt' }
      ]);
    };

    fetchData();
  }, []);

  return (
    <div className="user-dashboard">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Quản lý kho</h1>
          <div>
            <Link to="/inventory/add" className="btn btn-primary me-2">
              <i className="bi bi-plus-circle me-1"></i> Thêm nguyên liệu mới
            </Link>
            <Link to="/inventory/export" className="btn btn-success">
              <i className="bi bi-box-arrow-right me-1"></i> Xuất kho
            </Link>
          </div>
        </div>
        
        <div className="row">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Các thao tác gần đây</h5>
                <Link to="/inventory/history" className="btn btn-sm btn-outline-primary">Xem tất cả</Link>
              </div>
              <div className="card-body">
                {recentProducts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Mã</th>
                          <th>Tên nguyên liệu</th>
                          <th>Thao tác</th>
                          <th>Số lượng</th>
                          <th>Thời gian</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.map(product => (
                          <tr key={product.id}>
                            <td>{product.code}</td>
                            <td>{product.name}</td>
                            <td>
                              <span className={`badge ${
                                product.action === 'Thêm mới' ? 'bg-success' : 
                                product.action === 'Cập nhật' ? 'bg-primary' : 
                                product.action === 'Xuất kho' ? 'bg-warning' : 'bg-secondary'
                              }`}>
                                {product.action}
                              </span>
                            </td>
                            <td className={product.quantity < 0 ? 'text-danger' : 'text-success'}>
                              {product.quantity > 0 ? '+' + product.quantity : product.quantity}
                            </td>
                            <td>{new Date(product.date).toLocaleString('vi-VN')}</td>
                            <td>
                              <Link to={`/inventory/edit/${product.id}`} className="btn btn-sm btn-outline-primary">
                                <i className="bi bi-pencil"></i>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-3">Không có thao tác gần đây</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Thao tác nhanh</h5>
              </div>
              <div className="card-body">
                <div className="list-group">
                  <Link to="/inventory" className="list-group-item list-group-item-action">
                    <i className="bi bi-box me-2"></i> Xem tất cả nguyên liệu
                  </Link>
                  <Link to="/inventory/add" className="list-group-item list-group-item-action">
                    <i className="bi bi-plus-circle me-2"></i> Thêm nguyên liệu mới
                  </Link>
                  <Link to="/inventory/import" className="list-group-item list-group-item-action">
                    <i className="bi bi-box-arrow-in-down me-2"></i> Nhập kho
                  </Link>
                  <Link to="/inventory/export" className="list-group-item list-group-item-action">
                    <i className="bi bi-box-arrow-right me-2"></i> Xuất kho
                  </Link>
                  <Link to="/inventory/check" className="list-group-item list-group-item-action">
                    <i className="bi bi-clipboard-check me-2"></i> Kiểm kê kho
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">Nguyên liệu cần bổ sung</h5>
              </div>
              <div className="card-body">
                {materialsToUpdate.length > 0 ? (
                  <div className="list-group">
                    {materialsToUpdate.map(material => (
                      <div key={material.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-bold">{material.name}</div>
                          <small className="text-muted">{material.code}</small>
                        </div>
                        <div className="text-end">
                          <div className={`badge ${
                            material.status === 'Cạn kiệt' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}>
                            {material.currentStock}/{material.minStock}
                          </div>
                          <div>
                            <Link to={`/inventory/import/${material.id}`} className="btn btn-sm btn-outline-primary mt-1">
                              Nhập thêm
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-3">Tất cả nguyên liệu đều đủ</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;