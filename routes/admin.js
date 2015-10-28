var router = require('express').Router();

router.get('/login', function(req, res, next) {
	if(!req.signedCookies.loggedInUser) {
		res.render('login.html');
	} else {
		res.redirect('/admin');
	}
})

router.all('*', function(req, res, next) {
	if(!req.signedCookies.loggedInUser) {
		res.redirect('/admin/login')
	} else {
		next();
	}
})

router.get('/', function(req, res) {
	res.render('admin.html', {author: req.signedCookies.author});
});

module.exports = router;