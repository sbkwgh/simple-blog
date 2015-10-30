var commentsEl = document.querySelector('#comments');
var urlPostId = location.href.split('/').slice(-1)[0].split('#')[0];
var Comment= Model.new('comment', {
	postId: 'string',
	parentCommentId: 'string',
	parentCommentName: 'string',
	name: 'string',
	body: 'string',
	date: 'string'
});

function getCommentEl(el) {
	if(el.classList.contains('comment')) {
		return el;
	} else if(el.tagName === 'BODY') {
		return null;
	} else {
		return getCommentEl(el.parentElement)
	}
}

function toggleReplyButton(ev) {
	var commentEl = getCommentEl(ev.target);
	if(commentEl) {
		commentEl.querySelector('.comment-reply-button').classList.toggle('hidden');
	}
}

function addComment(params) {
	var comment = document.createElement('div');
		var commentNameTime = document.createElement('div');
			var commentName = document.createElement('span');
			//space
			var i = document.createElement('i');
			//space
			var commentReplyLink = document.createElement('span')
			//space
			var commentTime = document.createElement('span');
		var commentBody = document.createElement('div');
		var commentReplyButton = document.createElement('div');

	comment.setAttribute('class', 'comment');
	comment.setAttribute('id', '_id' + params._id);
	if(params.parentCommentId) {
		comment.setAttribute('data-parent-id', '_id' + params.parentCommentId);
	}
		commentNameTime.setAttribute('class', 'comment-name-time');
			commentName.setAttribute('class', 'comment-name');
			if(params.authorComment) {
				commentName.classList.add('comment-author');
			}
			i.setAttribute('class', 'fa fa-long-arrow-right');
			commentReplyLink.setAttribute('class', 'comment-reply-link');
			commentTime.setAttribute('class', 'comment-time');
		commentBody.setAttribute('class', 'comment-body');
		commentReplyButton.setAttribute('class', 'comment-reply-button hidden');

	commentName.innerHTML = params.name;
	commentReplyLink.innerHTML = params.parentCommentName;
	commentBody.innerHTML = params.body;
	commentTime.innerHTML =  new Date(params.date).toLocaleString().slice(0, 10);
	commentReplyButton.innerHTML = 'Reply'

	commentNameTime.appendChild(commentName);
	commentNameTime.appendChild(document.createTextNode(' '));
	if(params.parentCommentId) {
		commentNameTime.appendChild(i);
		commentNameTime.appendChild(document.createTextNode(' '));
		commentNameTime.appendChild(commentReplyLink);
		commentNameTime.appendChild(document.createTextNode(' '));
	}
	commentNameTime.appendChild(commentTime);

	comment.appendChild(commentNameTime);
	comment.appendChild(commentBody);
	comment.appendChild(commentReplyButton);

	return comment;
}
function addComments(commentsArr) {
	var commentsHolder = document.querySelector('#comments')
	commentsHolder.innerHTML = '';

	commentsArr.forEach(function(comment) {
		commentsHolder.appendChild(addComment(comment));
	})
}

commentsEl.addEventListener('click', function(ev) {
	var commentEl;
	var commentId;
	var commentName;

	if(ev.target.classList.contains('comment-reply-link')) {
		commentEl = ev.target.parentElement.parentElement;
		parentId = commentEl.getAttribute('data-parent-id');
		document.querySelector('#' + parentId).classList.remove('highlight-comment');
		document.querySelector('#' + parentId).classList.add('highlight-comment');
		location.hash = parentId;
	} else if(ev.target.classList.contains('comment-reply-button')) {
		commentEl = ev.target.parentElement;
		commentId = commentEl.getAttribute('name');
		commentName = commentEl.querySelector('.comment-name').innerHTML;

		document.querySelector('#body-container').classList.add('show-reply-comment-bar');
		document.querySelector('#reply-comment-bar-text').innerHTML =
			'Replying to <b>@' +
			commentEl.querySelector('.comment-name').innerHTML +
			'</b>: ' +
			commentEl.querySelector('.comment-body').innerHTML.slice(0, 20) +
			'...';
		document.querySelector('#add-comment-form').setAttribute('data-parent-id', commentId)
		document.querySelector('#add-comment-form').setAttribute('data-parent-name', commentName)
	}
});

document.querySelector('#reply-comment-bar-cancel').addEventListener('click', function() {
	document.querySelector('#add-comment-form').setAttribute('data-parent-id', '');
	document.querySelector('#add-comment-form').setAttribute('data-parent-name', '');
	document.querySelector('#body-container').classList.remove('show-reply-comment-bar');
})

document.querySelector('#add-comment-form textarea').addEventListener('keyup', function(ev) {
	ev.target.style.height = '';
	ev.target.style.height = ev.target.scrollHeight-8 + "px";
})

commentsEl.addEventListener('mouseover', toggleReplyButton);
commentsEl.addEventListener('mouseout', toggleReplyButton);

commentsEl.addEventListener('animationend', function(ev) {
	ev.target.classList.remove('highlight-comment');
});

document.querySelector('#submit-comment').addEventListener('click', function() {
	var form = document.querySelector('#add-comment-form');
	var newComment = {};

	newComment.name = form.name.value.trim();
	newComment.body = form.body.value.trim();
	newComment.postId = urlPostId;

	if(form.getAttribute('data-parent-name')) {
		newComment.parentCommentName = form.getAttribute('data-parent-name');
	}
	if(form.getAttribute('data-parent-id')) {
		newComment.parentCommentId = form.getAttribute('data-parent-id');
	}
	if(document.cookie && document.cookie.contains('author')) {
		newComment.name = document.querySelector('input').getAttribute('data-author');
		newComment.authorComment = true;
	}

	if(!newComment.name || !newComment.body) return;

	new Comment(newComment).save(function(err, post) {
		if(!err) {
			if(document.querySelector('#comments').innerHTML === 'There are no comments for this post. Add one below'){
				document.querySelector('#comments').innerHTML = '';
			}
			document.querySelector('#comments').appendChild(addComment(post));
			form.name.value = '';
			form.body.value = '';	
		}
	})
});

Model.rootUrl = '/api'

Comment.get(urlPostId, function(err, posts) {
	if(!err) {
		if(!posts.length) {
			document.querySelector('#comments').innerHTML = 'There are no comments for this post. Add one below';
		} else {
			addComments(posts);
		}
	}
});
