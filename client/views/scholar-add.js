Template.scholars.events({
	'click #add': function () {
		bootbox.dialog({
			title: "Add Scholar",
			message: Blaze.toHTMLWithData(Template.scholarAdd),
			onEscape: true,
			closeButton: true,
			buttons: {
				alert: {
					label: "Save",
					className: "btn-primary",
					callback: function () {
						var res = validateForm();
						if (res) {
							var form = getForm();
							Meteor.scholars.insert({name: form.name, slug: form.slug, born: form.born * 1, died: form.died * 1, gender: form.gender});
							var w = $(".modal-body").width() + 30;
							var h = $(".modal-body").height() + 30;
							var t = (h - 60) / 2;
							var l = (w - 300) / 2;
							$(".modal-body").append('<div id="tempSucc" class="alert alert-success" style="position:absolute; top: ' + t + 'px; left: ' + l + 'px; width: 300px; text-align: center;"><i class="fa fa-check-circle"></i> Successfully added scholar!</div>');
							Meteor.setTimeout(function () {
								bootbox.hideAll();
								$('#scholarsTable').DataTable();
							}, 1000);
						}
						return false;
					}
				}
			}
		});
		analytics.track("Clicked Add Scholar");
	}
});

function getForm() {
	var form = {};
	$.each($('form').serializeArray(), function () {
		form[this.name] = this.value;
	});
	return form;
}

function validateForm() {
	var form = getForm();

	$('.help-block').remove();
	$('.form-group').removeClass('has-error');
	$('.form-group').removeClass('has-warning');
	$('.form-group').removeClass('has-success');
	var ann = /^[a-z0-9\-]+$/i;
	var ans = /^[a-z0-9 \-\']+$/i;
	var err = false;

	// Name Validation
	if (form.name === "") {
		$('#name').parent().parent().addClass('has-error');
		$('#name').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.name.length < 3) {
		$('#name').parent().parent().addClass('has-error');
		$('#name').after('<span class="help-block">Too short</span>');
		err = true;
	}
	else if (form.name.length > 50) {
		$('#name').parent().parent().addClass('has-error');
		$('#name').after('<span class="help-block">Too long</span>');
		err = true;
	}
	else if (!ans.test(form.name)) {
		$('#name').parent().parent().addClass('has-error');
		$('#name').after('<span class="help-block">Alphanumeric and spaces only</span>');
		err = true;
	}
	else if (Meteor.scholars.find({"name": form.name}).count() !== 0) {
		$('#name').parent().parent().addClass('has-error');
		$('#name').after('<span class="help-block">Already exists</span>');
		err = true;
	}
	else if (form.name && form.name !== "") {
		$('#name').parent().parent().addClass('has-success');
	}

	// Slug Validation
	if (form.slug === "") {
		$('#slug').parent().parent().addClass('has-error');
		$('#slug').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.slug.length < 3) {
		$('#slug').parent().parent().addClass('has-error');
		$('#slug').after('<span class="help-block">Too short</span>');
		err = true;
	}
	else if (form.slug.length > 50) {
		$('#slug').parent().parent().addClass('has-error');
		$('#slug').after('<span class="help-block">Too long</span>');
		err = true;
	}
	else if (!ann.test(form.slug)) {
		$('#slug').parent().parent().addClass('has-error');
		$('#slug').after('<span class="help-block">Alphanumeric only</span>');
		err = true;
	}
	else if (Meteor.scholars.find({"slug": form.slug}).count() !== 0) {
		$('#slug').parent().parent().addClass('has-error');
		$('#slug').after('<span class="help-block">Already exists</span>');
		err = true;
	}
	else if (form.slug && form.slug !== "") {
		$('#slug').parent().parent().addClass('has-success');
	}

	// Born Validation
	if (form.born === "") {
		$('#born').parent().parent().addClass('has-error');
		$('#born').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.born >= 0 || form.born < 0) {
		$('#born').parent().parent().addClass('has-success');
	}
	else if (form.born && form.born !== "") {
		$('#born').parent().parent().addClass('has-error');
		$('#born').after('<span class="help-block">Numeric year only</span>');
		err = true;
	}

	// Died Validation
	if (form.died === "") {
		$('#died').parent().parent().addClass('has-error');
		$('#died').after('<span class="help-block">Required</span>');
		err = true;
	}
	else if (form.died >= 0 || form.died < 0) {
		$('#died').parent().parent().addClass('has-success');
	}
	else if (form.died && form.died !== "") {
		$('#died').parent().parent().addClass('has-error');
		$('#died').after('<span class="help-block">Numeric year only</span>');
		err = true;
	}

	if (err)
		return false;

	return true;
}
