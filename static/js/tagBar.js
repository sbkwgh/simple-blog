var TagBar = function(querySelector) {
	var self = this;
	var tags = [];;

	function createNewTagDiv(name) {
		var tagDiv = document.createElement('div');
		var deleteDiv = document.createElement('div');

		tagDiv.classList.add('tb-tag');
		deleteDiv.classList.add('tb-tag-delete');
		deleteDiv.innerHTML = '&times;'

		tagDiv.appendChild(document.createTextNode(name));
		tagDiv.appendChild(deleteDiv);

		return tagDiv;
	}

	function recreateTagsInDom() {
		var DOMTags = self.el.querySelectorAll('.tb-tag');

		if(DOMTags) {
			//Clear all tags
			[].forEach.call(DOMTags, function(DOMTag) {
				DOMTag.parentElement.removeChild(DOMTag);
			});
		}

		self.tagWidthTotal = 0;
		self.input.style.width = '100%';
		self.input.style.marginLeft = 0;

		blogPost.data.tags = tags;

		tags.forEach(function(tag, index) {
			var newTag = createNewTagDiv(tag);

			newTag.setAttribute('data-tag-index', index);

			self.el.appendChild(newTag)

			self.tagWidthTotal += newTag.clientWidth + 2 + 2;
			self.input.style.width = 'calc(100% - ' + self.tagWidthTotal + 'px)';
			self.input.style.marginLeft = self.tagWidthTotal + 'px';
		})
	}

	Object.defineProperty(this, 'tags', {
		get: function() {
			return tags;
		},
		set: function(val) {
			if(typeof val === 'string') {
				val = val.split(',');
			}
			tags.length = 0;
			for(var i = 0; i < val.length; i++) {
				tags[i] = val[i];
			}
			recreateTagsInDom();
		}
	})


	tags.push = function(val) {
		[].push.call(this, val);
		recreateTagsInDom();
	}
	tags.pop = function(val) {
		[].pop.call(this);
		recreateTagsInDom();
	}
	tags.remove = function(tag) {
		var index = +tag.getAttribute('data-tag-index');

		self.tags.splice(index, 1);
		recreateTagsInDom();
	}

	Object.defineProperty(this, 'el', {
		get: function() {
			return document.querySelector(querySelector);
		}
	})
	Object.defineProperty(this, 'input', {
		get: function() {
			return document.querySelector(querySelector + ' input');
		}
	});


	this.tagWidthTotal = 0;
	
	document.body.addEventListener('keydown', function(ev) {
		if(document.querySelector(querySelector + ' input') !== ev.target) return;

		var value = ev.target.value;
		var tag;
		var repeatedTag;

		if([13, 59, 188, 32].indexOf(ev.which) > -1) {
			if(!value.trim().length) return;

			if(tags.indexOf(value) !== -1) {
				repeatedTag = self.el.querySelector('.tb-tag[data-tag-index="' + tags.indexOf(value) + '"]');

				repeatedTag.classList.add('tb-tag-shadow-pulse');

				repeatedTag.addEventListener('animationend', function animationend() {
					repeatedTag.classList.remove('tb-tag-shadow-pulse');
					repeatedTag.removeEventListener('animationend', animationend);
				})

				return;
			}

			tags.push(self.input.value);
			self.input.value = '';

			ev.preventDefault();
		}
	})
	document.body.addEventListener('keydown', function(ev) {
		if(document.querySelector(querySelector + ' input') !== ev.target) return;

		var value = tags[tags.length-1];
		var tag;

		if(
			ev.which === 8 &&
			tags.length &&
			!self.input.value.length
		) {
			tags.pop();
			self.input.value = value;

			ev.preventDefault();
		}
	});
	document.body.addEventListener('click', function(ev) {
		var target = ev.target;
		if(target.classList.contains('tb-tag-delete')) {
			tags.remove(target.parentElement);
		}
	})
}