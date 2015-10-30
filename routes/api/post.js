var express = require('express');
var Post = require('../../models/post.js');
var ObjectId = require('mongoose').Schema.ObjectId;
var Comment = require('../../models/comment.js');

var router = express.Router();

router.all('*', function(req, res, next) {
	if(!req.signedCookies.loggedInUser) {
		res.json({error: 'Request not authorised'})
	} else {
		next();
	}
});

router.get('/', function(req, res) {
	Post.find({}, '_id title', function(err, posts) {
		if(err) {
			res.json({error: err});
			return;
		}
		res.json(posts);
	})
});
router.get('/:id', function(req, res) {
	var id = req.params.id;
	
	Post.findByIdErr(res, id, function(post) {
		res.json(post);
	});
});

router.post('/', function(req, res) {
	var postObject = {};
	for(var key in req.body) {
		postObject[key] = req.body[key]

		if(key === 'tags') {
			postObject[key] = JSON.parse(req.body[key]);
		}
	}
	var post = new Post(postObject);

	post.save(function(err, savedPost) {
		if(err) {
			console.log(err)
			res.json({error: 'unknown error'});
			return;
		}

		res.json(savedPost);
	});
});

router.put('/:id', function(req, res) {
	var postObject = {};
	var id = req.params.id;

	for(var key in req.body) {
		postObject[key] = req.body[key]

		if(key === 'tags') {
			postObject[key] = JSON.parse(req.body[key]);
		}
	}

	if(!id.match(/^[0-9a-fA-F]{24}$/)) {
		res.json({error: 'invalid id'});
		return;
	}

	Post.findOneAndUpdate({_id: id}, postObject, {}, function(err) {
		if(err) {
			console.log(err)
			res.json({error: 'unknown error'});
			return;
		}

		res.json(postObject);
	});
});

router.delete('/:id', function(req, res) {
	var id = req.params.id;
	
	Post.findByIdErr(res, id, function(post) {
		post.remove(function(err) {
			if(err) {
				console.log(err)
				res.json({error: 'unknown error'})
			} else {
				Comment.find({postId: ObjectId(req.params.id)}).remove(function(err, success) {
					if(err) {
						console.log(err)
						res.json({error: 'unknown error'})
					} else {
						res.json({success: true});
					}
				})
			}
		})
	});
});


module.exports = router;