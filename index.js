const express = require('express');
const path = require('path');
const session = require('express-session')
const mongoStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const flash = require('connect-flash');

const { PORT, SESSION_URI } = require('./config/env.config');
const mongoConnect = require('./config/mongo.config');
const multer = require('./config/multer.config');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();
const csrfProtection = csrf()
const store = new mongoStore({
	uri: SESSION_URI,
	collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multer)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store
}))
app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
	if (!req.session.user) {
		return next()
	}
	User.findById(req.session.user._id).then(user => {
		if (user) {
			req.user = user
		}
		next();
	}).catch(err => {
		next(new Error(err))
	})
})

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.isLoggedIn;
	res.locals.csrfToken = req.csrfToken();
	res.locals.errorMsg = req.flash('error');
	res.locals.successMsg = req.flash('success');
	next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404Page);

app.use((error, req, res, next) => {
	res.status(500).render('500', {
		title: 'Error',
		path: '/500'
	});
})

mongoConnect.on('error', err => {
	console.log('error connecting to Database', err)
});

app.listen(PORT || 3000, () => {
	console.log(`server is listening at port ${PORT}`);
});