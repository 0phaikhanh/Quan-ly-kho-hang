const db = require('../models');

exports.getSalesReport = async (req, res) => {
    try {
        const salesData = await db.Sale.findAll({
            attributes: [
                'product_id',
                'product_name',
                [db.Sequelize.fn('SUM', db.Sequelize.col('quantity')), 'total_sales'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('total_amount')), 'total_revenue'],
                'date'
            ],
            group: ['product_id', 'date'],
            order: [['date', 'DESC']]
        });

        res.status(200).json({ salesData });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching sales data', error: err });
    }
};
