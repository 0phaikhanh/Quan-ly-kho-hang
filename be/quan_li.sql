create database quan_li;
USE quan_li;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
drop table suppliers
CREATE TABLE suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
drop table inventory
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- ID của nguyên liệu (khóa chính)
    name VARCHAR(255) NOT NULL,                -- Tên nguyên liệu (ví dụ: da, cao su, dây giày, v.v.)
    material_type VARCHAR(100),                -- Loại nguyên liệu (ví dụ: vải, cao su, nhựa, v.v.)
    unit VARCHAR(50),                          -- Đơn vị đo (kg, m, mét, đôi, v.v.)
    quantity INT DEFAULT 0,                    -- Số lượng hiện có của nguyên liệu
    unit_price DECIMAL(10, 2) NOT NULL,        -- Giá trị đơn vị của nguyên liệu
    supplier_id INT,                           -- ID nhà cung cấp (liên kết với bảng suppliers)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   -- Thời gian tạo bản ghi
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- Thời gian cập nhật
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id)  -- Khóa ngoại liên kết tới bảng suppliers
);


CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT, -- Liên kết tới sản phẩm giày
    transaction_type ENUM('import', 'export') NOT NULL, -- Nhập hoặc xuất
    quantity INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT,  -- Liên kết tới sản phẩm giày
    quantity INT NOT NULL,  -- Số lượng bán
    total_amount DECIMAL(10, 2) NOT NULL,  -- Tổng tiền bán
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);





