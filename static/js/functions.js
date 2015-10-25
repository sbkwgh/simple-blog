var on = function(querySelector, event, cb) {
	document.addEventListener(event, function(ev) {
		if(document.querySelector(querySelector) === ev.target) {
			cb(ev);
		}
	})
}
