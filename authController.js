const bcrypt = require('bcryptjs');
const db = require('../config/dbConfig');
const { generateToken } = require('../config/jwtConfig');

// Biểu thức chính quy kiểm tra yêu cầu mật khẩu
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return passwordRegex.test(password);
};

// API đăng ký
exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra mật khẩu theo yêu cầu
  if (!validatePassword(password)) {
    return res.status(400).send('Mật khẩu cần có ít nhất 8 kí tự, ít nhất một kí tự viết hoa, một kí hiệu đặc biệt.');
  }

  try {
    // Mã hóa mật khẩu
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Thêm người dùng vào cơ sở dữ liệu
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await db.promise().query(query, [username, hashedPassword]);
    res.status(201).send('Đăng ký người dùng thành công');
  } catch (err) {
    console.error('Lỗi đăng ký người dùng:', err);
    res.status(500).send('Lỗi đăng ký người dùng');
  }
};

// API đăng nhập
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kiểm tra người dùng trong cơ sở dữ liệu
    const query = 'SELECT * FROM users WHERE username = ?';
    const [users] = await db.promise().query(query, [username]);

    if (users.length === 0) {
      return res.status(401).send('Thông tin đăng nhập không hợp lệ');
    }

    const user = users[0];

    // Kiểm tra mật khẩu
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Thông tin đăng nhập không hợp lệ');
    }

    // Tạo token JWT
    const token = generateToken(user);

    // Gửi token về cho người dùng
    res.status(200).json({ message: 'Đăng nhập thành công', token });
  } catch (err) {
    console.error('Lỗi đăng nhập người dùng:', err);
    res.status(500).send('Lỗi đăng nhập người dùng');
  }
};