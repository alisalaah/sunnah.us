Meteor.startup(function () {
	// Setup services from settings
	var services = Meteor.settings.services;
	if (services) {
		for (var k in services) {
			var svc = {};
			if (services.hasOwnProperty(k)) {
				svc['service'] = k;
				for (var i in services[k]) {
					if (services[k].hasOwnProperty(i)) {
						svc[i] = services[k][i];
					}
				}
			}
			Accounts.loginServiceConfiguration.remove({service: svc['service']});
			Accounts.loginServiceConfiguration.insert(svc);
		}
	}
	
	// Setup Kadira if specified
	var kadira = Meteor.settings.kadira;
	if (kadira) {
		Kadira.connect(kadira.appId, kadira.secret);
	}

	if (Meteor.scholars.find({}).count() === 0) {
		Meteor.scholars.insert({name:"Prophet Muhammad ﷺ",slug:"muhammad",born:"-52",died:"11",era:"0"});
		Meteor.scholars.insert({name:"Abu Bakr as-Saddiq",slug:"abubakr",born:"-50",died:"13",era:"1"});
		Meteor.scholars.insert({name:"Umar ibn al-Khattab",slug:"umar",born:"-39",died:"24",era:"1"});
		Meteor.scholars.insert({name:"Uthman ibn Affan",slug:"uthman",born:"-46",died:"35",era:"1"});
		Meteor.scholars.insert({name:"Ali ibn Abi Talib",slug:"ali",born:"-24",died:"40",era:"1"});
		Meteor.scholars.insert({name:"Hasan al-Basri",slug:"hasan-albasri",born:"20",died:"110",era:"2"});
		Meteor.scholars.insert({name:"Abu Hanifa",slug:"abu-hanifa",born:"79",died:"149",era:"2"});
		Meteor.scholars.insert({name:"Malik ibn Anas",slug:"imam-malik",born:"92",died:"178",era:"3"});
		Meteor.scholars.insert({name:"Muhamad ibn Idris ash-Shafi'i",slug:"imam-shafii",born:"149",died:"203",era:"3"});
		Meteor.scholars.insert({name:"Ahmed ibn Hanbal",slug:"imam-ahmed",born:"163",died:"240",era:"4"});
		Meteor.scholars.insert({name:"Muhammad ibn Ismail Bukhari",slug:"imam-bukhari",born:"194",died:"256",era:"4"});
		Meteor.scholars.insert({name:"Abu Zakaria Yahya Ibn Sharaf al-Nawawi",slug:"imam-nawawi",born:"630",died:"676",era:"4"});
		Meteor.scholars.insert({name:"Ibn Taymiyyah",slug:"ibn-taymiyyah",born:"661",died:"728",era:"5"});
		Meteor.scholars.insert({name:"Ibn al-Qayyim",slug:"ibn-alqayyim",born:"691",died:"751",era:"5"});
		Meteor.scholars.insert({name:"Muhammad ibn Abdulwahhab",slug:"abdulwahhab",born:"1114",died:"1206",era:"5"});
		Meteor.scholars.insert({name:"Abdurrahman ibn Nasir as-Sa'di",slug:"abdurrahman-assadi",born:"1307",died:"1376",era:"6"});
		Meteor.scholars.insert({name:"Muhammad ibn al-Uthaymeen",slug:"uthaymeen",born:"1347",died:"1421",era:"6"});
	}
});

Accounts.onCreateUser(function (options, user) {
	if (Meteor.users.find({"roles":"owner"}).count() === 0)
		Meteor.setTimeout(function(){checkOwner(user._id)},1000);
	
	if (options.profile)
		user.profile = options.profile;
	
	return user;
});

function checkOwner(id) {
	var user = Meteor.users.findOne(id);
	if (Meteor.settings.owner === user.registered_emails[0].address)
		Roles.addUsersToRoles(id, 'owner');
}



// analytics.page('page name')
// analytics.track("Bought Ticket", {
//  eventName: "Wine Tasting",
//  couponValue: 50,
//});
