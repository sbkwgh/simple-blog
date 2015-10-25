var router = require('express').Router();

router.get('/', function(req, res) {
	res.redirect('/blog/posts');
})

module.exports = router;