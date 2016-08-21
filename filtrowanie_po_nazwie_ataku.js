javascript:var q = prompt("Czego szukać w nazwie ataku?", "przepuścić");
var t={};
$('#incomings_table .nowrap').each(function(){
	$(this).hide();
	if ($(this, '.quickedit-label').text().indexOf(q) >= 0) {
		var tgv_id = $(this).children().eq(1).children()[0].href.match(/village=(\d+)/)[1];
		if (!t[tgv_id]) {
			t[tgv_id] = true;
			$(this).show();
		}
	}
});void(0)