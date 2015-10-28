var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var swig = require('swig');
var routes = require('./routes.js');

var db;
var app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieParser(require('./getCookieSecret')));


app.use('/static', express.static('static'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', './templates');

routes(app);

mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost/simple-blog');
db = mongoose.connection;

db.on('err', function() {
	console.log('Error in connecting to mongodb');
})

db.once('open', function() {
	console.log('Connected to mongodb');
	app.listen(process.env.PORT || 5000, function() {
		console.log('Listening on port 5000')
	});
});