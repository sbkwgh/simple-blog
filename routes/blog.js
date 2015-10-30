var router = require('express').Router();
var Post = require('../models/post.js');
var Config = require('../models/config.js');
var Comment = require('../models/comment.js');

function renderBlogCb(err, posts, req, res) {
	if(err) {
		console.log(err);
		res.render('blog.html', {posts: []})
	} else {
		Config.getOrCreateConfig(function(err, config) {
			if(err) {
				res.render('blog.html', {config: config, posts: []})
			} else {
				Comment.getNumberOfComments(function(err, commentNumbers) {
					res.render('blog.html', {config:config, commentNumbers: commentNumbers, posts: posts, tag: req.params.tag});
				})
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
	Post.findOne({published: true, _id: req.params._id}, function(err, post) {
		if(err) {
			console.log(err);
			res.render('blogPost.html')
		} else {
			Config.getOrCreateConfig(function(err, config) {
				if(err) {
					res.render('blogPost.html', {config: config, author: req.signedCookies.author})
				} else {
					res.render('blogPost.html', {config:config, post: post, author: req.signedCookies.author});
				}
			})
		}
	});
})

router.get('/tag/:tag', function(req, res) {
	Post.find({published: true, tags: req.params.tag}, function(err, posts) {
		renderBlogCb(err, posts, req, res)
	});
})

module.exports = router;