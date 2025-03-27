// src/views/inventory/AddProduct.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AddProduct = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();

  // State cho form thêm sản phẩm
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    quantity: 0,
    minQuantity: 0,
    price: 0,
    unit: 'Cái',
    description: '',
    supplier: '',
    location: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Danh sách các đơn vị tính
  const units = ['Cái', 'Hộp', 'Thùng', 'Kg', 'Gói', 'Lít', 'Mét', 'Bộ'];

  // Danh sách các loại sản phẩm
  const categories = ['Màn hình', 'Laptop', 'Bàn phím', 'Chuột', 'Tai nghe', 'Thiết bị mạng', 'Linh kiện', 'Phụ kiện'];

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Xử lý giá trị số
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Xóa lỗi khi người dùng đã sửa
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Xử lý tải lên hình ảnh
  const handleImageUpload = (e) => {
    // Trong thực tế, đây sẽ là một xử lý tải lên file
    // Hiện tại chỉ lưu tên file
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files.map(file => file.name)
    });
  };

  // Kiểm tra dữ liệu hợp lệ
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code.trim()) {
      newErrors.code = 'Mã sản phẩm không được để trống';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }
    
    if (!formData.category) {
      newErrors.category = 'Vui lòng chọn loại sản phẩm';
    }
    
    if (formData.quantity < 0) {
      newErrors.quantity = 'Số lượng không được âm';
    }
    
    if (formData.minQuantity < 0) {
      newErrors.minQuantity = 'Số lượng tối thiểu không được âm';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'Giá sản phẩm phải lớn hơn 0';
    }
    
    setErrors(newErrors);
    
    // Form hợp lệ nếu không có lỗi
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Trong thực tế, đây sẽ là một API call để lưu sản phẩm
      // Giả lập thành công
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        navigate('/inventory');
      }, 2000);
    } catch (error) {
      setErrors({
        submit: 'Có lỗi xảy ra. Vui lòng thử lại sau.'
      });
      console.error('Error adding product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Thêm sản phẩm mới</h5>
              </div>
              
              <div className="card-body">
                {success ? (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Thêm sản phẩm thành công. Đang chuyển hướng về trang danh sách...
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {errors.submit && (
                      <div className="alert alert-danger">
                        {errors.submit}
                      </div>
                    )}
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="code" className="form-label">Mã sản phẩm <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                          id="code"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          required
                        />
                        {errors.code && <div className="invalid-feedback">{errors.code}</div>}
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="name" className="form-label">Tên sản phẩm <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="category" className="form-label">Loại sản phẩm <span className="text-danger">*</span></label>
                        <select
                          className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Chọn loại sản phẩm --</option>
                          {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                          <option value="other">Khác</option>
                        </select>
                        {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                      </div>
                      
                      <div className="col-md-3">
                        <label htmlFor="quantity" className="form-label">Số lượng <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                          id="quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                        {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                      </div>
                      
                      <div className="col-md-3">
                        <label htmlFor="unit" className="form-label">Đơn vị tính</label>
                        <select
                          className="form-select"
                          id="unit"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                        >
                          {units.map((unit, index) => (
                            <option key={index} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="price" className="form-label">Đơn giá (VNĐ) <span className="text-danger">*</span></label>
                        <input
                          type="number"
                          className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          min="0"
                          required
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="minQuantity" className="form-label">Số lượng tối thiểu</label>
                        <input
                          type="number"
                          className={`form-control ${errors.minQuantity ? 'is-invalid' : ''}`}
                          id="minQuantity"
                          name="minQuantity"
                          value={formData.minQuantity}
                          onChange={handleChange}
                          min="0"
                        />
                        <div className="form-text">Số lượng tối thiểu để cảnh báo sắp hết hàng</div>
                        {errors.minQuantity && <div className="invalid-feedback">{errors.minQuantity}</div>}
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="supplier" className="form-label">Nhà cung cấp</label>
                        <input
                          type="text"
                          className="form-control"
                          id="supplier"
                          name="supplier"
                          value={formData.supplier}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Vị trí trong kho</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="VD: Kệ A, Hàng 2"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Mô tả sản phẩm</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="images" className="form-label">Hình ảnh sản phẩm</label>
                      <input
                        type="file"
                        className="form-control"
                        id="images"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                      <div className="form-text">Có thể chọn nhiều hình ảnh</div>
                      
                      {formData.images.length > 0 && (
                        <div className="mt-2">
                          <p>Đã chọn {formData.images.length} hình ảnh:</p>
                          <ul className="list-unstyled">
                            {formData.images.map((image, index) => (
                              <li key={index}><i className="bi bi-image me-2"></i>{image}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <button
                        type="button"
                        className="btn btn-secondary me-2"
                        onClick={() => navigate('/inventory')}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang lưu...
                          </>
                        ) : 'Lưu sản phẩm'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;