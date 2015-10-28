var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	postId: mongoose.Schema.ObjectId,
	parentCommentId: mongoose.Schema.ObjectId,
	parentCommentName: String,
	name: String,
	body: String,
	date: {type: Date, default: Date.now}
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;