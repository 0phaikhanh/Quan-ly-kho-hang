// /controllers/transactionController.js
const db = require('../config/dbConfig');

// Lấy tất cả các giao dịch nhập/xuất kho
exports.getAllTransactions = (req, res) => {
  const query = 'SELECT * FROM transactions ORDER BY transaction_date DESC'; // Lấy tất cả giao dịch theo ngày
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).send('Error fetching transactions');
    }
    res.status(200).json(results); // Trả về danh sách giao dịch
  });
};

// Thêm nguyên liệu vào kho
exports.addInventoryItem = (req, res) => {
  const { name, quantity, unit, price } = req.body; // Lấy thông tin từ request body
  const query = 'INSERT INTO inventory (name, quantity, unit, price) VALUES (?, ?, ?, ?)';
  db.query(query, [name, quantity, unit, price], (err, result) => {
    if (err) {
      console.error('Error adding inventory item:', err);
      return res.status(500).send('Error adding inventory item');
    }
    res.status(201).send('Inventory item added successfully'); // Trả về thông báo thành công
  });
};

// Thêm giao dịch nhập kho
exports.addImportTransaction = (req, res) => {
  const { inventory_id, quantity } = req.body; // Lấy thông tin từ request body

  // Kiểm tra xem nguyên liệu có tồn tại trong kho không
  const checkInventoryQuery = 'SELECT * FROM inventory WHERE id = ?';
  db.query(checkInventoryQuery, [inventory_id], (err, results) => {
    if (err) {
      console.error('Error checking inventory:', err);
      return res.status(500).send('Error checking inventory');
    }

    if (results.length === 0) {
      return res.status(404).send('Inventory item not found');
    }

    // Cập nhật số lượng nguyên liệu trong kho
    const updateInventoryQuery = 'UPDATE inventory SET quantity = quantity + ? WHERE id = ?';
    db.query(updateInventoryQuery, [quantity, inventory_id], (err) => {
      if (err) {
        console.error('Error updating inventory:', err);
        return res.status(500).send('Error updating inventory');
      }

      // Thêm giao dịch nhập kho vào bảng transactions
      const insertTransactionQuery = 'INSERT INTO transactions (inventory_id, transaction_type, quantity) VALUES (?, ?, ?)';
      db.query(insertTransactionQuery, [inventory_id, 'import', quantity], (err) => {
        if (err) {
          console.error('Error adding import transaction:', err);
          return res.status(500).send('Error adding import transaction');
        }
        res.status(201).send('Import transaction added successfully'); // Trả về thông báo thành công
      });
    });
  });
};

// Thêm giao dịch xuất kho
exports.addExportTransaction = (req, res) => {
  const { inventory_id, quantity } = req.body; // Lấy thông tin từ request body

  // Kiểm tra xem nguyên liệu có đủ số lượng trong kho không
  const checkInventoryQuery = 'SELECT quantity FROM inventory WHERE id = ?';
  db.query(checkInventoryQuery, [inventory_id], (err, results) => {
    if (err) {
      console.error('Error checking inventory:', err);
      return res.status(500).send('Error checking inventory');
    }

    if (results.length === 0 || results[0].quantity < quantity) {
      return res.status(400).send('Insufficient stock to export');
    }

    // Cập nhật số lượng nguyên liệu trong kho
    const updateInventoryQuery = 'UPDATE inventory SET quantity = quantity - ? WHERE id = ?';
    db.query(updateInventoryQuery, [quantity, inventory_id], (err) => {
      if (err) {
        console.error('Error updating inventory:', err);
        return res.status(500).send('Error updating inventory');
      }

      // Thêm giao dịch xuất kho vào bảng transactions
      const insertTransactionQuery = 'INSERT INTO transactions (inventory_id, transaction_type, quantity) VALUES (?, ?, ?)';
      db.query(insertTransactionQuery, [inventory_id, 'export', quantity], (err) => {
        if (err) {
          console.error('Error adding export transaction:', err);
          return res.status(500).send('Error adding export transaction');
        }
        res.status(201).send('Export transaction added successfully'); // Trả về thông báo thành công
      });
    });
  });
};
