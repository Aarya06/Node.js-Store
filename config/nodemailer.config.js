const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { SEND_GRID_API_KEY } = require('./env.config');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: SEND_GRID_API_KEY
    }
}))

module.exports = transporter;
