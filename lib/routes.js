Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
});

Router.route('/', function () {
	this.render('home');
});

var reqLogin = ['profile'];
var reqAdmin = ['admin'];
var reqOwner = ['settings'];
var waitOn = {scholars: "scholars", timeline: "scholars", quotes: "scholars"};

Router.route('/:base/:a?/:b?/:c?/:d?/:e?', function () {
	var base = this.params.base;

	// Pages first...
	if (Template[base] !== undefined) {
		if (reqLogin.indexOf(base) > -1 && !Meteor.userId()) {
			this.render('notLoggedIn');
		}
		else if ((reqAdmin.indexOf(base) > -1 || reqOwner.indexOf(base) > -1) && !Meteor.userId()) {
			this.render('notFound');
		}
		else if ((reqAdmin.indexOf(base) > -1 && !Roles.userIsInRole(Meteor.userId(), ['admin', 'owner'])) || (reqOwner.indexOf(base) > -1) && !Roles.userIsInRole(Meteor.userId(), ['owner'])) {
			this.render('accessDenied');
		}
		else {
			if (waitOn[base] !== undefined) {
				var coll = waitOn[base];
				this.render(base, { waitOn: function () { return Meteor.subscribe(coll); }});
				// return [one,two];
			}
			else
				this.render(base);
		}
	}

	// Scholars second...
	else if (Meteor.scholars.findOne({slug: base}) !== undefined) {
		var scholar = Meteor.scholars.findOne({slug: base});
		this.render('bio', {data: scholar});
	}

	else
		this.render('notFound');
});















/*
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
 Router.route('/scholars', function () {
 this.render('scholars');
 });
 
 Router.route('/timeline', function () {
 this.render('timeline');
 });
 
 Router.route('/quotes', function () {
 this.render('quotes');
 });
 
 Router.route('/tools', function () {
 this.render('tools');
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
 */