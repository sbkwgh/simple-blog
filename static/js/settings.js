function addInput(id, path) {
	var el = document.querySelector(id);
	var pathArr = path.split('.');
	var configSubObj = addInput.config;

	if(el) {
		for(var i = 0; i < pathArr.length; i++) {
			if(!configSubObj[pathArr[i]]) {
				configSubObj[pathArr[i]] = {};
			}
			if(i === pathArr.length-1) {
				configSubObj[pathArr[i]] = el.value.trim() || undefined;
				break;
			}
			configSubObj = configSubObj[pathArr[i]]
		}
	}
}

on('#save-appearance-settings', 'click', function(ev) {
	var appearanceConfig = {};
	var updateAppearanceSavedTime = new Time({
		querySelector: '#appearance-save-time',
		failText: 'Could not save setings. Check your connection',
		saveText: 'Settings saved'
	});

	addInput.config = appearanceConfig;

	addInput('#blog-title-font', 'font.blogTitle')
	addInput('#post-title-font', 'font.postTitle')
	addInput('#post-body-font', 'font.postBody')
	addInput('#default-font', 'font.default')

	addInput('#default-link-colour', 'colour.link.default')
	addInput('#hover-link-colour', 'colour.link.hover')
	addInput('#visited-link-colour', 'colour.link.visted')
	addInput('#active-link-colour', 'colour.link.active')
	addInput('#top-bar-colour', 'colour.topBar')
	addInput('#blog-title-colour', 'colour.blogTitle')
	addInput('#post-title-colour', 'colour.postTitle')
	addInput('#post-body-colour', 'colour.postBody')

	Request.put('/api/config', {json: JSON.stringify({appearance: appearanceConfig})}, function(err, result) {
		if(!err) {
			updateAppearanceSavedTime.fail();
		} else {
			updateAppearanceSavedTime.resetTime();
		}
	});
})

on('#save-general-settings', 'click', function(ev) {
	var generalConfig = {};
	var updateGeneralSavedTime = new Time({
		querySelector: '#general-save-time',
		failText: 'Could not save setings. Check your connection',
		saveText: 'Settings saved'
	});

	addInput.config = generalConfig;

	addInput('#blog-title', 'blog.title')
	addInput('#blog-description', 'blog.description')

	Request.put('/api/config', {json: JSON.stringify({general:generalConfig})}, function(err, result) {
		if(!err) {
			updateGeneralSavedTime.fail();
		} else {
			updateGeneralSavedTime.resetTime();
		}
	});
})