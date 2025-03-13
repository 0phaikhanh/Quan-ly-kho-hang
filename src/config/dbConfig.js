const mysql = require('mysql2');

// Cấu hình kết nối MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123123123',
  database: 'quan_li',
});

connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối database: ' + err.stack);
    return;
  }
  console.log('Kết nối với database với id ' + connection.threadId);
});

module.exports = connection;
