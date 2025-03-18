const db = require('../models');

exports.getFinanceReport = async (req, res) => {
    try {
        const financeData = await db.Transaction.findAll({
            attributes: [
                [db.Sequelize.fn('SUM', db.Sequelize.col('revenue')), 'total_revenue'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('cost')), 'total_cost'],
                [db.Sequelize.fn('SUM', db.Sequelize.col('profit')), 'net_profit']
            ],
            where: {
                type: 'sale'
            }
        });

        res.status(200).json({ financeData });
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err });
    }
};
