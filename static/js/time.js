var Time = function(params) {
	function correctPlural(num, word) {
		if(num === 1) {
			return word;
		} else {
			return word + 's';
		}
	}

	Object.defineProperty(this, 'el', {
		get: function() {
			var el = document.querySelector(params.querySelector);
			if(el) {
				return el;
			} else {
				return null;
			}
		}
	});

	this.saveText = params.saveText;
	this.failTextl = params.failText;
	if(params.icon) {
		this.icon = '<i class="fa fa-' + params.icon + '"></i>&nbsp;';
	} else {
		this.icon = '';
	}

	this.fail = function() {
		if(!this.el) return;

		this.el.innerHTML = this.icon + this.failText;
	}
	this.resetTime = function() {
		if(!this.el) return;

		this.el.setAttribute('data-date', new Date().getTime());
		this.el.innerHTML = 
			this.icon +
			this.saveText +
			' just now (' +
			new Date().toTimeString().slice(0, 5) +
			')';
		
		this.el.classList.add('glow');
		this.el.addEventListener('animationend', function(ev) {
			ev.target.classList.remove('glow');
		})
	
	}
	this.updateTime = function() {
		if(!this.el) return;

		if(!this.el.getAttribute('data-date')) {
			return;
		}

		var msElapsed = new Date().getTime() - this.el.getAttribute('data-date');
		var timeObj = {};

		timeObj.seconds = Math.floor(msElapsed / 1000);
		timeObj.minutes = Math.floor(timeObj.seconds / 60);
		timeObj.hours = Math.floor(timeObj.minutes / 60);

		if(timeObj.minutes && timeObj.minutes <= 60) {
			this.el.innerHTML = 
				this.icon +
				this.saveText + 
				' ' +
				timeObj.minutes +
				' ' +
				correctPlural(timeObj.minutes, 'minute') +
				' ago';
		} else if(timeObj.hours) {
			this.el.innerHTML = 
				this.icon +
				this.saveText + 
				timeObj.hours + 
				'' +
				correctPlural(timeObj.hours, 'hour') + 
				' ago';
		}
	}

	setInterval(this.updateTime, 3000);
};