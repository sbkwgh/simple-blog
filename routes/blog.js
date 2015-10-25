var router = require('express').Router();
var Post = require('../models/post.js');

router.get('/posts', function(req, res) {
	Post.find({published: true}, function(err, posts) {
		if(err) {
			console.log(err);
			res.render('blog.html', {posts: []})
		} else {
			res.render('blog.html', {posts: posts});
		}
	});
})

router.get('/posts/:_id', function(req, res) {
	Post.find({published: true, _id: req.params._id}, function(err, posts) {
		if(err) {
			console.log(err);
			res.render('blog.html', {posts: []})
		} else {
			res.render('blog.html', {posts: posts});
		}
	});
})

router.get('/tag/:tag', function(req, res) {
	Post.find({published: true, tags: req.params.tag}, function(err, posts) {
		if(err) {
			console.log(err);
			res.render('blog.html', {posts: []})
		} else {
			res.render('blog.html', {posts: posts});
		}
	});
})

module.exports = router;