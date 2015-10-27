var MenuBar = function(el, menuItems) {
	var self = this;
	var menuItems = menuItems;
	var backButton = (function() {
		var button = document.createElement('i');
		button.setAttribute('class', 'lg-header-back fa fa-arrow-left');

		return button;
	})();

	this.el = el;

	Object.defineProperty(this, 'menuItems', {
		get: function() {
			return menuItems;
		},
		set: function(val) {
			var specificList = self.buildSpecificList(location.hash.slice(1)).innerHTML;
			menuItems = val;

			self.el.querySelector('.specific-list').innerHTML = specificList;
		}
	})

	this.changeMenuItems = function(menuHeader) {
		var listGroup;
		var selectedItem = menuHeader.split('/')[1];
		menuHeader = menuHeader.split('/')[0];

		if(menuHeader === 'index') {
			if(self.el.querySelector('.specific-list')) {
				var indexList = self.rebuildIndexList();
				indexList.classList.add('slideoutlist');
				
				self.el.querySelector('.specific-list').classList.add('slideinlist');
				self.el.appendChild(indexList)

				setTimeout(function() {
					var list = self.el.querySelector('.list-group');
					indexList.classList.remove('slideoutlist')
					list.parentElement.removeChild(list);
				}, 1000);
			} else {
				self.el.innerHTML = '';
				self.el.appendChild(self.rebuildIndexList());
			}
			return;
		}

		listGroup = this.buildSpecificList(menuHeader);
		listGroup.classList.add('slidein');

		self.el.querySelector('.index-list').classList.add('slideout')
		
		self.el.appendChild(listGroup);

		setTimeout(function() {
			self.el.removeChild(self.el.querySelector('.index-list'))
			listGroup.classList.remove('slidein');
			listGroup.classList.remove('slideoutlist');
			self.el.appendChild(listGroup);
		}, 1000)
	}

	this.buildSpecificList = function(menuHeader) {
		var menuHeaderDisplayName = menuHeader.toLowerCase();
		var items = this.menuItems[menuHeader];

		if(!items) {
			for(var menuHeaderName in this.menuItems) {
				if(menuHeaderName.toLowerCase().split(':')[1] === menuHeader) {
					items = this.menuItems[menuHeaderName];
					menuHeader = menuHeaderName;
					break;
				}
			}
		}

		var listGroup = document.createElement('div');
		var lgHeader = document.createElement('div');
		var noItemsDiv =  document.createElement('div');
		
		listGroup.setAttribute('class', 'list-group specific-list');

		lgHeader.classList.add('lg-header');
		noItemsDiv.classList.add('lg-no-items');

		if(menuHeader.split(':')[1]) {
			lgHeader.appendChild(document.createTextNode(menuHeader.split(':')[1]))
		} else {
			lgHeader.appendChild(document.createTextNode(menuHeader));
		}
		lgHeader.style.textAlign = 'center';
		lgHeader.style.padding= '0.25rem 0.5rem';
		
		lgHeader.appendChild(backButton)
		listGroup.appendChild(lgHeader)

		for(var i = 0; i < items.length; ++i) {
			var lgItem = document.createElement('div');

			lgItem.classList.add('lg-item');

			if(typeof items[i] === 'string') {
				lgItem.appendChild(document.createTextNode(items[i]));
			} else {
				lgItem.appendChild(document.createTextNode(items[i].title));
				if(items[i]._id) {
					lgItem.setAttribute('data-_id', items[i]._id)
				}
				if(items[i].link) {
					lgItem.setAttribute('data-link', items[i].link)
				}
			}

			listGroup.appendChild(lgItem);
		}

		if(!items.length) {
			noItemsDiv.innerHTML = 'No ' + menuHeaderDisplayName + ' found';
			listGroup.appendChild(noItemsDiv)
		}

		return listGroup;
	}
	this.rebuildIndexList = function() {
		var listGroup = document.createElement('div');

		listGroup.setAttribute('class', 'list-group index-list');


		for(var menuHeader in this.menuItems) {
			var lgHeader = document.createElement('div');
			var icon = document.createElement('i');

			var components = menuHeader.split(':')

			lgHeader.classList.add('lg-header');
			lgHeader.classList.add('lg-header-thin');
			lgHeader.setAttribute('data-index-list', 'true');

			//i.e. if there is an icon name
			if(components[1]) {
				icon.setAttribute('class', 'fa fa-fw fa-' + components[0])

				lgHeader.appendChild(icon);
				lgHeader.appendChild(document.createTextNode(' ' + components[1]));
			} else {
				lgHeader.appendChild(document.createTextNode(menuHeader));
			}

			listGroup.appendChild(lgHeader);
		}
		return listGroup;

	}

	this.el.addEventListener('click', function(ev) {
		var target = ev.target;
		var icon = target.querySelector('i');
		var name = target.textContent;
		var templateName = name;

		if(
			target.classList.contains('lg-header') &&
			target.getAttribute('data-index-list')
		) {
			if(icon !== null) {
				templateName = templateName.slice(1);
			}
			
			App.change(templateName.toLowerCase())
		}
	});

	self.el.addEventListener('click', function(ev) {
		if(ev.target === document.body.querySelector('.fa-arrow-left')) {
			App.change('index')
		}
	});

	self.el.addEventListener('click', function(ev) {
		if(ev.target.getAttribute('data-link')) {
			location.hash = ev.target.getAttribute('data-link');
		}
	})

	self.el.innerHTML = '';
	self.el.appendChild(self.rebuildIndexList());

};