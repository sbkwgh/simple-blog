var fs = require('fs');
var crypto = require('crypto')
var content; 

try {
	content = fs.readFileSync('./cookiesecret').toString();
} catch(err) {
	content = crypto.randomBytes(48).toString('hex');
	fs.writeFileSync('./cookiesecret', content);
}

module.exports = content;