const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { SEND_GRID_API_KEY, SEND_GRID_EMAIL } = require('./env.config');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: SEND_GRID_API_KEY
    }
}))

const signupMail = (email)  => transporter.sendMail({
    to: email,
    from: SEND_GRID_EMAIL,
    subject: 'Sign Up',
    html: '<h1>welcome to bookStore</h1>'
})

module.exports = {
    transporter,
    signupMail
};
