var router = require('express').Router();
var Config = require('../../models/config.js');

router.get('/', function(req, res) {
	Config.getOrCreateConfig(function(err, config) {
		if(err) {
			res.json({error: 'unknown error'})
		} else {
			res.json(config);
		}
	})
})

router.get('/css.css', function(req, res) {
	Config.getOrCreateConfig(function(err, config) {
		if(err) {
			console.log(err)
			res.send('unknown error')
		} else {
			var css = 
				"html, body {" + 
				"	font-family: '" + config.appearance.font.default + "', 'sans-serif';" +
				"}" +
				".post-body {" +
				"	font-family: '" + config.appearance.font.postBody + "', 'sans-serif';" +
				"	color: " + config.appearance.colour.postBody + ";" +
				"}" +
				".post-title {" +
				"	font-family: '" + config.appearance.font.postTitle + "', 'sans-serif';" +
				"	color: " + config.appearance.colour.postTitle + ";" +
				"}" +
				"a:hover {" +
				"	color: " + config.appearance.colour.link.hover + ";" +
				"}" +
				"a:active {" +
				"	color: " + config.appearance.colour.link.active + ";" +
				"}" +
				"a: {" +
				"	color: " + config.appearance.colour.link.default + ";" +
				"}" +
				"a:visited {" +
				"	color: " + config.appearance.colour.link.visited + ";" +
				"}" +
				"#color-bar {" +
				"	background-color: " + config.appearance.colour.topBar + ";" +
				"}" + 
				"header a, header a:vistied, header a:active, header a:hover {" +
				"	font-family: '" + config.appearance.font.blogTitle + "', 'sans-serif';" +
				"	color: " + config.appearance.colour.blogTitle + ";" +
				"}";

			res.header('Content-type', 'text/css')
			res.send(css);
		}
	})
});

router.get('/js.js', function(req, res) {
	Config.getOrCreateConfig(function(err, config) {
		if(err) {
			console.log(err)
			res.send('unknown error')
		} else {
			var fontFamilies = [
				config.appearance.font.default,
				config.appearance.font.postBody,
				config.appearance.font.postTitle,
				config.appearance.font.blogTitle,
				'Roboto'
			];
			var js =
				'WebFont.load({' +
				'	google: {' +
				'		families:' + '["' + fontFamilies.join('","') + '"]' +
				'	}' +
				'});'

			res.header('Content-type', 'text/javascript');
			res.send(js)
		}
	});
});

router.put('/', function(req, res) {
	var configObject = JSON.parse(req.body.json)

	if(!req.signedCookies.loggedInUser) {
		res.json({error: 'Request not authorised'})
	} else {
		Config.findOneAndUpdate({}, configObject, {upsert: true}, function(err, updatedConfig) {
			if(err) {
				console.log(err)
				res.json({error: 'unknown error'});
				return;
			}

			res.json(updatedConfig);
		});
	}
});

module.exports = router;