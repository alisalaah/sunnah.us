Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound'
});
Router.onBeforeAction('loading');
Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

Router.route('/:base?/:a?/:b?/:c?/:d?/:e?', function () {
	var base = this.params.base;

	// Basics...
	if (base === undefined)
		this.render('home');
	else if (base === 'tools')
		this.render('tools');

	// Scholars...
	else if (base === 'scholars') {
		this.render('scholars', {waitOn: sub('scholars')});
	}
	else if (Meteor.scholars.findOne({slug: base}) !== undefined) {
		var scholar = Meteor.scholars.findOne({slug: base});
		if (this.params.a === 'edit')
			this.render('scholarEdit', {waitOn: sub('scholars'), data: scholar});
		else
			this.render('scholarView', {waitOn: sub('scholars'), data: scholar});
	}

	else
		this.render('notFound');
});

sub = function (sub) {
	if (sub.constructor === Array) {
		var arr = [];
		sub.forEach(function (s) {
			arr.push(Meteor.subscribe(s));
		});
		return arr;
	}
	return Meteor.subscribe(sub);
};
