const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/dbConfig');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwtConfig');

const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordRegex.test(password);
};

// Đăng ký người dùng
exports.register = (req, res) => {
  const { username, password, role } = req.body;

  // Kiểm tra mật khẩu theo yêu cầu
  if (!validatePassword(password)) {
    return res.status(400).send('Mật khẩu của bạn cần có tối thiểu 8 ký tự, tối thiếu 1 chữ viết hoa, tối thiểu 1 ký tự đặc biệt.');
  }

  // Kiểm tra xem người dùng đã tồn tại chưa
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Kiểm tra ... :', err);
      return res.status(500).send('Lỗi Server');
    }

    if (results.length > 0) {
      return res.status(400).send('Người dùng đã tồn tại');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    // Thêm người dùng mới vào cơ sở dữ liệu
    const insertUserQuery = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
    db.query(insertUserQuery, [username, hashedPassword, role], (err, result) => {
      if (err) {
        console.error('Lỗi thêm người dùng:', err);
        return res.status(500).send('Lỗi thêm người dùng');
      }

      res.status(201).send('Đăng ký người dùng thành công');
    });
  });
};

// Đăng nhập người dùng
exports.login = (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra thông tin người dùng trong cơ sở dữ liệu
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Lỗi kiểm tra người dùng:', err);
      return res.status(500).send('Lỗi Server');
    }

    if (results.length === 0) {
      return res.status(401).send('Thông tin đăng nhập không chính xác');
    }

    const user = results[0];

    // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong cơ sở dữ liệu
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).send('Lỗi server');
      }

      if (!isMatch) {
        return res.status(401).send('Thông tin đăng nhập không chính xác');
      }

      // Tạo JWT token nếu mật khẩu đúng
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      

      // Trả về token cho người dùng
      res.status(200).json({ message: 'Đăng nhập thành công', token });
    });
  });
};

