const User = require('../models/user');

exports.getLoginForm = (req, res, next) => {
    res.status(404).render('auth/login', {
        title: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    User.findOne().then(user => {
        req.session.user = user
        req.session.isLoggedIn = true;
        req.session.save(err => {
            if (err) {
                console.log(err)
            }
            res.redirect('/')
        })
        res.redirect('/')
    }).catch(err => {
        console.log(err)
    })
}

exports.logout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
}