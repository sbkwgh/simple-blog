var post = require('./routes/api/post.js');
var user = require('./routes/api/user.js');
var config = require('./routes/api/config.js');

var blog = require('./routes/blog.js');
var index = require('./routes/index.js');

var admin = require('./routes/admin.js');

module.exports = function(app) {
	app.use('/', index)
	app.use('/blog/', blog);
	app.use('/admin', admin);
	app.use('/api/post', post);
	app.use('/api/user', user);
	app.use('/api/config', config);
};