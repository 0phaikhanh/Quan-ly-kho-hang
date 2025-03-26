const nodemailer = require('nodemailer');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'phamhuyphong2706@gmail.com',
        pass: 'Huyphong2706@'
    }
});

function sendEmailWarning(lowStockItems) {
    const mailOptions = {
        from: 'phamhuyphong2706@gmail.com',
        to: 'php2706@gmail.com',
        subject: 'Warning: Nguyen lieu sap het',
        text: `Nguyen lieu duoi day sap het, can duoc bo sung:\n\n${lowStockItems.map(item => `${item.name}: ${item.quantity} units`).join('\n')}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Loi gui email:', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { sendEmailWarning };
