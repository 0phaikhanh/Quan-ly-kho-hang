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
            // Nếu có nguyên liệu nào có số lượng thấp hơn mức tối thiểu
            res.status(200).json({
                message: 'Warning! Some materials are below the minimum stock level.',
                lowStock: results
            });
        } else {
            // Nếu tất cả nguyên liệu đều ở mức tồn kho hợp lý
            res.status(200).json({
                message: 'All materials are at acceptable stock levels.'
            });
        }
    });
});