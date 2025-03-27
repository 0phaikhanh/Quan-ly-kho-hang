// src/views/inventory/InventoryList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const InventoryList = () => {
  const { userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, low-stock, out-of-stock
  const [sortBy, setSortBy] = useState('name'); // name, quantity, price
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  // Giả lập việc lấy dữ liệu sản phẩm từ API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Trong thực tế, đây sẽ là một API call
        // Demo data
        const demoProducts = [
          { id: 1, code: 'SP001', name: 'Màn hình Dell 24"', category: 'Màn hình', quantity: 15, minQuantity: 5, price: 4500000, unit: 'Cái', status: 'active' },
          { id: 2, code: 'SP002', name: 'Laptop Dell XPS 13', category: 'Laptop', quantity: 3, minQuantity: 5, price: 35000000, unit: 'Cái', status: 'low-stock' },
          { id: 3, code: 'SP003', name: 'Bàn phím Logitech', category: 'Bàn phím', quantity: 25, minQuantity: 10, price: 1200000, unit: 'Cái', status: 'active' },
          { id: 4, code: 'SP004', name: 'Chuột không dây', category: 'Chuột', quantity: 0, minQuantity: 5, price: 450000, unit: 'Cái', status: 'out-of-stock' },
          { id: 5, code: 'SP005', name: 'Tai nghe Sony', category: 'Tai nghe', quantity: 8, minQuantity: 10, price: 2500000, unit: 'Cái', status: 'low-stock' },
        ];
        
        setProducts(demoProducts);
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Lọc và sắp xếp sản phẩm
  const filteredAndSortedProducts = () => {
    let result = [...products];
    
    // Lọc theo trạng thái
    if (filter === 'low-stock') {
      result = result.filter(p => p.status === 'low-stock');
    } else if (filter === 'out-of-stock') {
      result = result.filter(p => p.status === 'out-of-stock');
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.code.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    
    // Sắp xếp
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'quantity') {
        comparison = a.quantity - b.quantity;
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  };

  // Format tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Xử lý thay đổi sắp xếp
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Icon cho sắp xếp
  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  // Hiển thị trạng thái sản phẩm
  const renderStatus = (product) => {
    if (product.quantity === 0) {
      return <span className="badge bg-danger">Hết hàng</span>;
    } else if (product.quantity < product.minQuantity) {
      return <span className="badge bg-warning text-dark">Sắp hết</span>;
    } else {
      return <span className="badge bg-success">Còn hàng</span>;
    }
  };

  // Kiểm tra nếu người dùng có quyền sửa/xóa
  const canEdit = userRole === 'admin' || userRole === 'user';

  return (
    <div className="inventory-list-container">
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Danh sách sản phẩm trong kho</h1>
          {canEdit && (
            <Link to="/inventory/add" className="btn btn-primary">
              <i className="bi bi-plus-circle me-1"></i> Thêm sản phẩm mới
            </Link>
          )}
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3 mb-md-0">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm tên, mã hoặc loại sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-outline-secondary" type="button">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>
              <div className="col-md-3 mb-3 mb-md-0">
                <select 
                  className="form-select" 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="low-stock">Sắp hết hàng</option>
                  <option value="out-of-stock">Hết hàng</option>
                </select>
              </div>
              <div className="col-md-3">
                <select 
                  className="form-select" 
                  value={`${sortBy}-${sortOrder}`} 
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                >
                  <option value="name-asc">Tên A-Z</option>
                  <option value="name-desc">Tên Z-A</option>
                  <option value="quantity-asc">Số lượng tăng dần</option>
                  <option value="quantity-desc">Số lượng giảm dần</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải danh sách sản phẩm...</p>
          </div>
        ) : (
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th onClick={() => handleSort('code')} style={{ cursor: 'pointer' }}>
                        Mã sản phẩm {getSortIcon('code')}
                      </th>
                      <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                        Tên sản phẩm {getSortIcon('name')}
                      </th>
                      <th>Loại</th>
                      <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                        Số lượng {getSortIcon('quantity')}
                      </th>
                      <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                        Đơn giá {getSortIcon('price')}
                      </th>
                      <th>Trạng thái</th>
                      {canEdit && <th className="text-center">Thao tác</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedProducts().length > 0 ? (
                      filteredAndSortedProducts().map(product => (
                        <tr key={product.id}>
                          <td>{product.code}</td>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>
                            {product.quantity} {product.unit}
                          </td>
                          <td>{formatCurrency(product.price)}</td>
                          <td>{renderStatus(product)}</td>
                          {canEdit && (
                            <td className="text-center">
                              <div className="btn-group">
                                <Link to={`/inventory/edit/${product.id}`} className="btn btn-sm btn-outline-primary">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <Link to={`/inventory/detail/${product.id}`} className="btn btn-sm btn-outline-info">
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <button className="btn btn-sm btn-outline-danger">
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={canEdit ? 7 : 6} className="text-center py-4">
                          Không tìm thấy sản phẩm nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  Hiển thị <b>{filteredAndSortedProducts().length}</b> trên tổng số <b>{products.length}</b> sản phẩm
                </div>
                <div>
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      <li className="page-item disabled">
                        <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Trước</a>
                      </li>
                      <li className="page-item active"><a className="page-link" href="#">1</a></li>
                      <li className="page-item"><a className="page-link" href="#">2</a></li>
                      <li className="page-item"><a className="page-link" href="#">3</a></li>
                      <li className="page-item">
                        <a className="page-link" href="#">Tiếp</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;