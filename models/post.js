var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
	title: {type: String, required: true, trim: true},
	body: String,
	date: {
		default: Date.now,
		type: Date
	},
	tags: [{
		type: String,
		trim: true
	}],
	published: Boolean
});

postSchema.virtual('dateString').get(function() {
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Oct', 'Dec'];

	return this.date.getDate() + ' ' + months[this.date.getMonth()] + ' ' + this.date.getFullYear();
});

postSchema.statics.findByIdErr = function(res, id, cb) {
	if(!id.match(/^[0-9a-fA-F]{24}$/)) {
		res.json({error: 'invalid id'});
		return;
	}

	Post.findById(id, function(err, post) {
		if(err) {
			console.log(err);
			res.json({error: 'unknown error'});
			return;
		}
		if(!post) {
			res.json({error: 'post not found'});
			return;
		}

		cb(post);
	});
};

postSchema.pre('save', function(next) {
	var body = this.body;

	if(body === undefined) {
		this.body = '';
	}

	next();
})

var Post = mongoose.model('Post', postSchema);


/*postSchema.pre('save', function(next) {
	var title = this.get('title');
	var self = this;

	function doesTitleIdExist(titleId, cb) {
		Post.findOne({titleId: titleId}, function(err, post) {
			if(err) {
				next(err);
				return;
			}

			cb(post.titleId === titleId, titleId);
		})
	}

	function createTitleId(title) {
		var randomStr = Math.floor(Math.random() * 1e10).toString(36);
		return title.split(' ').join('-').slice(30) + randomStr;
	}

	function recursiveFunc() {
		doesTitleIdExist(createTitleId(title), function(bool, titleId) {
			if(!bool) {
				recursiveFunc();
			} else {
				self.titleId = titleId;
				next();
			}
		})
	}
});*/


module.exports = Post;