var mongoose = require('mongoose');
var markdown = require( "markdown" ).markdown;

var commentSchema = mongoose.Schema({
	postId: mongoose.Schema.ObjectId,
	parentCommentId: mongoose.Schema.ObjectId,
	parentCommentName: String,
	name: String,
	body: String,
	authorComment: Boolean,
	date: {type: Date, default: Date.now}
});

commentSchema.statics.getNumberOfComments = function(cb) {
	var commentNumbers = {};
	this.find({}, function(err, comments) {
		if(err) cb(err);

		comments.forEach(function(comment) {
			if(!commentNumbers[comment.postId]) {
				commentNumbers[comment.postId] = 1;
			} else {
				commentNumbers[comment.postId] += 1;
			}
		})

		cb(null, commentNumbers);
	})
}

commentSchema.pre('save', function(next) {
	this.body = markdown.toHTML(this.body);
	next();
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;