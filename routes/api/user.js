var express = require('express');
var User = require('../../models/user.js');

var router = express.Router();

router.post('/', function(req, res) {
	User.findOne({}, function(err, user) {
		if(err) {
			console.log(err);
			res.json({error: 'unknown error'});
			return;
		}

		if(user) {
			res.json({error: 'account already created'});
		} else {
			var user = new User({
				username: req.body.username,
				hash: req.body.hash,
				author: req.body.author
			});

			user.save(function(err, success) {
				if(err) {
					console.log(err);
					res.json({error: 'unknown error'});
				} else {
					res.cookie('loggedInUser', req.body.username, {signed: true});
					res.cookie('author', req.body.author, {signed: true});
					res.json({success: true})
				}
			})
		}
	})
});
router.post('/:username', function(req, res) {
	User.findUserAndCompareHashes(req.params.username, req.body.hash, function(err, verified, user) {
		if(err) {
			if(err === 'user not found') {
				res.json({error: err});
			} else {
				console.log(err);
				res.json({error: 'unknown error'});
			}
			return;
		} else if(verified) {
			res.cookie('loggedInUser', user.username, {signed: true});
			res.cookie('author', user.author, {signed: true});

			res.json({success: true});
		} else {
			res.json({success: false});
		}
	})
});

router.all('*', function(req, res, next) {
	if(!req.signedCookies.loggedInUser) {
		res.json({error: 'request not authorised'});
	} else {
		next();
	}
})

router.delete('/:username', function(req, res) {
	var username = req.params.username;
	
	User.findOne({username: username}, function(err, user) {
		if(err) {
			console.log(err)
			res.json({error: 'unknown error'});
		} else {
			user.remove(function(err) {
				if(err) {
					console.log(err);
					res.json({error: 'unknown error'});
				} else 
				res.json({success: true});
			});
		}
	});
});

module.exports = router;