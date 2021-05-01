const express = require('express');
const path = require('path');

const { port, mongoUri } = require('./config/env.config');
const {mongoConnect} = require('./config/mongo.config');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('608d4501de25090978c7b476').then(user => {
		req.user = new User(user)
		next();
	}).catch(err => {
		console.log(err);
		next()
	})
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorsController.get404Page);

mongoConnect(mongoUri, () => {
	app.listen(port, () => {
		console.log(`server is listening at port ${port}`);
	});
});