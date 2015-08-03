Template.scholarView.onRendered(function () {
	$(function () {
		$('[data-toggle="tooltip"]').tooltip({placement: "bottom", html: true});
		$("#toc").tocify({
			highlightDefault: true,
			scrollTo: 50,
			extendPage: true
		});
	});
});

Template.scholarView.helpers({
	bioText: function () {
		var bio = Meteor.scholars.findOne({_id: this._id}).bio;
		return bio;
	}
});
