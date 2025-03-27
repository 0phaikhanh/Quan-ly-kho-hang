// src/components/common/Loading.jsx
import React from 'react';

const Loading = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '300px' }}>
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Đang tải...</p>
    </div>
  );
};

export default Loading;