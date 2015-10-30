var router = require('express').Router();
var ObjectId = require('mongoose').Types.ObjectId;
var Comment = require('../../models/comment.js');

router.get('/:postId', function(req, res) {
	var postId = req.params.postId;
	if(!postId.match(/^[0-9a-fA-F]{24}$/)) {
		res.json({error: 'invalid id'});
		return;
	}

	Comment.find({postId: ObjectId(postId)}, function(err, posts) {
		if(err) {
			console.log(err);
			res.json({error: 'unknown error'})
		} else {
			posts.sort(function(a, b) {
				return new Date(a.date) - new Date(b.date);
			})
			res.json(posts);
		}
	})
})

router.post('/', function(req, res) {
	var commentObj;
	var newComment;
	if(!req.body.postId.match(/^[0-9a-fA-F]{24}$/)) {
		res.json({error: 'invalid postId'});
		return;
	}
	
	commentObj = {
		name: req.body.name,
		body: req.body.body,
		postId: ObjectId(req.body.postId)
	}

	if(req.signedCookies.author) {
		commentObj.authorComment = true;
	}

	if(req.body.parentCommentId) {
		if(!req.body.postId.match(/^[0-9a-fA-F]{24}$/)) {
			res.json({error: 'invalid parentCommentId'});
			return;
		}
		commentObj.parentCommentId = ObjectId(req.body.parentCommentId);
		commentObj.parentCommentName = req.body.parentCommentName;
	}

	newComment = new Comment(commentObj);

	newComment.save(function(err, savedComment) {
		if(err) {
			console.log(err);
			res.json({error: 'unknown error'})
		} else {
			res.json(savedComment);
		}
	});
})

module.exports = router;