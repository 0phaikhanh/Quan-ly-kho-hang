// src/views/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container py-5">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Trang không tìm thấy.
        </p>
        <p className="lead">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <div className="mt-4">
          <Link to="/" className="btn btn-primary me-2">
            <i className="bi bi-house-door me-2"></i>
            Về trang chủ
          </Link>
          <Link to="/inventory" className="btn btn-outline-primary">
            <i className="bi bi-box me-2"></i>
            Xem kho hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;