// /controllers/materialController.js
const db = require('../config/dbConfig');  // Kết nối với cơ sở dữ liệu MySQL

// Lấy tất cả nguyên liệu
exports.getAllMaterials = (req, res) => {
  const query = 'SELECT * FROM inventory';  // Lấy tất cả nguyên liệu trong kho
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching materials:', err);
      return res.status(500).send('Error fetching materials');
    }
    res.status(200).json(results);  // Trả về danh sách nguyên liệu
  });
};

// Thêm nguyên liệu mới vào kho
exports.addMaterial = (req, res) => {
  const { name, material_type, unit, quantity, price, supplier_id } = req.body;

  // Kiểm tra xem nguyên liệu đã tồn tại trong kho chưa
  const checkQuery = 'SELECT * FROM inventory WHERE name = ?';
  db.query(checkQuery, [name], (err, results) => {
    if (err) {
      console.error('Error checking if material exists:', err);
      return res.status(500).send('Error checking if material exists');
    }

    if (results.length > 0) {
      return res.status(400).send('Material already exists');
    }

    // Thêm nguyên liệu vào kho
    const insertQuery = 'INSERT INTO inventory (name, material_type, unit, quantity, price, supplier_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [name, material_type, unit, quantity, price, supplier_id], (err, result) => {
      if (err) {
        console.error('Error adding material:', err);
        return res.status(500).send('Error adding material');
      }
      res.status(201).send('Material added successfully');
    });
  });
};

// Cập nhật thông tin nguyên liệu
exports.updateMaterial = (req, res) => {
  const { id } = req.params;  // Lấy ID của nguyên liệu từ tham số URL
  const { name, material_type, unit, quantity, price, supplier_id } = req.body;  // Lấy thông tin cập nhật từ request body

  // Kiểm tra xem nguyên liệu có tồn tại trong kho không
  const checkQuery = 'SELECT * FROM inventory WHERE id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Error checking if material exists:', err);
      return res.status(500).send('Error checking if material exists');
    }

    if (results.length === 0) {
      return res.status(404).send('Material not found');
    }

    // Cập nhật thông tin nguyên liệu
    const updateQuery = `
      UPDATE inventory 
      SET name = ?, material_type = ?, unit = ?, quantity = ?, price = ?, supplier_id = ?
      WHERE id = ?
    `;
    db.query(updateQuery, [name, material_type, unit, quantity, price, supplier_id, id], (err, result) => {
      if (err) {
        console.error('Error updating material:', err);
        return res.status(500).send('Error updating material');
      }
      res.status(200).send('Material updated successfully');
    });
  });
};

// Xóa nguyên liệu khỏi kho
exports.deleteMaterial = (req, res) => {
  const { id } = req.params;  // Lấy ID của nguyên liệu từ tham số URL

  // Kiểm tra xem nguyên liệu có tồn tại trong kho không
  const checkQuery = 'SELECT * FROM inventory WHERE id = ?';
  db.query(checkQuery, [id], (err, results) => {
    if (err) {
      console.error('Error checking if material exists:', err);
      return res.status(500).send('Error checking if material exists');
    }

    if (results.length === 0) {
      return res.status(404).send('Material not found');
    }

    // Xóa nguyên liệu khỏi kho
    const deleteQuery = 'DELETE FROM inventory WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
      if (err) {
        console.error('Error deleting material:', err);
        return res.status(500).send('Error deleting material');
      }
      res.status(200).send('Material deleted successfully');
    });
  });
};
