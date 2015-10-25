var Router = function(templateContainer, menuBar, initFunctions) {
	var self = this;

	this.menuBar = menuBar;
	this.templateContainer = templateContainer;
	this.initFunctions = initFunctions;

	this.getTemplateNameHTML = function() {
		var templateName = (location.hash.slice(1) ? location.hash.slice(1) : 'index');
		var templateEl = document.querySelector('script[data-template="' + templateName + '"]');
		var templateHTML;

		if(!templateEl) {
			templateEl = document.querySelector('script[data-template="templateNotFound"]');

			self.currentTemplateName = 'templateNotFound';
			self.currentTemplate = templateEl.innerHTML;
		} else {
			self.currentTemplateName = templateName;
			self.currentTemplate = templateEl.innerHTML;
		}

		if(self.initFunctions[self.currentTemplateName]) {
			self.initFunctions[self.currentTemplateName]()
		}


		if(self.currentTemplateName !== 'templateNotFound') {
			self.menuBar.changeMenuItems(self.currentTemplateName);
		}

		return self.currentTemplate;
	}

	this.templateContainer.addEventListener('animationend', function() {
		var templateContainer = self.templateContainer;

		if(templateContainer.classList.contains('fadeout')) {
			templateContainer.innerHTML = self.currentTemplate;

			templateContainer.classList.add('fadein');
			templateContainer.classList.remove('fadeout');
		} else if(templateContainer.classList.contains('fadein')) {
			templateContainer.classList.remove('fadein');
		}
	});

	window.addEventListener('hashchange', function() {
		self.getTemplateNameHTML();
		

		templateContainer.classList.add('fadeout');


	});
	window.addEventListener('load', function() {
		self.templateContainer.innerHTML = self.getTemplateNameHTML();
	})
	
	this.change = function(templateName) {
		location.hash = templateName;
	}
};
