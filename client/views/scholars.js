Template.scholars.helpers({
	allScholars: function () {
		Meteor.setTimeout(function () {
			$('#scholarsTable').dataTable({
				"order": [[0, "asc"], [3, "asc"]],
				"paging": false
			});
			$('#scholarsTable_wrapper').prepend(Blaze.toHTMLWithData(Template.scholarsToolbar)).show();
			$('#scholarsTable_filter > label').addClass('search');
			$('#scholarsTable_filter > label > input').attr("placeholder", "Search..").focus();
		}, 500);
		return Meteor.scholars.find({}, {sort: {era: 1, died: 1}});
	}
});
