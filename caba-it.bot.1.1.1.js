// ==UserScript==
// @name			Caba-It BOT TW
// @version			1.1.1
// @downloadURL		https://pokexgames.pl/zygzagz/GM/cabaitbottw666790.user.js
// @updateURL		https://pokexgames.pl/zygzagz/GM/cabaitbottw666790.meta.js
// @include			http*://pl*.plemiona.pl/game.php?*screen=place*
// @include			http*://pl*.plemiona.pl/game.php?*screen=overview_villages*
// @include			http*://pl*.plemiona.pl/game.php?*screen=info_player*
// @include			http*://www.plemiona.pl/sid_wrong.php#close#
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @copyright		2014+, zygzagZ
// @icon			http://plemiona.pl/favicon.ico
// @grant 			GM_getValue
// @grant 			GM_setValue
// @grant 			GM_setClipboard
// @grant			unsafeWindow
// @run-at			window-load
// ==/UserScript==
console.log('Loading caba-it TW bot... tpl:', GM_getValue('fake_template'));
(function() {
	if (document.location.hash == '#close#')
		return window.close();
	var t = document.location.hash.split('#');
	if (document.location.href.indexOf('screen=place') > 0) {
		var units = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
		if (document.location.href.indexOf('try=confirm') < 0) {
			var tbody = $('#selectAllUnits').closest('tbody'), odd = tbody.children().last().hasClass('row_a');
			$('<tr class="row_' + (odd ? 'b' : 'a') + '"><td><a id="saveFake" href="#">Zapisz fejka</a></td></tr>').appendTo(tbody).click(function() {
				var tpl = [];
				units.every(function(a) { tpl.push($('#unit_input_' + a).val()); return true; });
				console.log('saving template: ', tpl);
				GM_setValue('fake_template', JSON.stringify(tpl));
				unsafeWindow.UI.SuccessMessage('Fejk zapisany!');
				return false;
			});
			$('<tr class="row_' + (odd ? 'a' : 'b') + '"><td><a id="loadFake" href="#">Wczytaj fejka</a></td></tr>').appendTo(tbody).click(function() {
				var tpl = JSON.parse(GM_getValue('fake_template', '[0,0,0,0,0,0,0,0,0,0,0,0]'));
				console.log('loaded template: ', tpl);
				units.every(function(a,b) { $('#unit_input_' + a).val(tpl[b]); return true; });
				return false;
			});

			if ((t.length == 3) && (t[1] == 'close')) {
				if (window.opener) {
					window.opener.postMessage([t[2], 1], "*");
					window.close();
				}
			}
			// #czas#typ#ile fejkow#fixtime#ktoryX
			// #1#0#0#0#0
			if (t.length !=6)
				return;

			var type = t[2];
			var tpl = JSON.parse(GM_getValue('fake_template', '[0,0,0,0,0,0,0,0,0,0,0,0]'));
			if (type == 0) { 	// FAKE
				units.every(function(a,b) { $('#unit_input_' + a).val(tpl[b]); return true; });
			} else { 			// OFF
				unsafeWindow.selectAllUnits(true);
				units.every(function(a,b) {
					var input = $('#unit_input_' + a),nv;
					if (a == 'snob') {
						nv = type-1;
					}
					else nv = Math.max(~~input.val() - tpl[b]*t[3], 0);
					if (nv == 0)
						nv = '';
					input.val(nv);
					return true;
				});
			}
			var form = document.getElementsByName('units')[0];
			form.action = form.action + document.location.hash;
			setTimeout(function() {
				$('#target_attack').click();
			}, 2000);
		} else {

			var server_time, landing_time, launch_time, planned_time,
			a = $('#date_arrival').parent().prev().text().match(/\d+/g),
			duration = (-a[0]*3600-a[1]*60-a[2])*-1000;

			function getlandingtime() {
				landing_time=server_time+duration;
			}
			function getservertime() {
				server_time = unsafeWindow.Timing.getCurrentServerTime();
			}

			var timeout_id, fixtime = 340, lastchange = 0;
			function timing() {
				getservertime();
				getlandingtime();

				if(document.getElementById("type_time").checked) {
					control_time = server_time;
				} else {
					control_time = landing_time;
				}
				control_time += fixtime;
				if(planned_time <= control_time) {
					document.getElementById('troop_confirm_go').click();
				} else {
					//*
					var time = 0;
					if (planned_time - control_time > 120000)
						time = 60000;
					else if (planned_time - control_time > 10000)
						time = 1000;
					//*/
					/*
					var time = 1000;//169, 8, 89, 92, 133
									//-24, -62, 43, -91, -90
					if (planned_time - control_time > 120000)
						time = 60000;
					else if (planned_time - control_time < 1000)
						time = planned_time-control_time;
					//*/
					timeout_id = setTimeout(timing, time);
				}
				if (server_time - lastchange > 500) {
					lastchange = server_time;
					var lnt = new Date(landing_time);
					document.getElementById('time_in').innerHTML = addZero(lnt.getDate(),1) + "/" + addZero(lnt.getMonth(),1) + "/" + lnt.getFullYear() + " - " +
						addZero(lnt.getHours(),1) + ":" + addZero(lnt.getMinutes(),1) + ":" + addZero(lnt.getSeconds(),1) + "." + addZero(lnt.getMilliseconds(),2);
					var back_timer=Math.round(planned_time-control_time);
					if(back_timer<60000) {
						document.getElementById('timer_back').innerHTML="<font color=red><b>"+Math.floor(back_timer/1000)+"</b></font><font color=gray size=&quot;-1&quot;>."+addZero(back_timer % 1000, 2)+"</font>";
					} else {
						document.getElementById('timer_back').innerHTML=Math.floor(back_timer/1000)+"<font color=gray size=&quot;-1&quot;>."+addZero(back_timer % 1000, 2)+"</font>";
					}
				}
			}

			function timer_start_stop() {
				var pt = new Date();
				pt.setDate(parseInt(document.getElementById("DD").value,10));
				pt.setMonth(parseInt(document.getElementById("MM").value,10)-1);
				pt.setFullYear(parseInt(document.getElementById("YYYY").value));
				pt.setHours(parseInt(document.getElementById("HH").value,10));
				pt.setMinutes(parseInt(document.getElementById("mm").value,10));
				pt.setSeconds(parseInt(document.getElementById("ss").value,10));
				pt.setMilliseconds(parseInt(document.getElementById("ms").value,10));
				planned_time = pt.getTime();
				launch_time = planned_time - duration;
				
				var lt = new Date(launch_time);
				
				document.getElementById('time_out').innerHTML = addZero(lt.getDate(),1) + "/" + addZero(lt.getMonth(),1) + "/" + lt.getFullYear() + " - " +
					addZero(lt.getHours(),1) + ":" + addZero(lt.getMinutes(),1) + ":" + addZero(lt.getSeconds(),1)	+ "." + addZero(lt.getMilliseconds(),2);
				
				try {
					if(document.getElementById("btnStart").value==" Start ") {
						if((planned_time-server_time) <= ((document.getElementById("type_time").checked)? 0: (duration + fixtime))) {
							if (window.opener) {
								document.location = 'http://kalkulator.jupe.pl/zlozony/finished.php#' + t[5] + '#0';
							} else {
								alert("Ju¿ po czasie!");
							}
						} else {
							fixtime=~~$('#fixtime').val();
							timing();
							document.getElementById("btnStart").value=" Stop ";
						}
					} else {
						clearTimeout(timeout_id);
						document.getElementById("btnStart").value=" Start ";
					}
				}catch(e){console.error(e);}
			}

			function addZero(i,y) {
				switch(y) {
					case 1:
						return (i < 10)? "0" + i: i;
					case 2:
						return (i < 100)? ((i < 10)? "00" + i: "0" + i): i;
				}
			}



			getservertime();
			getlandingtime();
			if (t.length == 6) {
				var form = document.getElementById('content_value').children[0];
				form.action = form.action + '#close#' + t[5];
				if (t[1] == '1') {
					document.getElementById('troop_confirm_go').click();
					return;
				}
				planned_time = parseInt(t[1], 10);
				fixtime = parseInt(t[4], 10);
			} else {
				planned_time = landing_time + 60*1000;
			}

			var lct = new Date(launch_time),
				pt = new Date(planned_time),
				lnt = new Date(landing_time);
			timerDivElem = '' +
				'<div id="timerZZ" style="position:relative; background:#ecd7ac; border:1px solid #603000; border-radius:3px; ' +
				'box-shadow:4px 4px 10px rgba(0,0,0,0.7); bottom:360px; left:60%; width:320px; height:auto; padding:5px">'	+
				'	<table width=100% height=100%> ' +
				"		<tr> " +
				"			<th colspan=4><center>Atak</center></th> " +
				"		</tr> " +
				"		<tr> " +
				"			<td colspan=2 width='43%'> " +
				"				Korekta (ms):" +
				"			</td>" +
				"			<td colspan=2> " +
				"				<input type=text id='fixtime' onchange=void(0) value='" + fixtime + "' size=3>&nbsp;&nbsp;" +
				"				  Czas wys³ania: <input type=checkbox id='type_time'>" +
				"			</td>" +
				"		</tr>" +
				"		<tr>" +
				"			<td colspan=2>" +
				"				Czas:" +
				"			</td>" +
				"			<td colspan=2>" +
				"				<input type=text id='DD' value=" + addZero(pt.getDate(),1) + " size=2>/" +
				"				<input type=text id='MM' value=" + addZero((pt.getMonth()+1),1) + " size=2>/" +
				"				<input type=text id='YYYY' value=" + pt.getFullYear()+" size=4>" +
				"				<br>" +
				"				<input type=text id='HH' value=" + addZero(pt.getHours(),1) + " size=2>:" +
				"				<input type=text id='mm' value=" + addZero(pt.getMinutes(),1) + " size=2>:" +
				"				<input type=text id='ss' value=" + addZero(pt.getSeconds(),1) + " size=2>." +
				"				<input type=text id='ms' value=" + addZero(pt.getMilliseconds(),2) + " size=3>" +
				"			</td>" +
				"		</tr>" +
				"		<tr>" +
				"			<td colspan=4> " +
				"				<Hr align='center'" +
				"			</td>" +
				"		</tr>" +
				"		<tr> " +
				"			<td colspan=2 >" +
				"				Czas wys³ania:" +
				"			</td>" +
				"			<td colspan=2 id='time_out'>" +
								addZero(lct.getDate(),1) + "/" + addZero(lct.getMonth(),1) + "/" + lct.getFullYear() + " - " +
								addZero(lct.getHours(),1) + ":" + addZero(lct.getMinutes(),1) + ":" + addZero(lct.getSeconds(),1) + "." +
								addZero(lct.getMilliseconds(),2) +
				"			</td>" +
				"		</tr>" +
				"		<tr>" +
				"			<td colspan=2 > " +
				"				Czas dotarcia:" +
				"			</td>" +
				"			<td colspan=2 id='time_in'>" +
								addZero(lnt.getDate(),1) + "/" + addZero(lnt.getMonth(),1) + "/" + lnt.getFullYear() + " - " +
								addZero(lnt.getHours(),1) + ":" + addZero(lnt.getMinutes(),1) + ":" + addZero(lnt.getSeconds(),1) + "." +
								addZero(lnt.getMilliseconds(),2) +
				"			</td>" +
				"		</tr>" +
				"		<tr> " +
				"			<td colspan=4> " +
				"				<Hr align='center'" +
				"			</td>" +
				"		</tr>" +
				"		<tr>" +
				"			<td colspan=2>" +
				"				Pozosta³o: " +
				"			</td>" +
				"			<td id='timer_back'>00<font color=\"gray\" size=\"-1\">.000</font></td>" +
				"			<td width='20%'>" +
				"				<input type='button' id='btnStart' onclick=void(0) value=' Start '/>" +
				"			</td>" +
				"		</tr>" +
				'	</table> ' +
				'</div>';

			document.body.insertAdjacentHTML('beforeEnd', timerDivElem);
			document.getElementById('btnStart').onclick = timer_start_stop;

			if (t.length == 6) {
				setTimeout(timer_start_stop, 1000);
				document.documentElement.scrollTop = 330;
				document.documentElement.scrollLeft = 179;
			}

			unsafeWindow.$('#timerZZ').draggable();
		}
	} else {
		var vill;
		function makeCheckboxes() {
			$('.twexport').remove();
			var lastChecked = null;
			var checkboxes = $('<input type="checkbox" class="twexport">').insertBefore(vill[0]).click(function(e) {
				if(!lastChecked) {lastChecked = this; return;}
				if(e.shiftKey) {
					var start = checkboxes.index(this);
					var end = checkboxes.index(lastChecked);
					checkboxes.slice(Math.min(start,end), Math.max(start,end)+ 1).attr('checked', lastChecked.checked);
				}
				lastChecked = this;
			});
		}
		if ((document.location.href.indexOf('screen=overview_villages') > 0) && ($('.selected').eq(0).text().trim() == 'Kombinowany'))
			vill = ['.quickedit-vn', $('.btn:first').parent()];
		else if ((document.location.href.indexOf('screen=info_player') > 0) && (document.location.href.indexOf('mode=') < 0)) {
			vill = ['.village_anchor.contexted', $('#villages_list')];
			unsafeWindow.cbigf = function (anchor, link) {
				$.get(link, {}, function(data) {
					$('#villages_list tbody').append(data.villages);
					$(anchor).parent().parent().remove();
					unsafeWindow.eval("if(game_data.player.id){VillageContext.init();UI.ToolTip('.tooltip');}");
					makeCheckboxes();
				}, 'json');
			};
			unsafeWindow.eval('$(document).ready(function(){Player.getAllVillages = window.cbigf;});');
		} else {
			return;// UI.ErrorMessage('Caba-IT TWBot: no profile page, no overview villages, wtf?', 5000);
		}
		makeCheckboxes();
		var btn = $('<td><button class="btn">Eksport</button></td>').click(function(){
			var str = [];
			$('.twexport').each(function(i, e) {
				if (e.checked)
					str.push($(e).next().data('id'));
			});
			setTimeout(function() {GM_setClipboard(JSON.stringify(str)); unsafeWindow.UI.InfoMessage('Zapisano do schowka!', 500);}, 0);
			return false;
		});
		if (!vill[1].length)
			$('<table class="vis"><tbody><tr><td></td></tr></tbody></table>').appendTo('#paged_view_content').find('td').append(btn);
		else
			vill[1].after(btn);
	}
})();
console.log('Caba-it TW bot loaded!');
