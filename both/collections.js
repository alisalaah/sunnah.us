/* Establish Collections
 ***********************/

Meteor.scholars = new Meteor.Collection("scholars");
Meteor.quotes = new Meteor.Collection("quotes");



/* Allow & Deny Permissions
 **************************/

Meteor.scholars.allow({
	insert: function (userId, doc) {
		// the user must be logged in, and the sender must be self
		// add room attendance rules here also...
		// join, part, quit, etc. can not be sent by user rules here...
		// validate message format, etc. also...
		// return (userId && doc.user === userId);
		return true;
	}
});




/* Before & After Hooks
 **********************/

Meteor.scholars.before.insert(function (userId, doc) {
	if (doc.born < 12)
		doc.era = 1; // Sahabah
	else if (doc.born < 81)
		doc.era = 2; // Tabieen
	else if (doc.born < 152)
		doc.era = 3; // Tabi Tabieen
	else if (doc.born < 656)
		doc.era = 4; // Abbasid
	else if (doc.born < 1292)
		doc.era = 5; // Ottoman
	else
		doc.era = 6; // Modern
});



/* Publishes
 ************/

if (Meteor.isServer) {
	Meteor.publish("scholars", function () {
		return Meteor.scholars.find({});
	});
	Meteor.publish("quotes", function () {
		return Meteor.quotes.find({});
	});

	// Profiles to admins only
	Meteor.publish('userProfiles', function () {
		if (Roles.userIsInRole(this.userId, ['owner', 'admin'])) {
			return Meteor.users.find({}, {fields: {username: 1, role: 1, profile: 1}});
		}
	});

	// Statuses to admins only
	Meteor.publish("userStatuses", function () {
		if (Roles.userIsInRole(this.userId, ['owner', 'admin'], 'server')) {
			return Meteor.users.find({"status.online": true}, {fields: {"status.online": 1, "status.idle": 1, "status.lastActivity": 1, "status.lastLogin": 1, "banned.expires": 1, "banned.reason": 1, "muted": 1}});
		}
	});

	// Roles
	Meteor.publish(null, function () {
		return Meteor.roles.find({});
	});

}



/* Subscribes
 ************/

if (Meteor.isClient) {
	Meteor.subscribe('scholars');
	Meteor.subscribe('quotes');
	Meteor.subscribe('userProfiles');
	Meteor.subscribe('userStatuses');
}
