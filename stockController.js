const db = require('../config/dbConfig');
const { sendEmailWarning } = require('./mailer');

// API kiểm tra kho nguyên liệu
app.get('/api/check-stock', (req, res) => {
    const query = `
        SELECT id, name, quantity, min_quantity
        FROM materials
        WHERE quantity < min_quantity
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking stock levels', error: err });
        }

        if (results.length > 0) {
            //gửi mail cảnh báo hết nguyên liệu
            sendEmailWarning(results);

            res.status(200).json({
                message: 'Nguyen lieu duoi day sap het, can duoc bo sung.',
                lowStock: results
            });
        } else {
            res.status(200).json({
                message: 'Nguyen lieu day du.'
            });
        }
    });
});
