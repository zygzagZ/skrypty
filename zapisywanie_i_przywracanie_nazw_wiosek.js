function zapisz() {
	var t={};
	$('#content_value .quickedit-vn').each(function(){
		t[$(this).data('id')] = $(this).find('.quickedit-label').data('text');
	});
	prompt('Zapisz sobie :)', JSON.stringify(t));
}
function zmien_nazwe(lista) {
	$('.quickedit-vn[data-id='+lista[0][0]+']').find('a.rename-icon').click().end().find('input').eq(0).val(lista.shift()[1]).end().eq(1).click();
	if (lista.length > 0)
		setTimeout(zmien_nazwe, 300, lista);
	else
		alert('Skonczone :)');
}
function wczytaj() {
	var t;
	try {
		t = JSON.parse(prompt('Wklej zapisane nazwy :)'));
	} catch (e) {
		alert('Wklejone dane są niepoprawne');
		return;
	}
	var lista = [];
	$('#content_value .quickedit-vn').each(function(){
		var id = $(this).data('id');
		var name = $(this).find('.quickedit-label').data('text');
		if (t[id] != name) {
			lista.push([id, t[id]]);
		}
	});
	if (lista.length)
		zmien_nazwe(lista);
	else
		alert('Wszystkie nazwy juz pasuja!');
}
if (confirm("Czy chcesz zapisac nazwy wiosek?")) zapisz();
if (confirm("Czy chcesz wczytac nazwy wiosek?")) wczytaj();