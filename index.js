const express = require('express');
const path = require('path');
const session = require('express-session')
const mongoStore = require('connect-mongodb-session')(session)

const { port, sessionUri } = require('./config/env.config');
const mongoConnect = require('./config/mongo.config');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();
const store = new mongoStore({
	uri: sessionUri,
	collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: 'my secret',
	resave: false,
	saveUninitialized: false,
	store
}))

app.use((req, res, next) => {
	if(!req.session.user){
		return next()
	}
	User.findById(req.session.user._id).then(user => {
		req.user = user
		next();
	}).catch(err => {
		console.log(err);
		next()
	})
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorsController.get404Page);

mongoConnect.on('error', err => {
	console.log('error connecting to Database', err)
});

app.listen(port, () => {
	console.log(`server is listening at port ${port}`);
});