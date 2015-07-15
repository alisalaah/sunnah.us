Template.scholarEdit.onRendered(function () {
	validateForm(this.data);
});

Template.scholarEdit.events({
	'keyup input': function () {
		validateForm(this);
	},
	'click #save': function () {
		var res = validateForm(this);
		if (res) {
			var form = getForm();
			if (this && this.slug) {
				Meteor.scholars.update({_id: this._id}, {$set: {name: form.name, slug: form.slug, born: form.born, bornEst: form.bornEst, bornLoc: form.bornLoc, died: form.died, diedEst: form.diedEst, diedLoc: form.diedLoc}});
				Router.go('/'+form.slug);
			} else {
				Meteor.scholars.insert({name: form.name, slug: form.slug, born: form.born, bornEst: form.bornEst, bornLoc: form.bornLoc, died: form.died, diedEst: form.diedEst, diedLoc: form.diedLoc});
				Router.go('/'+form.slug);
			}
		}
	}
});

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
	else if (Meteor.scholars.find({'name': form.name}).count() !== 0 && form.name !== data.name) {
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

	if (err)
		return false;
	return true;
}
