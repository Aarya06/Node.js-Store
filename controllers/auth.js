const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const User = require('../models/user');
const { signupMail, resetMail } = require('../utils/sendMails');

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

exports.getResetPassword = (req, res, next) => {
    res.status(200).render('auth/reset', {
        title: 'Reset',
        path: '/reset'
    });
}

exports.postResetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                req.flash('error', 'No User Found')
                return res.redirect('/reset')
            }
            user.resetToken = token;
            user.tokenExpiry = Date.now() + 3600000
            return user.save()
        }).then(result => {
            resetMail({ token, email: req.body.email })
            res.redirect('/login')
        }).catch(err => {
            console.log(err)
        })
    })
}

exports.getNewPassword = (req, res, next) => {
    User.findOne({ resetToken: req.params.token, tokenExpiry: { $gt: Date.now() } })
        .then(user => {
            res.status(200).render('auth/new-password', {
                title: 'New Password',
                path: '/new-password',
                userId: user._id.toString(),
                token: req.params.token
            });
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postNewPassword = (req, res, next) => {
    const { userId, password, token } = req.body
    User.findOne({_id: userId, resetToken: token, tokenExpiry: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                req.flash('error', 'User Not Found')
                return res.redirect('/reset')
            }
            return bcrypt.hash(password, 12).then(hashedPassword => {
                user.password = hashedPassword,
                    user.resetToken = undefined,
                    user.tokenExpiry = undefined
                return user.save()
            })
        }).then(result => {
            req.flash('success', 'password successfully reset')
            res.redirect('/login')
        })
        .catch(err => {
            console.log(err)
        })
}

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}