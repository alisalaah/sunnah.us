Template.scholarEdit.onRendered(function () {
	validateForm(this.data);
});

Template.scholarEdit.events({
	'keyup input': function () {
		validateForm(this);
	},
	'autocompleteselect #teacher': function (event, template, doc) {
		addTeacher(doc);
	},
	'keypress #teacher': function (e) {
		if (e.charCode == 13) {
			var res = validateForm(this);
			if (res === false) {
				$('#teacher').addClass('error').data('title', 'Can not add with form errors');
				$('#teacher').tooltip({placement: 'bottom'}).tooltip('show');
				return false;
			}
			if (e.target.value === '')
				return false;

			var doc = Meteor.scholars.findOne({name: e.target.value});
			addTeacher(doc);
			e.stopPropagation();
			return false;
		}
	},
	'click .teacherPill > i': function (e) {
		$(e.target).removeClass('fa-times-circle').addClass('fa-plus-circle');
		$(e.target).parent().removeClass('teacherPill').addClass('teacherRed');
	},
	'click .teacherRed > i': function (e) {
		$(e.target).removeClass('fa-plus-circle').addClass('fa-times-circle');
		$(e.target).parent().removeClass('teacherRed').addClass('teacherPill');
	},
	'click #save': function () {
		var res = validateForm(this);
		if (res) {
			var form = getForm();

			var slugs = [];
			$("[id^=teacher-]").each(function (i) {
				var cls = $(this).prop('class');
				if (cls === 'teacherPill') {
					var id = $(this).attr('id');
					var slug = id.substr(8);
					slugs.push(slug);
				}
			});
			var teachers = [];
			slugs.forEach(function (slug) {
				teachers.push(Meteor.scholars.findOne({slug: slug})._id);
			});

			Meteor.scholarEdits.insert({
				user: Meteor.userId(),
				id: this._id,
				name: form.name,
				slug: form.slug,
				born: form.born * 1,
				bornEst: form.bornEst,
				bornLoc: form.bornLoc,
				died: form.died * 1,
				diedEst: form.diedEst,
				diedLoc: form.diedLoc,
				father: form.father,
				mother: form.mother,
				gender: form.gender,
				unlisted: form.unlisted,
				teachers: $.unique(teachers),
				bio: form.bioText
			});

			Meteor.scholars.update({_id: this._id}, {$set: {
					name: form.name,
					slug: form.slug,
					born: form.born * 1,
					bornEst: form.bornEst,
					bornLoc: form.bornLoc,
					died: form.died * 1,
					diedEst: form.diedEst,
					diedLoc: form.diedLoc,
					father: form.father,
					mother: form.mother,
					gender: form.gender,
					unlisted: form.unlisted,
					teachers: $.unique(teachers),
					bio: form.bioText
				}});
			Router.go('/' + form.slug);
		}
	}
});

//return Meteor.scholars.find().fetch().map(function (it) { return it.name; });
Template.scholarEdit.helpers({
	isMale: function () {
		return (this.gender === "male") ? true : false;
	},
	isUnlisted: function () {
		return (this.unlisted) ? true : false;
	},
	addFather: function () {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.scholars,
					field: "name",
					filter: {born: {$lt: this.born}, died: {$gt: this.born - 1}, gender: "male"},
					template: Template.autocompleteResult,
					matchAll: true
				}
			]
		};
	},
	addMother: function () {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.scholars,
					field: "name",
					filter: {born: {$lt: this.born}, died: {$gt: this.born - 1}, gender: "female"},
					template: Template.autocompleteResult,
					matchAll: true
				}
			]
		};
	},
	addTeacher: function () {
		var slugs = [];
		$("[id^=teacher-]").each(function (i) {
			var id = $(this).attr('id');
			var slug = id.substr(8);
			slugs.push(slug);
		});
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.scholars,
					field: "name",
					filter: {born: {$lt: this.died}, died: {$gt: this.born}, slug: {$nin: slugs}},
					template: Template.autocompleteResult,
					matchAll: true
				}
			]
		};
	},
	// MUST MAKE PLACES COLL
	addPlace: function () {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.scholars,
					field: "name",
					filter: {born: {$lt: this.born}, gender: "male"},
					template: Template.autocompleteResult,
					matchAll: true
				}
			]
		};
	},
	// MUST MAKE TAGS COLL
	addTag: function () {
		return {
			position: "bottom",
			limit: 5,
			rules: [
				{
					collection: Meteor.scholars,
					field: "name",
					filter: {born: {$lt: this.born}, gender: "male"},
					template: Template.autocompleteResult,
					matchAll: true
				}
			]
		};
	},
	listTeachers: function () {
		var res = [];
		var ids = Meteor.scholars.findOne({_id: this._id}).teachers;
		ids.forEach(function (id) {
			var doc = Meteor.scholars.findOne({_id: id});
			res.push({name: doc.name, slug: doc.slug});
		});
		return res;
	}
});






