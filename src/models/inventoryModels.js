// /controllers/inventoryController.js
const db = require('../config/dbConfig');

// Thêm nguyên liệu vào kho
exports.addInventoryItem = (req, res) => {
    const { name, material_type, unit, quantity, unit_price, supplier_id } = req.body;

    const query = 'INSERT INTO inventory (name, material_type, unit, quantity, unit_price, supplier_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [name, material_type, unit, quantity, unit_price, supplier_id], (err, result) => {
        if (err) {
            console.error('Error adding inventory item:', err);
            return res.status(500).send('Error adding inventory item');
        }
        res.status(201).send('Inventory item added successfully');
    });
};
