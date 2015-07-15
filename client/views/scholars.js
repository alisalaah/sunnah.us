Template.scholars.onRendered(function () {
	this.autorun(function () {
		var data = Meteor.scholars.findOne();
		if (!data) return; // Not Ready yet..
		
		$('#scholarsTable').dataTable({
			"order": [[0, "asc"], [3, "asc"]],
			"paging": false
		});
		$('#scholarsTable_wrapper').prepend(Blaze.toHTMLWithData(Template.scholarsToolbar)).show();
		$('#scholarsTable_filter > label').addClass('search');
		$('#scholarsTable_filter > label > input').attr("placeholder", "Search..").focus();

	});
});

Template.scholars.helpers({
	allScholars: function () {
		return Meteor.scholars.find({}, {sort: {era: 1, died: 1}});
	}
});
