// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Hệ thống quản lý kho hàng</h5>
            <p className="text-muted">
              Giải pháp quản lý kho hàng hiệu quả, giúp doanh nghiệp tối ưu hóa quy trình nhập xuất kho, 
              kiểm soát tồn kho và nâng cao hiệu suất làm việc.
            </p>
          </div>
          
          <div className="col-md-3">
            <h5>Liên kết</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-muted">Trang chủ</Link></li>
              <li><Link to="/inventory" className="text-decoration-none text-muted">Kho hàng</Link></li>
              <li><Link to="/reports" className="text-decoration-none text-muted">Báo cáo</Link></li>
              <li><Link to="/profile" className="text-decoration-none text-muted">Tài khoản</Link></li>
            </ul>
          </div>
          
          <div className="col-md-3">
            <h5>Trợ giúp</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-decoration-none text-muted">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="text-decoration-none text-muted">Liên hệ hỗ trợ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="row mt-3 border-top pt-3">
          <div className="col text-center">
            <p className="mb-0">© {currentYear} Hệ thống quản lý kho hàng. Tất cả các quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;