function getTeachers() {
	var add = [];
	var rem = [];
	$.each($('#teachers > p'), function (i) {
		var cls = $(this).prop('className');
		var res = $(this).text().trim();
		if (cls === 'teacherPill')
			add.push(res);
		else
			rem.push(res);
	});
	return {add: add, rem: rem};
}

function getForm() {
	var form = {};
	$.each($('form').serializeArray(), function () {
		form[this.name] = this.value;
	});
	$.each($('input[type="checkbox"]'), function () {
		form[this.name] = $(this).is(":checked");
	});
	return form;
}

function validateForm(data) {
	var form = getForm();
	var name = (data.nam) ? data.nam : data.name;

	$('input').attr('title', '').tooltip('destroy');
	$('input').removeClass('error');
	$('input').removeClass('warning');
	$('input').removeClass('success');
	var nam = /^[a-z0-9 \-\'\ﷺ]+$/i;
	var slg = /^[a-z0-9\-]+$/i;
	var err = false;

	// Name Validation
	if (form.name === '') {
		$('#name').addClass('error').data('title', 'Required');
		$('#name').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.name.length < 3) {
		$('#name').addClass('error').data('title', 'Too short');
		$('#name').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.name.length > 50) {
		$('#name').addClass('error').data('title', 'Too long');
		$('#name').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (!nam.test(form.name)) {
		$('#name').addClass('error').data('title', 'No special characters');
		$('#name').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.find({'name': name}).count() !== 0 && form.name !== name) {
		$('#name').addClass('error').data('title', 'Name already exists');
		$('#name').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.name && form.name !== '') {
		$('#name').addClass('success').data('title', '');
		$('#name').tooltip({placement: 'bottom'}).tooltip('hide');
	}

	// Slug Validation
	if (form.slug === '') {
		$('#slug').addClass('error').data('title', 'Required');
		$('#slug').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.slug.length < 3) {
		$('#slug').addClass('error').data('title', 'Too short');
		$('#slug').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.slug.length > 20) {
		$('#slug').addClass('error').data('title', 'Too long');
		$('#slug').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (!nam.test(form.slug)) {
		$('#slug').addClass('error').data('title', 'Alphanumeric and hyphens only');
		$('#slug').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.find({'slug': form.slug}).count() !== 0 && form.slug !== data.slug) {
		$('#slug').addClass('error').data('title', 'Slug already exists');
		$('#slug').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.slug && form.slug !== '') {
		$('#slug').addClass('success').data('title', '');
		$('#slug').tooltip({placement: 'bottom'}).tooltip('hide');
	}

	// Born Validation
	if (form.born === "") {
		$('#born').addClass('error').data('title', 'Required');
		$('#born').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.born >= 0 || form.born < 0) {
		$('#born').addClass('success').data('title', '');
		$('#born').tooltip({placement: 'bottom'}).tooltip('hide');
	}
	else if (form.born && form.born !== "") {
		$('#born').addClass('error').data('title', 'Numbers only');
		$('#born').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}

	// Died Validation
	if (form.died === "") {
		$('#died').addClass('error').data('title', 'Required');
		$('#died').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (form.died >= 0 || form.died < 0) {
		$('#died').addClass('success').data('title', '');
		$('#died').tooltip({placement: 'bottom'}).tooltip('hide');
	}
	else if (form.died && form.died !== "") {
		$('#died').addClass('error').data('title', 'Numbers only');
		$('#died').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}

	// Father Validation
	if (form.father === "") {
	} // Not required
	else if (form.father === form.name || form.father === name) {
		$('#father').addClass('error').data('title', 'Can not be father of self');
		$('#father').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.find({'name': form.father}).count() === 0) {
		$('#father').addClass('error').data('title', '');
		// Autocomplete will be showing so no tooltop..
		err = true;
	}
	else if (Meteor.scholars.findOne({'name': name}).born - Meteor.scholars.findOne({'name': form.father}).born < 5) {
		$('#father').addClass('error').data('title', 'Too young to be father.');
		$('#father').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.findOne({'name': name}).born - Meteor.scholars.findOne({'name': form.father}).born > 100) {
		$('#father').addClass('error').data('title', 'Too old to be father.');
		$('#father').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else {
		$('#father').addClass('success').data('title', '');
		$('#father').tooltip({placement: 'bottom'}).tooltip('hide');
	}

	// Mother Validation
	if (form.mother === "") {
	} // Not required
	else if (form.mother === form.name || form.mother === name) {
		$('#mother').addClass('error').data('title', 'Can not be mother of self');
		$('#mother').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.find({'name': form.mother}).count() === 0) {
		$('#mother').addClass('error').data('title', '');
		// Autocomplete will be showing so no tooltop..
		err = true;
	}
	else if (Meteor.scholars.findOne({'name': name}).born - Meteor.scholars.findOne({'name': form.mother}).born < 5) {
		$('#mother').addClass('error').data('title', 'Too young to be mother.');
		$('#mother').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.findOne({'name': name}).born - Meteor.scholars.findOne({'name': form.mother}).born > 100) {
		$('#mother').addClass('error').data('title', 'Too old to be mother.');
		$('#mother').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else {
		$('#mother').addClass('success').data('title', '');
		$('#mother').tooltip({placement: 'bottom'}).tooltip('hide');
	}

	// Teacher Validation
	if (form.teacher === "") {
	} // Not required
	else if (form.teacher === form.name || form.teacher === name) {
		$('#teacher').addClass('error').data('title', 'Can not be teacher of self');
		$('#teacher').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.find({'name': form.teacher}).count() === 0) {
		$('#teacher').addClass('error').data('title', '');
		// Autocomplete will be showing so no tooltop..
		err = true;
	}
	else if (Meteor.scholars.findOne({'name': name}).died - Meteor.scholars.findOne({'name': form.teacher}).born < 1) {
		$('#teacher').addClass('error').data('title', 'Too young to be teacher.');
		$('#teacher').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else if (Meteor.scholars.findOne({'name': name}).born - Meteor.scholars.findOne({'name': form.teacher}).died > -1) {
		$('#teacher').addClass('error').data('title', 'Too old to be teacher.');
		$('#teacher').tooltip({placement: 'bottom'}).tooltip('show');
		err = true;
	}
	else {
		$('#teacher').addClass('success').data('title', '');
		$('#teacher').tooltip({placement: 'bottom'}).tooltip('hide');
	}

	if (err)
		return false;
	return true;
}

/*
 * INT All Birth/Death Dates
 
 var convert = function (doc) {
 var intBorn = parseInt(doc.born, 10);
 var intDied = parseInt(doc.died, 10);
 Meteor.scholars.update({_id: doc._id}, {$set: {born: intBorn, died: intDied}});
 };
 Meteor.scholars.find({born: {$type: 2}}, {born: 1}).forEach(convert);
 Meteor.scholars.find({died: {$type: 2}}, {died: 1}).forEach(convert);
 
 * Set All People to Male
 
 var setGender = function (doc) {
 Meteor.scholars.update({_id: doc._id}, {$set: {gender: "male"}});
 };
 Meteor.scholars.find({}).forEach(setGender)
 
 */

function remPart(part, string) {
	var string = '<div>' + string + '</div>';
	var result = $(part, string).remove().end().prop('outerHTML');
	var final = result.substr(5, result.length - 6);
}

function addTeacher(doc) {
	$('#teacher').val('');
	$('#teacher').removeClass('error success');

	var ex = $('#teacher-' + doc.slug).text();
	if (ex === '') {
		var html = '<p id="teacher-' + doc.slug + '" class="teacherPill">' + doc.name + ' <i class="fa fa-times-circle"></i></p>';
		$('#teachers').append(html);
	}
}