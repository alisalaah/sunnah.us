Meteor.methods({
	claimOwner: function () {
		var user = Meteor.user();
		var ownr = Meteor.users.findOne({"roles":"owner"});
		if (ownr)
			throw new Meteor.Error(403, "Site already has an owner");

		Roles.setUserRoles(user._id, 'owner');
		return true;
	}
});

