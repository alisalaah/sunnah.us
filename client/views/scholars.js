Template.scholars.helpers({
	tableData: function () {
		return dataTableData;
	},
	tableOptions: {
		id: 'scholarsTable',
		paging: false,
		order: [[0, "asc"], [3, "asc"]],
		columns: [{
				title: 'Era',
				data: 'era',
				className: 'hide'
			}, {
				title: 'Name',
				data: 'name',
				render: renderName,
				className: 'alignLeft'
			}, {
				title: 'Born',
				data: 'born',
				//render: renderBorn,
				className: 'alignCenter'
			}, {
				title: 'Photo',
				data: 'died',
				//render: renderDied,
				className: 'alignCenter'
			}],
		oLanguage: {
			sInfo: "_TOTAL_ scholars",
			sInfoEmpty: "_TOTAL_ scholars",
			sInfoFiltered: "found from _MAX_"
		},
		initComplete: function () {
			$('#datatable').addClass('table-striped table-bordered');
			$('.dataTables_filter > label > input').attr("placeholder", "Search").focus();
			$('#datatable_filter').before(Blaze.toHTMLWithData(Template.scholarsToolbar));
		},
		fnDrawCallback: function () {
			$.each($('.scholarName'), function () {
				var era = $(this).data('era');
				$(this).parent().parent()
						.removeClass('era0 era1 era2 era3 era4 era5 era6')
						.addClass('era' + era);
			});
		}
	}
});

function dataTableData() {
	return Meteor.scholars.find({}, {sort: {era: 1, died: 1}}).fetch(); // or .map()
}
function renderName(cellData, renderType, currentRow) {
	return '<a class="scholarName" data-era="' + currentRow.era + '" href="/' + currentRow.slug + '">' + cellData + '</a>';
}
