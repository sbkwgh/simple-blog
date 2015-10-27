var Router = function(templateContainer, menuBar) {
	var self = this;

	this.menuBar = menuBar;
	this.routes = {};
	this.templateContainer = templateContainer;


	this.getTemplateNameHTML = function() {
		var templateName = (location.hash.slice(1) ? location.hash.slice(1) : 'index');
		var templateEl = document.querySelector('script[data-template="' + templateName + '"]');
		var templateHTML;

		//If there is no template for the path
		if(!templateEl) {
			templateEl = document.querySelector('script[data-template="templateNotFound"]');

			self.currentTemplateName = 'templateNotFound';
			self.currentTemplate = templateEl.innerHTML;
		} else {
			self.currentTemplateName = templateName;
			self.currentTemplate = templateEl.innerHTML;
		}

		this.runRouteHandlerFromRoute(templateName);


		if(
			self.currentTemplateName !== 'templateNotFound' &&
			self.previousRouteFirstSegment !== self.currentRouteFirstSegment
		) {
			self.menuBar.changeMenuItems(self.currentTemplateName);
		}

		self.previousRouteFirstSegment = self.currentRouteFirstSegment;

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
		function selectLink() {
			var selectedLinkEl = document.querySelector('div[data-link="' + location.hash.slice('1') + '"]');
			if(selectedLinkEl) {
				selectedLinkEl.click();
			}
		}

		self.currentRouteFirstSegment = location.hash.slice('1').split('/')[0];
		self.getTemplateNameHTML();

		if(self.currentRouteFirstSegment !== self.previousRouteFirstSegment) {
			setTimeout(selectLink, 2000);
		} else {
			selectLink();
		}
	
		templateContainer.classList.add('fadeout');
	});
	window.addEventListener('load', function() {
		self.currentRouteFirstSegment = location.hash.slice('1').split('/')[0];
		self.templateContainer.innerHTML = self.getTemplateNameHTML();

		setTimeout(function() {
			var selectedLinkEl = document.querySelector('div[data-link="' + location.hash.slice('1') + '"]');
			if(selectedLinkEl) {
				selectedLinkEl.click();
			}
		}, 2000)
	})
	
	this.change = function(templateName) {
		location.hash = templateName;
	}

	this.addRoute = function(route, cb) {
		var routeSegments;
		var routeSegment;
		var subRoute = this.routes;

		if(route[0] === '/') {
			route = route.slice(1)
		}

		routeSegments = route.split('/');

		for(var i = 0; i < routeSegments.length; i++) {
			routeSegment = routeSegments[i];
			if(!subRoute[routeSegment]) {
				subRoute[routeSegment] = {};
			}

			if(i === routeSegments.length-1) {
				subRoute[routeSegment] = cb;
			}

			subRoute = subRoute[routeSegment];
		}
	};

	this.runRouteHandlerFromRoute = function(route) {
		var routeSegments = route.split('/');
		var subRoutes = this.routes;
		var routeSegment;
		var returnSegments = {};

		for(var i = 0; i < routeSegments.length; i++) {
			
			for(routeSegment in subRoutes) {
				if(routeSegment[0] === ':') {
					returnSegments[routeSegment.slice(1)] = routeSegments[i];
					subRoutes = subRoutes[routeSegment]
					break;
				} else if(routeSegment === routeSegments[i]) {
					subRoutes = subRoutes[routeSegment]
					break;
				}
			}
			
			if(i === routeSegments.length-1 && typeof subRoutes === 'function') {
				subRoutes(returnSegments);
				return true;
			}
		}
	}
};