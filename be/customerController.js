const db = require('../models');

exports.getCustomerReport = async (req, res) => {
    try {
        const customerData = await db.Customer.findAll({
            attributes: [
                'id',
                'name',
                [db.Sequelize.fn('SUM', db.Sequelize.col('total_spent')), 'total_spent'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('orders.id')), 'total_orders'],
                [db.Sequelize.fn('IF', db.Sequelize.fn('SUM', db.Sequelize.col('total_spent')), '>=', 1000000), 'vip_status']
            ],
            include: [
                {
                    model: db.Order,
                    attributes: [],
                    required: true
                }
            ],
            group: ['Customer.id']
        });

        res.status(200).json({ customerData });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customer data', error: err });
    }
};
