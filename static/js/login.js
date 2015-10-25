function errorMsg(message, delay) {
	var form = document.querySelector('form:not(.hidden)');
	var messageDiv = 	document.querySelector('#message');

	messageDiv.innerHTML = message || 'Unknown error';

	form.classList.add('blur');
	document.querySelector('#message').classList.remove('hidden');

	setTimeout(function() {
		form.classList.remove('blur');
		document.querySelector('#message').classList.add('hidden');
	}, delay);
}
function toggleLoadScreen(show) {
	var form = document.querySelector('form:not(.hidden)');

	if(show) {
		form.classList.add('blur');
		document.querySelector('#load').classList.remove('hidden');
	} else {
		form.classList.remove('blur');
		document.querySelector('#load').classList.add('hidden');	}
}

on('#create-account-link', 'click', function() {
	document.querySelector('#create-account').classList.toggle('hidden');
	document.querySelector('#login').classList.toggle('hidden');
})
on('#login-link', 'click', function() {
	document.querySelector('#create-account').classList.toggle('hidden');
	document.querySelector('#login').classList.toggle('hidden');
})

Model.rootUrl = '/api'
var User = Model.new('user', {
	username: {primaryKey: true, type: 'string'},
	author: 'string',
	hash: 'string'
});

var currentUser = new User({});
var newUser = new User({});

on('#login-button', 'click', function() {
	var loginForm = document.querySelector('#login');
	currentUser.data.username = loginForm.username.value.trim();
	currentUser.data.hash = loginForm.password.value;

	if(!currentUser.data.username || !currentUser.data.hash) {
		errorMsg('Username and password not filled in', 2000);
		return;
	}

	currentUser.post(currentUser.data.username, function(result) {
		if(result.error) {
			if(result.error === 'user not found') {
				errorMsg('Username not found', 2000);
			} else {
				errorMsg('Something went wrong on our side - try again later', 2000);
			}
		} else if(result.success) {
			location.href = '/admin';
		} else {
			errorMsg('Incorrect password', 2000);
		}
	});
});

document.querySelector('#login-button').addEventListener('click', function(ev) {
	var loginForm = document.querySelector('#login');
	currentUser.data.username = loginForm.username.value.trim();
	currentUser.data.hash = loginForm.password.value;

	if(!currentUser.data.username || !currentUser.data.hash) {
		errorMsg('Username and password not filled in', 2000);
		return;
	}


	currentUser.post(currentUser.data.username, function(result) {
		if(result.error) {
			if(result.error === 'user not found') {
				errorMsg('Username not found', 2000);
			} else {
				errorMsg('Something went wrong on our side - try again later', 2000);
			}
		} else if(result.success) {
			location.href = '/admin';
		} else {
			errorMsg('Incorrect password', 2000);
		}
	});
});

on('#create-account-button', 'click', function() {
	var createAccountForm = document.querySelector('#create-account');
	newUser.data.username = createAccountForm.username.value.trim();
	newUser.data.hash = createAccountForm.password.value;
	newUser.data.author = createAccountForm.author.value.trim();

	if(!newUser.data.username || !newUser.data.author || !newUser.data.hash) {
		errorMsg('Fields must not be blank', 2000);
		return;
	}
	if(newUser.data.hash.length < 10) {
		errorMsg('Password must be <b>at least 10 characters long<b>', 2000);
		return;
	}

	newUser.save(function(err, savedUser) {
		if(err) {
			if(err === 'account already created') {
				errorMsg('An account has already been created for this blog', 2000);
			} else {
				errorMsg('Something went wrong on our side - try again later', 2000);
			}
		} else {
			location.href = '/admin';
		}
	});
});