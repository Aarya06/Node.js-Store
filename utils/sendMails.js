const { SEND_GRID_EMAIL } = require("../config/env.config");
const transporter = require("../config/nodemailer.config")

const signupMail = (email)  => transporter.sendMail({
    to: email,
    from: SEND_GRID_EMAIL,
    subject: 'Sign Up',
    html: '<h1>welcome to bookStore</h1>'
})

const resetMail = ({email, token})  => transporter.sendMail({
    to: email,
    from: SEND_GRID_EMAIL,
    subject: 'Password Reset',
    html: `
    <h1>Password Reset Requested</h1>
    <p>
        <a href="http://localhost:3000/reset/${token}">
            click here
        </a> to reset your password
    </p>`
})

module.exports = {
    signupMail,
    resetMail
};