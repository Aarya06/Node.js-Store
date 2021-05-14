const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { signupMail } = require('../config/nodemailer.config');

exports.getLoginForm = (req, res, next) => {
    res.status(200).render('auth/login', {
        title: 'Login',
        path: '/login'
    });
}

exports.postLogin = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email }).then(user => {
        if (!user) {
            req.flash('error', 'User not found')
            return res.redirect('/login')
        }
        return bcrypt.compare(password, user.password)
            .then(isMatched => {
                if (!isMatched) {
                    req.flash('error', 'Invalid password')
                    return res.redirect('/login')
                }
                req.session.user = user
                req.session.isLoggedIn = true;
                req.session.save(err => {
                    if (err) {
                        console.log(err)
                    }
                    req.flash('success', 'Welcome')
                    return res.redirect('/')
                })
            })
            .catch(err => {
                console.log(err)
            })
    }).catch(err => {
        console.log(err)
    })
}

exports.getSignUp = (req, res, next) => {
    res.status(200).render('auth/signup', {
        title: 'SignUp',
        path: '/signup'
    });
}

exports.postSignUp = (req, res, next) => {
    const { email, password, confirmPassword } = req.body
    if (password !== confirmPassword) {
        return res.redirect('/signup')
    }
    User.findOne({ email }).then(user => {
        if (user) {
            req.flash('error', 'Email already exists')
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12).then(hashedPassword => {
            User.create({ email, password: hashedPassword, cart: { items: [] } })
                .then(newUser => {
                    req.flash('success', 'Successfully signed up')
                    res.redirect('/login')
                    return signupMail(email)
                }).catch(err => {
                    console.log(err)
                })
        })
    }
    ).catch(err => {
        console.log(err)
    })
}

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        req.flash('success', 'Logged Out')
        res.redirect('/')
    })
}