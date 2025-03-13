require('dotenv').config();

// Môi trường ứng dụng (development, production, v.v.)
const environment = process.env.NODE_ENV || 'development';

// Cấu hình cổng máy chủ
const port = process.env.PORT || 3000;  // Lấy cổng từ biến môi trường hoặc mặc định là 3000

// Cấu hình cơ sở dữ liệu (MySQL)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123123123',
  database: process.env.DB_NAME || 'quan_li',
  port: process.env.DB_PORT || 3306,
};

// Cấu hình JWT
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your_secret_key',
  expiresIn: process.env.JWT_EXPIRATION || '1h', // Token hết hạn sau 1 giờ
};

// Cấu hình các tham số liên quan đến session (nếu có)
const sessionConfig = {
  maxAge: process.env.SESSION_MAX_AGE || 3600000, // 1 giờ
};

// Các cấu hình bổ sung khác
const appConfig = {
  environment,
  port,
  dbConfig,
  jwtConfig,
  sessionConfig,
};

module.exports = appConfig;

