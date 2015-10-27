var router = require('express').Router();
var Post = require('../models/post.js');
var Config = require('../models/config.js');

function renderBlogCb(err, posts, req, res) {
	if(err) {
		console.log(err);
		res.render('blog.html', {posts: []})
	} else {
		Config.getOrCreateConfig(function(err, config) {
			if(err) {
				res.render('blog.html', {posts: []})
			} else {
				res.render('blog.html', {config:config, posts: posts});
			}
		})
	}
}

router.get('/posts', function(req, res) {
	Post.find({published: true}, function(err, posts) {
		renderBlogCb(err, posts, req, res)
	});
})

router.get('/posts/:_id', function(req, res) {
	Post.find({published: true, _id: req.params._id}, function(err, posts) {
		renderBlogCb(err, posts, req, res)
	});
})

router.get('/tag/:tag', function(req, res) {
	Post.find({published: true, tags: req.params.tag}, function(err, posts) {
		renderBlogCb(err, posts, req, res)
	});
})

module.exports = router;