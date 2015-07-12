Router.configure({
	layoutTemplate: 'layout'
});

// Requires login
var OnBeforeActions = {
	loginRequired: function () {
		if (!Meteor.userId()) {
			this.render('login');
		}
		else {
			this.next();
		}
	}
};
Router.onBeforeAction(OnBeforeActions.loginRequired, {
	only: ['profile', 'login']
});

// Routes
Router.route('/', function () {
	this.render('home');
});

Router.route('/profile', function () {
	if (Meteor.userId())
		this.render('profile');
	else
		Router.go('home');
});
Router.route('/admin', function () {
	this.render('admin');
});
