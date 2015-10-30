var mongoose = require('mongoose');

var configSchema = mongoose.Schema({
	appearance: {
		font: {
			default: String,
			postTitle: String,
			postBody: String,
			blogTitle: String
		},
		colour: {
			link: {
				default: String,
				visited: String,
				active: String,
				hover: String
			},
			blogTitle: String,
			topBar: String,
			postTitle: String,
			postBody: String
		}
	},
	general: {
			blog: {
				title: String,
				description: String
			}
	}
});

configSchema.statics.getOrCreateConfig = function(cb) {
	var self = this;
	this.findOne({}, function(err, config) {
		if(config === null) {
			var newConfig = new self();
			newConfig.appearance = {
				font: {
					default: 'Arial',
					postTitle: 'Arial',
					postBody: 'Arial',
					blogTitle: 'Arial'
				},
				colour: {
					link: {
						default: '#5F7F9C',
						visited: '#477C95',
						active: '#8EB7CB',
						hover: '#7EA7DB'
					},
					blogTitle: '#595959',
					topBar: '#78AEF3',
					postTitle: '#000000',
					postBody: '#000000'
				}
			};
			newConfig.general = {
				blog: {
					title: 'Blog title',
					description: 'A description of your blog. Change this in settings → general'
				}
			}

			newConfig.save(cb)
		} else {
			cb(null, config);
		}
	});
};

var Config = mongoose.model('Config', configSchema);

module.exports = Config;