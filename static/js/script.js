var blogMenuBar = new MenuBar(
	document.querySelector('#list-groups'),
	{
		'pencil:Posts': [],
		'cog:Settings': ['account', 'themes', 'users'],
		'comment:Comments': ['manage', 'delete']
	}
);

var blogTagBar = new TagBar('#tag-bar');

Model.rootUrl = '/api'

var updateTime = new Time({
	querySelector: '#autosave-time',
	failText: 'Could not save post. Check your connection',
	saveText: 'Saved',
	icon: 'cloud'
});

var Post = Model.new('post', {
	title: 'string',
	body: 'string',
	date: 'string',
	_id: {type: 'string', primaryKey: true},
	tags: 'array',
	published: 'boolean',
}, 3000, function(err, success) {
	if(err) {
		updateTime.fail();
	} else {
		updateTime.resetTime();
	}
});

var blogPost = new Post({
	title: 'Click to edit this title'
});


var App = new Router(document.querySelector('#main'), blogMenuBar, {
	posts: function() {
		document.querySelector('#main').classList.add('overlay');
		document.querySelector('#message-box').classList.remove('hidden');

		Post.get(function(err, posts) {
			if(err) return;

			blogMenuBar.menuItems['pencil:Posts'] = posts;
			blogMenuBar.menuItems = blogMenuBar.menuItems;
		});
	},
	index: function() {
		document.querySelector('#main').classList.remove('overlay');
		document.querySelector('#message-box').classList.add('hidden');
	}
});

blogMenuBar.el.addEventListener('click', function(ev) {
	if(!ev.target.classList.contains('lg-item')) return;

	var _id = ev.target.getAttribute('data-_id');
	var selected = document.querySelector('.lg-item-selected');

	document.querySelector('#main').classList.remove('overlay');
	document.querySelector('#message-box').classList.add('hidden');

	if(selected) {
		selected.classList.remove('lg-item-selected');
	}

	ev.target.classList.add('lg-item-selected')

	if(_id) {
		Post.get(_id, function(err, post) {
			if(!err) {
				var unpublish = document.querySelector('#unpublish-post-button');
				var publish = document.querySelector('#publish-post-button');
				if(publish && unpublish) {
					if(post.published) {
						publish.classList.add('hidden');
						unpublish.classList.remove('hidden')
					} else {
						publish.classList.remove('hidden');
						unpublish.classList.add('hidden')		
					}
				}
				document.querySelector('#post-title').value = post.title;
				MarkdownEditor.textarea = post.body;
				blogPost.data._id = post._id;
				blogPost.data.published = post.published;
				blogTagBar.tags = post.tags;
			}
		});
	}
})

Tooltip.onClick(
	'#delete-post-button',
	'Are you sure you want to delete this post?',
	{	
		text: 'Yes, delete',
		colour: 'red',
		eventListener: function(e) {
			blogPost.delete(function(err, success) {
				if(!err) {
					MarkdownEditor.textarea.value = '';
					document.querySelector('#post-title').value = 'Click to edit this title';
					blogTagBar.tags = [];
					document.querySelector('#main').classList.add('overlay');
					document.querySelector('#message-box').classList.remove('hidden');
					App.initFunctions.posts();

					blogPost = new Post({
						title: 'Click to edit this title',
						body: 'Start writing here',
						tags: []
					});
				}
				e.removeTooltip();
			})
		}
	},
	{text: 'Cancel'}
);


Tooltip.onClick(
	'#account',
	'<a href="#" id="logout">Logout</a>'
);
on('#logout', 'click', function() {
	document.cookie = 'loggedInUser =; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	document.cookie = 'author =; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	location.href = '/admin/login';
});

['#unpublish-post-button', '#publish-post-button'].forEach(function(el) {
	on(el, 'click', function(ev) {
		blogPost.data.published = !blogPost.data.published;
		document.querySelector('#publish-post-button').classList.toggle('hidden');
		document.querySelector('#unpublish-post-button').classList.toggle('hidden')	
	});
});

['#new-post-button-message-box', '#new-post-button'].forEach(function(el) {
	on(el, 'click', function(ev) {
		document.querySelector('#main').classList.remove('overlay');
		document.querySelector('#message-box').classList.add('hidden');

		document.querySelector('#publish-post-button').classList.remove('hidden');
		document.querySelector('#unpublish-post-button').classList.add('hidden');

		blogPost = new Post({
			title: 'Click to edit this title',
			body: 'Start writing here',
			tags: []
		})

		blogPost.save(function(err, savedPost) {
			if(err) {
				console.log(err);
			} else {
				document.querySelector('#post-title').value = savedPost.title;
				MarkdownEditor.textarea = savedPost.body;
				blogTagBar.tags = [];
				blogMenuBar.menuItems['pencil:Posts'].push(savedPost);
				blogMenuBar.menuItems = blogMenuBar.menuItems;
			}
		})
	});
});