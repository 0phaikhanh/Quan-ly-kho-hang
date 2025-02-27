const path = require('path')
const mysql = require('mysql2');

const express = require('express')
const morgan = require('morgan')
const {engine} = require('express-handlebars')
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

//HTTP
app.use(morgan('combined'))

//Template engine
app.engine('hbs', engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.get('/', (req, res) => {
  res.render('home');
});

// Middleware để parse dữ liệu JSON
app.use(express.json());

// Kết nối tới MySQL
const connection = mysql.createConnection({
  host: 'localhost',       // Máy chủ MySQL (nếu sử dụng MySQL local, sử dụng 'localhost')
  user: 'root',       // Tên người dùng MySQL
  password: '123123123',   // Mật khẩu MySQL (để trống nếu không có mật khẩu)
  database: 'demo',
  database: 'demo2',
});

// Kết nối MySQL
connection.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối đến MySQL:', err);
    return;
  }
  console.log('Đã kết nối tới MySQL!');
});

//Lấy thông tin người dùng theo id
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users'; // Giả sử bảng users có cột id, name, email
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
    }
    res.status(200).json(results);
  });
});

//thêm user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(query, [name, email], (err, results) => {
    if (err) {
      console.error('Lỗi khi thêm dữ liệu:', err);
      return res.status(500).json({ error: 'Lỗi khi thêm dữ liệu' });
    }
    res.status(201).json({ message: 'Thêm người dùng thành công', id: results.insertId });
  });
});

//Cập nhật thông tin user
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(query, [name, email, id], (err, results) => {
    if (err) {
      console.error('Lỗi khi cập nhật dữ liệu:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật dữ liệu' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng' });
    }
    res.status(200).json({ message: 'Cập nhật thành công' });
  });
});

//Xoá người dùng theo id
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi xóa dữ liệu:', err);
      return res.status(500).json({ error: 'Lỗi khi xóa dữ liệu' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy người dùng để xóa' });
    }
    res.status(200).json({ message: 'Xóa người dùng thành công' });
  });
});

//Quản lí sản phẩm
//lấy thông tin sản phẩm theo ID
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM products WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
    }
    res.status(200).json(results[0]);
  });
});

//Cập nhật thông tin sản phẩm
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, stock } = req.body;
  const query = 'UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?';
  connection.query(query, [name, price, stock, id], (err, results) => {
    if (err) {
      console.error('Lỗi khi cập nhật sản phẩm:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm để cập nhật' });
    }
    res.status(200).json({ message: 'Cập nhật sản phẩm thành công' });
  });
});

//xoá sản phẩm
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm để xóa' });
    }
    res.status(200).json({ message: 'Xóa sản phẩm thành công' });
  });
});

//Quản lí đơn hàng
//tạo đơn hàng
app.post('/api/orders', (req, res) => {
  const { customer_id, products, total_amount } = req.body;
  // Giả sử products là một danh sách các ID sản phẩm với số lượng tương ứng
  const query = 'INSERT INTO orders (customer_id, total_amount) VALUES (?, ?)';
  connection.query(query, [customer_id, total_amount], (err, results) => {
    if (err) {
      console.error('Lỗi khi tạo đơn hàng:', err);
      return res.status(500).json({ error: 'Lỗi khi tạo đơn hàng' });
    }
    const orderId = results.insertId;
    // Sau khi tạo đơn hàng, thêm các sản phẩm vào đơn hàng
    const orderProductsQuery = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES ?';
    const orderProductsValues = products.map(product => [orderId, product.id, product.quantity]);
    connection.query(orderProductsQuery, [orderProductsValues], (err) => {
      if (err) {
        console.error('Lỗi khi thêm sản phẩm vào đơn hàng:', err);
        return res.status(500).json({ error: 'Lỗi khi thêm sản phẩm vào đơn hàng' });
      }
      res.status(201).json({ message: 'Tạo đơn hàng thành công', order_id: orderId });
    });
  });
});

// lấy danh sách đơn hàng
app.get('/api/orders', (req, res) => {
  const query = 'SELECT * FROM orders';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Lỗi khi truy vấn dữ liệu:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
    }
    res.status(200).json(results);
  });
});

// lấy thông tin đơn hàng theo id
app.get('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM orders WHERE id = ?';
  connection.query(query, [id], (err, orderResults) => {
    if (err) {
      console.error('Lỗi khi truy vấn đơn hàng:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
    }
    if (orderResults.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng' });
    }
    const order = orderResults[0];
    const orderProductsQuery = 'SELECT * FROM order_products WHERE order_id = ?';
    connection.query(orderProductsQuery, [id], (err, products) => {
      if (err) {
        console.error('Lỗi khi truy vấn sản phẩm của đơn hàng:', err);
        return res.status(500).json({ error: 'Lỗi truy vấn sản phẩm' });
      }
      res.status(200).json({ order, products });
    });
  });
});

//cập nhật thông tin đơn hàng
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE orders SET status = ? WHERE id = ?';
  connection.query(query, [status, id], (err, results) => {
    if (err) {
      console.error('Lỗi khi cập nhật đơn hàng:', err);
      return res.status(500).json({ error: 'Lỗi khi cập nhật đơn hàng' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng để cập nhật' });
    }
    res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
  });
});

//3. Quản lí xuất kho
app.post('/api/fulfillment', (req, res) => {
  const { order_id } = req.body;
  // Lấy danh sách sản phẩm trong đơn hàng
  const query = 'SELECT * FROM order_products WHERE order_id = ?';
  connection.query(query, [order_id], (err, orderProducts) => {
    if (err) {
      console.error('Lỗi khi truy vấn sản phẩm trong đơn hàng:', err);
      return res.status(500).json({ error: 'Lỗi khi truy vấn sản phẩm' });
    }
    orderProducts.forEach(product => {
      // Cập nhật số lượng sản phẩm trong kho
      const stockUpdateQuery = 'UPDATE products SET stock = stock - ? WHERE id = ?';
      connection.query(stockUpdateQuery, [product.quantity, product.product_id], (err) => {
        if (err) {
          console.error('Lỗi khi cập nhật tồn kho:', err);
          return res.status(500).json({ error: 'Lỗi khi cập nhật tồn kho' });
        }
      });
    });
    res.status(200).json({ message: 'Xuất hàng thành công' });
  });
});


app.listen(port, () => {console.log(`Example app listening on port ${port}`)})