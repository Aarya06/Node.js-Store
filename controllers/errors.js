exports.get404Page = (req, res, next) => {
	res.status(404).render('404', {
		title: 'not found',
		path: ':any',
		isAuthenticated: req.session.isLoggedIn
	});
};