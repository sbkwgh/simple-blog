var router = require('express').Router();

router.get('/login', function(req, res) {
	res.render('login.html');
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