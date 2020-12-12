// ==UserScript==
// @name			TWBot
// @icon			https://plemiona.pl/favicon.ico
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require			https://github.com/uzairfarooq/arrive/raw/master/src/arrive.js
// @downloadURL		https://pokexgames.pl/zygzagz/GM/twbot11.user.js
// @updateURL		https://pokexgames.pl/zygzagz/GM/twbot11.meta.js
// @include			http*://*.plemiona.pl/game.php?*
// @include			http*://www.plemiona.pl/sid_wrong.php*
// @include			http*://www.plemiona.pl/#*
// @include			http*://*.tribalwars.co.uk/game.php?*
// @include			http*://www.tribalwars.co.uk/sid_wrong.php*
// @include			http*://www.tribalwars.co.uk/#*
// @version			1.2.6.5
// @grant			GM_getValue
// @grant			GM_setValue
// @grant			GM_deleteValue
// @grant			GM_listValues
// @grant			GM_xmlhttpRequest
// @grant			GM_addStyle
// @grant			unsafeWindow
// @run-at			document-start
// ==/UserScript==
//'use strict';

console.log('TWBot started loading...');
function error(e) {
	console.error(e);
	if (unsafeWindow.UI) {
		unsafeWindow.UI.ErrorMessage(e, 8000);
	}
}
function integerSort(a,b){return a-b;}
var units = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
var units_speed = [18, 22, 18, 18, 9, 10, 10, 11, 30, 30, 10, 35];

var Fwk = {
	each:function(what, call) {
		document.arrive(what, call);
		$(what).each(call);
	},
	work: function() { return !!window.opener; },
	isLoaded: false,
	load: function(a) { if (!this.isLoaded) { window.addEventListener('DOMContentLoaded', a);} else {a();}},
	body: function(a) { if (document.body) { a.call(document.body);} else { var call = function(){ document.unbindArrive(call); a.call(this); }; document.arrive('#ds_body', call); } },
	beforeLoad: function(a) { var call = function(){ document.unbindArrive(call); a.call(this); }; document.arrive('#side-notification-container', call);},
	isSidWrong: function() { return (location.pathname === '/sid_wrong.php' || location.search.indexOf('session_expired') > 0 || location.href.match(/^http[s]*:\/\/www\.[a-z]+\.[a-z.]+\/#/)); },
	isBotCheckActive: function() { return $('#bot_check_image').length > 0; },
};
Fwk.load(function() {Fwk.isLoaded = true;});
if (!exportFunction && !window.exportFunction) {
	window.exportFunction = function(a){return a;};
}
if (!cloneInto && !window.cloneInto) {
	window.cloneInto = function(a){return a;};
}
function unsafe(a) {
	if (typeof a === 'function') {
		return (exportFunction || window.exportFunction)(a, unsafeWindow);
	} else {
		return (cloneInto || window.cloneInto)(a, unsafeWindow);
	}
}

var TWManager = {
	url : {},
	wioska:0,
	dane:{},
	premium:false,
	captchaWToku: false,
	tytul: document.title,
	aktywny: false,
	kolejkaCaptchy: [],
	funkcje: {
		getHashToken: function() {
			return unsafeWindow.csrf_token;
		},
		showDraggableWindow: function(name, title, content, onclose) {
			var win = $('#window_' + name), closefunc, resizeFunction;
			if (!win.length) {
				win = $('<div id="window_' + name + '" class="popup_style ui-draggable" style="display: block"><div id="window_' + name + '_header"><div class="close popup_menu" style="height:100%">' + title + '<a style="cursor:pointer;"><img id="window_' + name + '_close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFSSURBVChTbVE9SwNBEH27OdAjgiQQrK2EEBvBImAhKKKFCIK2FhaCIIhgkSp/wMLGQAr/gdiIiKBlCCix8UhrJ+hJonDJfWT3zp1lc36QB+9u7s28mblddrZTTKKghyGSWCImSpGS8wyYogh9WL7XxczWMfK5Sdj2mLH9he+H6HS/8FA7AmeM6+JCIYepQn4kKUc1nIMMTHfO2uO4PjlA+7aObNbWpJg0ylENV80tOYjMYGB6toSnu3sEvT6cRgMfn32sbm+YLCBkDC7Fj2F+8xDFchntZjMtJm0IEauVfk8gUOf3jofWK/S0/+BiEJoQeLw8VT/Gdee10gRuHA/1/XWTNROEkOYTeHl2MLe8pNfYq12lpiHIwKqLSFYq5/ro6DRGoecHcN0uLqq74JmMpS+FhDe3M5KUoxoCqywg0bvRpSiBYgK9YvWIExUwLSGSwDceyKWk9VatnwAAAABJRU5ErkJggg=="></a></div></div><div id="window_' + name + '_content" style="overflow-y: scroll">' + content + '</div></div>') .appendTo(document.body);
				var windowContent = win.find('#window_'+name+'_content');
				resizeFunction = function() {windowContent.css('max-height', $(window).height()-100);};
				resizeFunction();
				$(window).on('resize', resizeFunction);
				unsafeWindow.eval('var w=$("div#window_'+name+'");w.draggable({cursor:"move",handle:w.find("div:first"),containment:"document"});');
				win.css('top', Math.max(($(window).height() - win.height()) / 2, 10))
				.css('left', Math.max(($(window).width() - win.width()) / 2, 10));
				//.css('min-width', win.width());
			} else {
				win.find('span').html(title);
				$('#window_' + name + '_content').html(content);
			}
			if (typeof (onclose) === 'function') {
				closefunc = function (ev) {
					ev.preventDefault();
					var ret;
					try {
						ret = onclose();
					} catch (e) {
						unsafeWindow.UI.ErrorMessage('Error on window close: ' + e);
					}
					if (ret === false) {
						return false;
					}
					$('#window_' + name).remove();
					if (resizeFunction) {
						$(window).off('resize', resizeFunction);
					}
					return false;
				};
			} else {
				closefunc = function () {$('#window_' + name).remove();if (resizeFunction) {$(window).off('resize', resizeFunction);} return false;};
			}
			$(win.find('div:first')).unbind('contextmenu').contextmenu(closefunc);
			$('#window_' + name + '_close').unbind('click').click(closefunc);
			return true;
		},
		addQuest: function(id, title, image, filled, onclick) {
			$('<div id="' + id + '" class="quest opened" title="' + title + '" style="background-image: url(' + image + '); position: relative;"><div class="quest_progress fill" style="display: '+ (filled ? 'block' : 'none') + '; width: 100%;"/><a style="opacity:0;left:7px;position:absolute;top:3px;width:12px;height:17px">.</a></div>').appendTo('#TWB_bar').last().click(onclick);
		},
		zaladuj_budynki: function(callback) {
			var UpgradeBuilding = unsafeWindow.UpgradeBuilding;
			if (UpgradeBuilding.possible_building_upgrades !== null) {
				if (typeof callback === 'function') { callback(); }
			} else { 
				$.getJSON(UpgradeBuilding.get_possible_building_upgrades_link, {}, function(a) {UpgradeBuilding.possible_building_upgrades=a;if (typeof callback === 'function') { callback();} } ); 
			}
		},
		buduj: function (building_id, destroy, cb) {
			unsafeWindow.TribalWars.post('/game.php?village=' + TWManager.wioska + '&ajaxaction=' + (destroy ? 'down' : 'up') + 'grade_building&h=' + unsafeWindow.csrf_token + '&type=main&screen=main', unsafe({}), unsafe({
					id: building_id,
					force: 1,
					destroy: !!destroy*1,
					source: TWManager.wioska
				}), unsafe(function (data) {
					cb(data);
					TWManager.event.dodaj({typ: 'buduj', wioska: TWManager.wioska, czas: new Date().getTime()+(data.date_complete*1000)});
					if (unsafeWindow.BuildingMain) { unsafeWindow.BuildingMain.update_all(data); }
			}));
		},
		buduj_old: function (building_id) {
			var UpgradeBuilding = unsafeWindow.UpgradeBuilding, ret = UpgradeBuilding.possible_building_upgrades, game_data = unsafeWindow.game_data;
			if (ret.buildings.lenght === 0) { return; }
			if (!ret.buildings[building_id]) { return; }

			var building_label = $('#l_' + building_id),
				is_not_built = building_label.hasClass('label_no_lvl');
			building_label.show().find('.label').show();
			if (is_not_built) {
				var building_image = $('.cons_' + building_id);
				building_image.fadeTo('fast', 0.55);
			}
			var label = building_label.find('.label, .label_night').addClass('can_upgrade');
			if (!label) { return false; }
			if (ret.confirm_queue) { return; }
			$.ajax({
				url: UpgradeBuilding.upgrade_building_link,
				dataType: 'json',
				data: {
					id: building_id,
					force: 1,
					source: game_data.village.id
				},
				success: function (build_ret) {
					if (build_ret.error) {
						error(build_ret.error);
					} else if (build_ret.success) {
						$('#l_main .building_extra').html(unsafeWindow.s('<span class="timer">%1</span>', build_ret.date_complete_formated));
						$('#l_storage .building_extra').html(unsafeWindow.s('<span class="timer">%1</span>', build_ret.storage_full_time));
						ret.confirm_queue = build_ret.confirm_queue;
						if (is_not_built) {
							building_image.fadeTo('normal', 1).removeClass('building_no_lvl');
							building_label.removeClass('label_no_lvl');
						}
						var upgrade_level_span = label.find('.building_order_level'),
							old_upgrade_level = parseInt(upgrade_level_span.text(), 10) || 0,
							new_upgrade_level = old_upgrade_level + 1;
						upgrade_level_span.text((new_upgrade_level < 0 ? '-' : '+') + new_upgrade_level);
						var $build_widget = $('#show_buildqueue').removeClass('hidden_widget').show(),
							$widget_content = $build_widget.find('.widget_content');
						if (!$widget_content.length) { $widget_content = $('<div class="widget_content" />').appendTo($build_widget); }
						$widget_content.html(build_ret.building_orders);
						unsafeWindow.setRes('wood', build_ret.resources[0]);
						unsafeWindow.setRes('stone', build_ret.resources[1]);
						unsafeWindow.setRes('iron', build_ret.resources[2]);
						$('#pop_current_label').html(build_ret.population);
						unsafeWindow.startTimer();
					}
				}
			});
		},
		pobierz: function(url, callback, params) {
			unsafeWindow.TribalWars._previousData = unsafeWindow.game_data;
			unsafeWindow.TribalWars.showLoadingIndicator();
			$.getJSON(url, 
				function(data) {
					if (!data.hasOwnProperty('error') && !data.hasOwnProperty('response') && !data.hasOwnProperty('content')) {
						unsafeWindow.UI.ErrorMessage('Żądanie nie powiodło się. Możliwe chwilowe problemy z serwerem.');
						return;
					}
					if (data.error) {
						unsafeWindow.UI.ErrorMessage(data.error);
						return;
					}
					if (data.time_diff) { unsafeWindow.UI.InfoMessage(data.time_diff); }
					if (data.content) {
						if (!params) { params = []; }
						else if ((typeof params !== 'object') || (!params.unshift)) {
							params = [params];
						}
						params.unshift(data.content);
						
						callback.apply(null, params);
					}
					if (data.game_data) {
						unsafeWindow.TribalWars.updateGameData(data.game_data);
						setTimeout(function () {
							unsafeWindow.Timing.resetTickHandlers();
						}, 10);
					}
					unsafeWindow.TribalWars.updateHeader();
					unsafeWindow.TribalWars.hideLoadingIndicator();
				}
			);
		},
		zaladujWOknie: function(id, title, url) {
			this.pobierz(url, function(content) {
				TWManager.funkcje.showDraggableWindow(id, title, content);		
				unsafeWindow.UI.ToolTip('.tooltip');
			});
		},
		kopiuj: function(text) {
			$('#fader').show();
			$('<textarea style="position:fixed;left:5%;top:5%;width:90%;height:90%;z-index:999999;"/>').val(text).appendTo('body').keypress(function(e) {
				this.select(); if (e.which === 99 && e.ctrlKey) {setTimeout(this.remove.bind(this), 0); $('#fader').hide(); return true;} return false;
			}).focus();
			unsafeWindow.kopia = text;
		},
		wyslijAtak: function(target, troops, onSuccess, onError) { // {id: 17000, x: 444, y: 666}, [0,0,0,0,0,0,0,0,0,0]
			var me = this;
			if (!TWManager.antiCSRF) { 
				if (!target.id) {
					var wioski = TWManager.cache.get('wioski'),
						n = target.x + '|' + target.y;
					if (wioski[n]) {
						target.id = wioski[n].id;
					} else {
						unsafeWindow.TribalWars.get('api', unsafe({
							ajax: 'target_selection',
							input: n,
							type: 'coord',
							request_id: 1,
							limit: Math.floor(Math.random() * 3 + 6),
							offset: 0
						}), unsafe(function(d) {if (d.villages.length) {target.id = d.villages[0].id; me.wyslijAtak(target, troops, onSuccess, onError);}}));
						return;
					}
				}
				unsafeWindow.TribalWars.get('place', unsafe({
					ajax: 'command',
					target: target.id
				}), unsafe(function(r) {
					var tmp = r.dialog.match(/<input type="hidden" name="([a-z0-9]+)" value="([a-z0-9]+)" \/>/);
					TWManager.antiCSRF = [tmp[1], tmp[2]];
					me.wyslijAtak(target, troops, onSuccess, onError);
				}));
				return;
			}
			
			var data = [{name: TWManager.antiCSRF[0], value:TWManager.antiCSRF[1]}];
			
			for (var i = 0; i < units.length; i++) {
				data.push({name: units[i], value: (troops[i] || '')});
			}
				
			data.push({name:'x', value:target.x});
			data.push({name:'y', value:target.y});
			data.push({name:'input', value:''});
			data.push({name:'attack', value:'l'});
			unsafeWindow.TribalWars.post('place', unsafe({
				ajax: 'confirm'
			}), unsafe(data), unsafe(function (result) {
				var data = [];
				result.dialog.match(/input[^>]*name="([^"]+)"[^>]*value="([^"]+)"/g).forEach(function(a,b){
					var key = a.match(/name="([^"]*)"/)[1];
					var value = a.match(/value="([^"]*)"/)[1];
					data.push({name:key, value:value});
				});
				
				unsafeWindow.TribalWars.post('place', unsafe({
					ajaxaction: 'popup_command'
				}), unsafe(data), unsafe(function (result) {
					unsafeWindow.UI.SuccessMessage(result.message);
					if (onSuccess) { onSuccess(); }
					if ((result.type === 'attack') && unsafeWindow.TWMap) { unsafeWindow.TWMap.actionHandlers.command.ensureIconOnMap(result.target_id, result.type); }
					else if (TWManager.url.screen == "overview" || TWManager.url.screen == "place") {
						unsafeWindow.partialReload();
					}
				}), unsafe(onError));
			}), unsafe(onError));
		},
		ladujUstawieniaSwiata:function() {
			if (TWManager.cache.get('building_info', 0) === 0) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'interface.php?func=get_building_info',
					onload: function(r) {
						var c = $(r.responseText).filter('config').children();
						var data = {};
						c.each(function(i,e) {
							var f = {};
							$(e).children().each(function(i, e) {
								f[e.tagName.toLowerCase()] = parseFloat($(e).text());							
							});
							data[e.tagName.toLowerCase()] = f;						
						});
						console.log(data);
						TWManager.cache.set('building_info', data);
					}
				});
			}
		
		}
	},
	unsafeProxy: function(of) {
		var ret, f = function() {ret = of();};
		window.document.body.addEventListener('timeoutEvent', f, false);
		var ev = document.createEvent('HTMLEvents');
		ev.initEvent('timeoutEvent', true, false);
		window.document.body.dispatchEvent(ev);
		window.document.body.removeEventListener('timeoutEvent', f, false);
		return ret;
	},
	cache: {
		lastget: null,
		get: function(n, d, i) {
			var ret;
			try {
				var def=JSON.stringify(d);
				ret = GM_getValue(i ? n : (TWManager.dane.swiat + '_' + n), def);
				if (ret !== undefined) {
					ret = JSON.parse(ret);
				} else {
					if (undefined !== d) {
						error('Reading "' + n + '" from cache returned undefined, should be ' + typeof def);
					}
					ret = d;
				}
			} catch(e) {
				console.error('Reading "' + n + '" from cache: ' + e);
				this.set(n, d, i);
				return d;
			}
			return ret;
		},
		set: function(n, v, i) {
			return GM_setValue(i ? n : (TWManager.dane.swiat + '_' + n), JSON.stringify(v));
		},
		delete: function(n, i) {
			return GM_deleteValue(i ? n : (TWManager.dane.swiat + '_' + n));
		},
		init: function() {
			// TODO
		}
	},
	gg: {
		okno: null, okno_potwierdzone:false,
		wyslij: function(numer, tekst) {
			if (Fwk.work()) {
				TWManager.chmura.wyslij({gg: [numer, tekst]});
			} else {
				error(tekst);
			}
		},
		callback: function(numer, tekst) {
			function matchCMD(txt, cmd) {return txt.toLowerCase().substring(0, cmd.length) === cmd;}
			unsafeWindow.UI.InfoMessage('wiadomosc od numeru ' + numer + ': ' + tekst);
			try {
				console.log('CMD: ' + tekst);
				if (matchCMD(tekst, 'info')) {
					unsafeWindow.UI.InfoMessage(tekst.substring(5), 60000);
				} else if (matchCMD(tekst, 'success')) {
					unsafeWindow.UI.SuccessMessage(tekst.substring(8), 60000);
				} else if (matchCMD(tekst, 'error')) {
					unsafeWindow.UI.ErrorMessage(tekst.substring(6), 60000);
				} else if (matchCMD(tekst, 'alert')) {
					this.wyslij(numer, 'Pokazywanie alerta...');
					alert(tekst.substring(6));
					this.wyslij(numer, 'Alert klikniety!');
				} else {
					error('WRONG GG COMMAND: ' + tekst);
				}
			} catch (e) {this.wyslij(numer, 'Error: ' + e);}
		}
	},
	chmura: {
		wiadomosc: function(e) {	// unsafe!
			if (e.data && e.data.type && e.data.type === 'dolphin_shortcuts') {
				return true;
			} 
			console.log('Got message from ' + e.origin + ': ', e.data);
			if (e.source === window.opener) { // wiadomosc od managera
				if (e.data.gg) {
					TWManager.gg.callback(e.data.gg[0], e.data.gg[1]);
				} else if (e.data.event) {
					TWManager.event.dodaj(e.data.event);
				} else if (e.data.close) {
					window.close();
				} else if (e.data.wyslijAtak) {
					var btn = $('input.btn.btn-attack')[0];
					if (btn) {
						btn.click();
					}
				}
			} else if (e.origin === document.location.origin) {
				if (e.data.event) {
					TWManager.event.dodaj_(e.data.event);
				}
			}
		},
		init: function() {
			window.addEventListener('message', this.wiadomosc);
		},
		wyslij: function(t, w) {
			var wnd, msg;
			if (w) {
				wnd = t; msg = w;
			} else if (window.opener) {
				wnd = window.opener; msg = t;
			} else { return false; }
			msg.swiat = TWManager.dane.swiat;
			wnd.postMessage(msg, '*');
		},
	},
	tools: {
		distance: function(ax,ay,bx,by) {var dx=ax-bx,dy=ay-by;return Math.sqrt(dx*dx+dy*dy);},
		duration: function(distance,speed) {return Math.round(distance/speed);},
		timeToCoord: function(ax,ay,bx,by,speed) {return this.duration(this.distance(ax,ay,bx,by),speed);},
		inRange: function(x,y,cx,cy,crad) {var dx=x-cx,dy=y-cy;return dx*dx+dy*dy<=crad;},
		random: function(x,y) {if (y===undefined) {y=x; x=0;} return Math.floor((Math.random()*(y-x+1))+x);},
		textToTime: function(tx) {
			var t = new Date();
			var hrs = tx.match(/(\d+)/g);
			if (!hrs) {error('tools.textToTime: Nie znaleziono godziny!'); throw 'Nie znaleziono godziny!';}
			if (tx.indexOf('jutro o ') !== -1) {t.setDate(t.getDate() + 1);}
			else if (tx.indexOf('dnia ') !== -1) { t.setDate(parseInt(hrs.shift())); t.setMonth(parseInt(hrs.shift())-1);}
			else if (tx.indexOf('dzisiaj o ') === -1) {error('tools.textToTime: Nie znaleziono daty!'); throw 'Nie znaleziono daty!';}
				
			if (hrs.length < 2) {
				error('tools.textToTime: Za mało liczb!'); throw 'Za mało liczb!';
			}
			t.setHours(parseInt(hrs.shift()));
			t.setMinutes(parseInt(hrs.shift()));
			t.setSeconds(parseInt(hrs.shift()) || 0);
			t.setMilliseconds(parseInt(hrs.shift()) || 0);
			return t;
		},
		textToMs: function(tx) {return this.textToTime(tx).getTime();},
		reportTextToTime: function(tx) {
			var t = tx.split(' ');
			var d = t[0].split('.'), f = t[1].split(':'), date = new Date();
			date.setMonth(d[1]-1);
			date.setDate(d[0]);
			date.setHours(f[0]);
			date.setMinutes(f[1]);
			date.setSeconds(f[2] || 0);
			date.setMilliseconds(f[3] || 0);
			return date;
		},
		timeToReportText: function(data) {
			var d = new Date(data);
			return d.getDate().zero(2)+'.'+(d.getMonth()+1).zero(2)+'.'+(d.getYear()%100).zero(2)+' '+d.getHours().zero(2)+':'+d.getMinutes().zero(2)+':'+d.getSeconds().zero(2)+':<span class="small grey">'+d.getMilliseconds().zero(3)+'</span>';
		},
		timeToText: function(data) {
			var d = new Date(data);
			return d.getDate().zero(2)+'.'+(d.getMonth()+1).zero(2)+'.'+(d.getYear()%100).zero(2)+' '+d.getHours().zero(2)+':'+d.getMinutes().zero(2)+':'+d.getSeconds().zero(2)+':'+d.getMilliseconds().zero(3);
		},
		getCoords: function(txt) {
			try {
				return txt.match(/\(([0-9]+\|[0-9]+)\)/).pop();
			} catch(e) {
				error(e);
			}
		},
		parseCoords: function(txt) {
			try {
				var t = TWManager.tools.getCoords(txt).split('|');
				t[0] = parseInt(t[0], 10);
				t[1] = parseInt(t[1], 10);
				if (!isNaN(t[0]) && !isNaN(t[1])) {
					return t;
				}
			} catch (e) {
				error(e);
			}
		},
		parseCoordsO: function(txt) {var t = TWManager.tools.parseCoords(txt); if (t) { return {x: t[0], y: t[1]};} },
		img2Base64: function(i) {
			var c = document.createElement('canvas');
			c.width = i.width;
			c.height = i.height;
			c.getContext('2d').drawImage(i, 0, 0);
			var d = c.toDataURL('image/png');
			return d.replace(/^data:image\/(png|jpg);base64,/, '');
		},
		getBuildTime: function(bt, btf,lvl,hqlvl) {
			return Math.round(bt*1.18*Math.pow(btf, lvl < 3 ? -13 : lvl-1-14/(lvl-1))*Math.pow(1.05, -hqlvl));
		},
		nodeRequest: function(data, cb, ecb) {
			var settings = TWManager.cache.get('ustawienia_NodeBot', {});
			if (!settings.on) {
				error('NodeBot jest wyłączony.');
				return;
			}
			GM_xmlhttpRequest({
				method: 'POST',
				url: settings.local ? 'http://127.0.0.1:39856' : settings.address,
				headers: {
					'player':settings.login,
					'playerpass':settings.password,
					'playerdomain':window.location.host,
					'world':window.location.host.match(/pl([^.]+)\.plemiona.pl/)[1]
				},
				data: (typeof(data) === 'object' ? JSON.stringify(data) : data),
				onload: function(r) {
					var res = r.response;
					try {
						res = JSON.parse(res);
					} catch(e) {}
					if (typeof res !== 'object' && r.status !== 200) {
						error('NodeBot: Wrong status: ' + r.status);
						ecb(res);
						return;
					}
					if (res.error) {
						error(res.error);
						ecb(res);
					} else {
						cb(res);
					}
				},
				onerror: function() {
					error('NodeBot: Błąd komunikacji.');
				}
			});
		}
	},
	ustawienia: {
		zamknij: function() {
			var was = $('#TWBot_ustawienia_header').find('.selected').text(), fn = TWManager.ustawienia.funkcje;
			if (typeof fn[was] === 'function') {
				TWManager.cache.set('ustawienia_' + was, $('#TWBot_ustawienia_holder').settings());
			} else if (typeof fn[was] === 'object') {
				fn[was].save();
			}
			
			$('#window_TWBot_ustawienia').remove();
			$('#OpenSettings .fill').hide();
		},
		pokaz: function() {
			if ($('#window_TWBot_ustawienia').length) {
				TWManager.ustawienia.zamknij();
				return;
			}
			$('#OpenSettings .fill').show();
			var text = '<table id="TWBot_ustawienia_header" class="vis modemenu"><tbody><tr>';
			for (var i in TWManager.ustawienia.funkcje) {
				text += '<td style="min-width: 80px"><a href="#">' + i + '</a></td>';
			}
			text += '</tr></tbody></table>';
			TWManager.funkcje.showDraggableWindow('TWBot_ustawienia', 'TWBot ' + GM_info.script.version, text + '<div id="TWBot_ustawienia_holder" style="padding:20px; max-width: 600px"></div>', TWManager.ustawienia.zamknij);
			$('#TWBot_ustawienia_header').children().children().children().click(TWManager.ustawienia.zakladka);
			$('#TWBot_ustawienia_holder').html('');
			$('#TWBot_ustawienia_header td:first a')[0].click();			
		},
		zakladka: function() {
			var header = $('#TWBot_ustawienia_header'), sel = header.find('.selected'), was = sel.text(), now = this.textContent;
			if (was === now) {
				return false;
			}
			var fn = TWManager.ustawienia.funkcje, s;
			if (typeof fn[was] === 'function') {
				s = $('#TWBot_ustawienia_holder').settings();
				TWManager.cache.set('ustawienia_' + was, s);
			} else if (typeof fn[was] === 'object') {
				fn[was].save();
			}

			sel.removeClass('selected');
			header.find('td:contains(' + now + ')').addClass('selected');
			$('#TWBot_ustawienia_holder').children().remove();
			s = TWManager.cache.get('ustawienia_' + now, {});
			var q;
			if (typeof fn[now] === 'function') {
				q = fn[now](s);
			} else if (typeof fn[now] === 'object') {
				q = fn[now].init(s);
			}
			var noautofill = q.filter('noautofill'); // <noautofill/>
			
			if (noautofill.length) {
				noautofill.remove();
			} else {
				var k = q.find('input').addBack('input');
				for (var i=0;i<k.length;i++)
				{
					var n = k[i].name;
					if (!n) { continue; }
					if (undefined === s[n]) { continue; }
					
					if (k[i].type === 'checkbox') {
						k[i].checked = !!s[n];
					} else if (k[i].type === 'radio') {
						k[i].checked = (k[i].value === s[n]);
					} else if (k[i].type === 'text' || k[i].type === 'hidden' || k[i].type === 'password') {
						k[i].value = s[n];
					} else if (k[i].type !== 'submit') {
						error('unknown input type II: ' + k[i].type);
					}
				}
			}
			
			q.appendTo('#TWBot_ustawienia_holder');
			return false;
		},
		init: function() {
			TWManager.funkcje.addQuest('OpenSettings', 'Ustawienia', 'https://dspl.innogamescdn.com/graphic/buildings/garage.png', false, TWManager.ustawienia.pokaz);
		},
		funkcje: {
			Forum: function() {
				return $('<label><input type="checkbox" name="kolory">Popraw kolory forum</label><br><label><input type="checkbox" name="naglowki">Wyśrodkowane nagłówki</label><br><label><input type="checkbox" name="tabele">Zaokrąglone tabele</label><br><label><input type="checkbox" name="spoilery">Po kliknieciu prawym na spoiler otwórz wszystkie na stronie</label>');
			}, 
			Dane: function() {
				setTimeout(function() {unsafeWindow.UI.ToolTip('.tooltip');}, 0);
				return $('<noautofill/><input class="btn btn-cancel tooltip" type="submit" value="Skasuj wszystkie dane Greasemonkey" title="Ze wszystkich światów!">').click(function() {
					var arr = GM_listValues();
					console.log('Deleting data...', arr);
					for (var i in arr) {
						console.log('deleting value ' + arr[i]);
						GM_deleteValue(arr[i]);
					}
					
					console.log('Deleting data finished.');
					unsafeWindow.UI.SuccessMessage('Wszystkie dane zostały usunięte', 5000);
					return true;
				});
			},
			Raporty: function(s) {
				if (!s.usuwaj) {
					s.usuwaj = 172800000;
				}
				return $('<label><input type="checkbox" name="sprawdzajRaporty">Ulepsz czytanie raportów</label><br><label><input type="checkbox" name="ladujRaporty">Automatycznie zacznij ładowac raporty</label><br><label><input type="checkbox" name="ladujWTle">Ładuj raporty nawet w tle</label><br><br><label>Wielkość okna z raportem <input type="text" name="wielkosc" value="600px"></label><br><label>Automatycznie usuwanie raportów starszych niż <span>'+(s.usuwaj/86400000)+'</span> dni <input type="text" id="TWBot_raporty_temp" length="2" style="width:20px" value="' + (s.usuwaj/86400000) + '"><input type="hidden" name="usuwaj" value=""></label><br><br><label>Kliknięcie na raport z:</label><br><label><b>CTRL:</b> Otworzenie w nowej karcie</label><br><label><b>ALT:</b> otworzenie w aktualnej karcie na pełnej stronie</label><br><label><b>SHIFT:</b> otworzenie w unikalnym okienku, które nie znika</label><br><label>Zwykłe: Otworzenie w okienku z raportem</label>').find('#TWBot_raporty_temp').keyup(function() {
					var n = parseInt(this.value, 10);
					if (this.value !== (n+'')) {
						return true;
					}
					var t = $(this).parent();
					t.find('span').html(n);
					t.find('input[name=usuwaj]').val(n*86400000);
				}).end();
			},
			Ataki: function() {
				var e = $('<label class="tooltip" title="$J - jednostka<br>$T - szybkość<br>$C - czas wysłania<br>$D - data wysłania<br>$A - agresor<br>$W - pochodzenie<br>$P - nazwa<br>$X - nazwa">Format nazw ataków przybywających <input type="text" name="format" value="$J - $A($W)"></label><br><label><input type="checkbox" name="on">Sprawdzanie ataków</label>');
				unsafeWindow.UI.ToolTip(e.filter('.tooltip').wrappedJSObject);
				return e;
			},
			'Auto-logowanie': {
				init: function() {
					var s = TWManager.cache.get('autologin', {}), ac = TWManager.cache.get('CBH-passy', {}, true), 
						getPtFc = function() {TWManager.captcha.getPoints(function(p) {if (isNaN(p)) { p = 'Błąd logowania!'; } $('#ac_points').html(p);});};
					setTimeout(getPtFc, 100);
					return $('<noautofill/><label><input type="checkbox" name="al_on"'+getChecked(s.al_on)+'> Automatyczne logowanie w przypadku wygaśnięcia sesji.</label><br><label>Hash: <input type="password" id="al_login" value="' + TWManager.cache.get('login_' + TWManager.dane.login, '') + '"></label><br><br><h2>Anty-Captcha</h2><br><label><input type="checkbox" name="ac_on"'+getChecked(s.ac_on)+'> Automatyczne wpisywanie kodu captcha przy użyciu <br><a href="http://captchabrotherhood.com/">Captcha Bortherhood</a></label><br><label>Punkty: <b id="ac_points">...</b></label><a href="#" class="btn check_button" style="float:right">Sprawdź</a><br><label>Login: <input type="text" id="ac_user" value="' + (ac.user || '') + '"></label><br><label>Hasło: <input type="password" id="ac_pass" value="' + (ac.pass || '') + '"></label><br>').filter('.check_button').click(function() {TWManager.captcha.user = $('#ac_user').val(); TWManager.captcha.pass = $('#ac_pass').val(); getPtFc(); return false;}).end();

				},
				save: function() {
					var s = $('#TWBot_ustawienia_holder').settings();
					TWManager.cache.set('login_' + TWManager.dane.login, $('#al_login').val());
					TWManager.cache.set('autologin', s);
					TWManager.cache.set('CBH-passy', {user: $('#ac_user').val(), pass: $('#ac_pass').val()}, true);
				}
			},
			AF: function() {
				return $('<label><input type="checkbox" name="autosend">Automatycznie zacznij wysyłać ataki</label><br><input type="radio" name="przycisk" value="A"> <label>A</label><input type="radio" name="przycisk" value="B"> <label>B</label><input type="radio" name="przycisk" value="C"> <label>C</label><br><label><input type="checkbox" name="refresh">Przechodź między stronami</label><br><label>Co tyle minut (do tej wartości zostanie dodane losowo 1-5 minut) <br></label><input type="text" name="refreshinterval" value="5">');
			},
			NodeBot: function() {
				return $('<table class="vis"><tr><th colspan="2">Ustawienia NodeBot</th></tr><tr><td colspan="2"><label><input type="checkbox" name="on">Włącz</label></td></tr><tr><td colspan="2"><label><input type="checkbox" name="local">Lokalny</label></td></tr><tr><td>Adres</td><td><input type="text" name="address"></td></tr><tr><td>Login</td><td><input type="text" name="login"></td></tr><tr><td>Hasło HTTP</td><td><input type="password" name="password"></td></tr></table><textarea style="width:100%" id="nodebot_in"/><textarea style="width:100%" id="nodebot_out"/><button id="nodebot_send">Wyslij</button>')
					.filter('button').click(function() {
						$('#nodebot_out').val('');
						TWManager.tools.nodeRequest(JSON.parse($('#nodebot_in').val()), function(d) {
							$('#nodebot_out').val(JSON.stringify(d));
						});
					}).end();
			}
		}
	},
	wioski: {
		laduj: function(v, cb) {
			if (parseInt(v, 10) !== v) { return error('Zły id wioski! ('+v+')'); }
			var wioska;
			try {
				wioska = TWManager.cache.get('wioska_' + v, {});
				if (typeof(wioska) === 'string') {
					wioska = JSON.parse(wioska);
				}
			}catch(e){ 
				wioska = {};
			}
			if (!cb) { return wioska; }
			if (!wioska.aktualizacja || wioska.aktualizacja < new Date().getTime() - 60*60*1000) {
				TWManager.request({
					method: 'GET',
					url: '/game.php?village='+v+'&screen=overview',
					onload: function(x) {
						var wioska = TWManager.wioski.zaladowanoStrone(x);
						cb(wioska, true);
					},
				});
			} else {
				cb(wioska, false);
			}
		},
		zapisz: function(v, b) {
			if (!b) {
				v.aktualizacja = new Date().getTime();
			}
			TWManager.cache.set('wioska_'+v.id, v);
		},
		zaladowanoStrone: function(x) {
			var gdata = null;
			try { 
				gdata = x.match(/TribalWars\.updateGameData\((.*)\);/)[1];
				var dane = JSON.parse(gdata);
				TWManager.wioski.zapisz(dane.village);
				return dane.village;
			}catch(e) {
				error("Pobrano złe dane wioski, JSON.parse exception: " + e);
				unsafeWindow.error = unsafe({exception: e, params: [x], data: [gdata]});
			}
			return {};
		},
	},
	request: function(conf) {
		var oldload = conf.onload, olderror = conf.onerror;
		conf.onload = function(x) {
			if (x.responseText.indexOf('<title>Ochrona') > 0) {
				error('Got captcha!');
				// var captchaurl = x.responseText.match(/\/human\.php\?s\=[a-z0-9]+/);
				//TWManager.captcha.resolve(function() {GM_xmlhttpRequest(conf);});
				unsafeWindow.error = unsafe({params: [unsafe(x)], data: [x.responseText.indexOf('<title>Ochrona')]});
				return;
			} else {
				if (TWManager.dane.ochrona) {
					delete TWManager.dane.ochrona;
				}
			}
			try{
				oldload(x.responseText);
			}catch(e){
				unsafeWindow.error = unsafe({exception: e, params: [unsafe(x)], data: [x.responseText.indexOf('<title>Ochrona')]});
			}
		};
		conf.onerror = function(x) {
			return olderror(x.responseText);
		};
		if (TWManager.captchaWToku) {
			TWManager.kolejkaCaptchy.push(conf);
		}
		else {
			console.log(conf.method, ' request to ', conf.url);
			GM_xmlhttpRequest(conf);
		}
	},
	init: function(name) {
		var regex = /[?&]([^=#]+)=([^&#]*)/g, m;
		try{ while(m = regex.exec(document.location.search)) this.url[m[1]] = m[2];} catch(e) {error('TWManager create - href split - ' + e);}
		this.wioska = parseInt(this.url.village);
		var d = {}, t=['swiat', 'login', 'task', 'autologin', 'lastLocation', 'raporty_kontynuuj', 'ochrona'];
		for(var i in t) {
			d[t[i]] = name[t[i]];
		}
			
		this.dane = d;
		
		//swiat, login, task, autologin, lastLocation, raporty_kontynuuj, ochrona
		
		$(window).bind('beforeunload', function() {
			var n = window.name;
			try {
				n = JSON.parse(n);
			} catch (e) {
				n = {};
			}
			unsafeWindow.name = JSON.stringify($.extend(n, TWManager.dane));
			//console.log(JSON.stringify($.extend(n, TWManager.dane)));
			//return window.name + ' - ' + JSON.stringify($.extend(n, TWManager.dane));
		});
		var retryButton = $('#errorTryAgain, #reload-button');
		if (retryButton.length) {
			setTimeout(function(){
				for (var i = 0; i < retryButton.length; i++) {
					retryButton[i].click();
				}
			}, 4000);
			return;		
		}
		document.arrive('head script', function call() {
			if (this.innerHTML.indexOf('game_data') > 0) {
				var gdata = null;
				try { 
					gdata = this.innerHTML.match(/var game_data = (.*);/)[1];
					var dane = JSON.parse(gdata);
					TWManager.wioski.zapisz(dane.village);
					TWManager.premium = dane.player.premium;
					try{ 
						if (!TWManager.dane.login) {
							TWManager.dane.login = dane.player.name;
						}
							
						TWManager.wioska = dane.village.id;
					} catch(e) {TWManager.dane.wioska = TWManager.url.wioska;}
				}catch(e) {
					error('Pobrano złe dane wioski, JSON.parse exception: ' + e);
					unsafeWindow.error = unsafe({exception: e, data: [gdata]});
				}
				document.unbindArrive(call);
			}
		});
		
		Fwk.body(function(){
			$('<div class="TWB_container" style="z-index:99999;top:-2px;height:105%;position:fixed"><table style="height:100%"><tbody><tr><td id="TWB_bar" style="top:-10px;padding-top: 3px;vertical-align:top;left:-8px;width:40px;height:110%;position:absolute;z-index:1;background:transparent url(https://dspl.innogamescdn.com/graphic/index/bg-shaded.png) scroll right top repeat-x"></td><td style="width:25px;height:100%;position:absolute;top:0px;vertical-align:top;left:20px;z-index: 0;background:transparent url(https://dspl.innogamescdn.com/graphic/index/mainborder-right.png) scroll right top repeat-y"><div style="width:25px;height:200px;background:transparent url(https://dspl.innogamescdn.com/graphic/index/mainborder-right-top.png) scroll left top repeat-x"></div></td></tr></tbody></table></div>').appendTo(this);
			TWManager.ustawienia.init(Fwk.work());
			TWManager.farmer.init();

		});
		
		if (GM_listValues() === undefined) {
			error('GM API test failed. reloading.');
			setTimeout(document.location.reload.bind(document.location), 3000);
			return;
		}
			
		TWManager.chmura.init();
		// autologin
		if (Fwk.isSidWrong()) {
			TWManager.gg.wyslij(11930927, 'Sesja na ' + TWManager.dane.swiat + ' wygasła.');
			console.log(TWManager.dane.login, TWManager.cache.get('autologin', false));
			if (TWManager.dane.login && TWManager.cache.get('autologin', {al_on: false, ac_on:false}).al_on) {
				TWManager.dane.autologin = true;
				var pass = TWManager.cache.get('login_' + TWManager.dane.login, 0);
				if (pass !== 0) {
					location.href = 'https://pl' + TWManager.dane.swiat + '.plemiona.pl/login.php?user=' + TWManager.dane.login + '&password=' + pass + '&utf-8';
				} else {
					TWManager.gg.wyslij(11930927, 'No password given for login ' + TWManager.dane.login);
				}
			}
			return;
		}
		if ((TWManager.dane.autologin) && (location.href !== TWManager.dane.lastLocation)) {
			TWManager.dane.autologin = false;
			location.href = TWManager.dane.lastLocation;
			return;
		} else {
			TWManager.dane.lastLocation = location.href;
		}
		
		//unsafeWindow.eval('var o=TribalWars.handleResponse;TribalWars.handleResponse=function(){var q=$(".FZ_quest");o.apply(TribalWars,arguments);q.appendTo("#questlog");}');

		if (Notification.permission !== 'granted') {
			Notification.requestPermission();
		}
		
		Fwk.load(function() {
			TWManager.captcha.init();
			if (TWManager.url.t) { // na zaście
				$('.new_post').removeClass('new_post').addClass('no_new_post'); // nie widać nowych postów na forum		
			}
			unsafeWindow.eval('TribalWars.contentLoaded=function(){TWManager.onPartialReload();if(this._onLoadHandler)this._onLoadHandler();this.restoreInputVars()}');
			unsafeWindow.eval('TribalWars.contentLoaded.toString=function(){return "function(){if(this._onLoadHandler)this._onLoadHandler();TribalWars.restoreInputVars()}"}');

			TWManager.nodeBot.init();
		});
		TWManager.css();
		TWManager.event.init();
		
		TWManager.raporty.init();			
			
			
		TWManager.funkcje.ladujUstawieniaSwiata();
			
		$(window).focus(function() { TWManager.aktywny = true; });
		$(window).blur(function() { TWManager.aktywny = false; });

		var funkcja = TWManager[TWManager.url.screen];
		if (undefined !== funkcja) {
			if (typeof funkcja.init === 'function') {
				funkcja.init();
			}
		}
	},
	map: {
		init: function() {
			Fwk.load(function() {TWManager.map.ladujWioski();});
			Fwk.each('#newbieProt', function call() {
				document.unbindArrive(call);
				TWManager.map.hud.init();
				if (!TWManager.premium) {
					TWManager.map.ulepsz();
				}
			});
		},
		partialReload: function() {
			TWManager.map.ladujWioski();
			// TWManager.map.hud.init();
			if (!TWManager.premium) {
				TWManager.map.ulepsz();
			}
		},
		ulepsz: function() {
			var me = this;
			var TWMap = unsafeWindow.TWMap;


			unsafeWindow.premium = true;
			unsafeWindow.game_data.premium=true;
			TWMap.premium=true;
			TWMap.graphics = TWMap.graphics.replace('version2/', '');
			TWMap.notifyMapSize = unsafe(me.notifyMapSize.bind(me));
			TWMap.updateSizeSelect = unsafe(function (size,selector_selectbox,selector_size){var option_el;if(size[0]==size[1]&&(option_el=$(selector_selectbox).find('option[value="'+size[0]+'"]'))&&option_el.length>0){option_el[0].selected=true;$(selector_size).hide();}else{var sizestr=size[0]+'x'+size[1];$(selector_size).show().val(sizestr).text(sizestr)[0].selected=true;}}, unsafeWindow);
			var size = TWManager.cache.get('wielkosc_mapy', [[9,9], [50,50]]);
			//$('#minimap').width(size[1][0]).height(size[1][1]);
			$('#map').width(size[0][0]*TWMap.tileSize[0]).height(size[0][1]*TWMap.tileSize[1]);
			var oldf = TWMap.initMap;
			unsafeWindow.setTimeout('('+me.ulepszPozniej+')('+JSON.stringify(size)+')',100);
			this.dodajAtaki();
			$('<br/><table class="vis" width="100%"><tr><th colspan=2>Zmień rozmiar mapy</th></tr><tr><td><table cellspacing="0"><tr><td width="80">Mapa:</td><td><select id="map_chooser_select" onchange="TWMap.resize(parseInt($(\'#map_chooser_select\').val()), true)"><option id="current-map-size" value="_MAPSIZE_" selected="selected">_MAPSIZE_</option><option value="4">4x4</option><option value="5">5x5</option><option value="7">7x7</option><option value="9">9x9</option><option value="11">11x11</option><option value="13">13x13</option><option value="15">15x15</option><option value="20">20x20</option><option value="30">30x30</option></select></td><td valign="middle"><img alt="" class="tooltip" src="https://cdn.tribalwars.net/graphic//questionmark.png" width="13" height="13" title="Możesz dowolnie zmienić rozmiar mapy za pomocą myszki" /></td></tr></table></td></tr><tr><td><table cellspacing="0"><tr><td width="80">Minimapa:</td><td colspan="2"><select id="minimap_chooser_select" onchange="TWMap.resizeMinimap(parseInt($(\'#minimap_chooser_select\').val()), true)"><option id="current-minimap-size" value="_MINISIZE_" selected="selected">_MINISIZE_</option><option value="20">20x20</option><option value="30">30x30</option><option value="40">40x40</option><option value="50">50x50</option><option value="60">60x60</option><option value="70">70x70</option><option value="80">80x80</option><option value="90">90x90</option><option value="100">100x100</option><option value="110">110x110</option><option value="120">120x120</option></select></td></tr></table></td></tr></tbody></table>'.replace(/_MAPSIZE_/g, size[0].join('x')).replace(/_MINISIZE_/g, size[1].join('x'))).appendTo($('#map_config').parent());

			unsafeWindow.eval('if(!TWMap.init_)TWMap.init_=TWMap.init;TWMap.init=function(){$(TWMap).trigger("beforeinit");this.init_.apply(this,arguments);$(TWMap).trigger("afterinit");}');
			unsafeWindow.$(TWMap).on('beforeinit', function(){
				TWMap.size = size[0];
			}).on('afterinit', function() {
				TWMap.minimap.resize(size[1][0]/5, size[1][1]/5, false);
			});
			Fwk.load(function() {
				// to jest taki śmieszny hack zeby zawsze pokazywalo popup
				var current_village = unsafeWindow.game_data.village;
				unsafeWindow.eval('('+(function(){
					$(document).ready(function() {
						TWMap.popup.extraInfo = true;
						TWMap.popup.popupOptionsSet = function() {return true;};
						$.fn.is = function (e){if((e===':checked')&&(this.selector.substr(0,11)==='#map_popup_'))return true;return!!e&&("string"==typeof e?$.expr.match.needsContext.test(e)?$(e,this.context).index(this[0])>=0:$.filter(e,this).length>0:this.filter(e).length>0)};
					});
				}).toString()+')()');
				TWMap.popup.loadVillage = unsafe(function (village_id) {
					TWMap.popup._cache[village_id] = 'notanobject';
					var vill = TWMap.villages[TWMap.villageKey[village_id]];
					var d = TWMap.CoordByXY(vill.xy);
					var dist = TWMap.context.FATooltip.distance(current_village.x, current_village.y, d[0], d[1]);
					setTimeout(function() {
						var data = TWManager.cache.get('village-popup-data_' + village_id, {"units":[],"id":vill.id,"xy":vill.xy});
						var u = data.units;
						data.units = {};
						var speed = [0.0009259259259,0.0007575757576,0.0009259259259,0.0009259259259,0.001851851852,0.001666666667,0.001666666667,0.001515151515,0.0005555555556,0.0005555555556,0.001666666667,0.0004761904762];
						for (var i = 0; i < units.length; i++) {
							var time = false;
							if (dist > 0)
								time = TWMap.context.FATooltip.formatDuration(TWMap.context.FATooltip.calculateDuration(dist, speed[i]));
							data.units[units[i]] = {image:"unit/unit_" + units[i] + ".png", time: time, count:{home:0, foreign:u[i] || 0}};
						}
						TWMap.popup._currentVillage = village_id;
						TWMap.popup.receivedPopupInformationForSingleVillage(unsafe(data));
					}, 0);
				}); 
			});

		},
		ulepszPozniej: function(size) {
			TWMap.minimap.createResizer([20,20],[200,200],5);
			TWMap.map.createResizer([4,4],[40,40]);
			if (size.length>1) {
				TWMap.minimap.resize(size[1][0], size[1][1], 0);
			}
		},
		dodajAtaki: function() {
			var ataki = TWManager.cache.get('ataki_out', {});
			var updated = false;
			var icons = unsafeWindow.TWMap.commandIcons;
			for (var i in ataki) {
				var a = ataki[i];
				if (!a.vid) {
					var twv = unsafeWindow.TWMap.villages[a.koord.join('')];
					if (twv) {
						a.vid = twv.id;
						updated = true;
					} else {
						console.log('Village for attack', a, 'not found.');
					}
				}
				if (!icons[a.vid])
					icons[a.vid] = unsafe([]);
				else {
					var bylo=false;
					for (var b in icons[a.vid]) if (icons[a.vid][b].img.indexOf(a.obrazek) >= 0) {bylo = true; break;}
					if (bylo) continue;
				}
				//if ('attack return cancel'.indexOf(a.obrazek) !== -1)
				icons[a.vid].push(unsafe({"img":'../command/' + a.obrazek}));
			}
			if (updated) {
				TWManager.cache.set('ataki_out', ataki);
			}
		},
		ladujWioski: function() {
			var me = TWManager.map;
			var TWMap = unsafeWindow.TWMap;
			var wioski = TWManager.cache.get('wioski', {});
			for (var i in TWMap.villages) {
				var v = TWMap.villages[i];
				if (v.special) continue;
				var n = i.delim('|', 3);
				var w = wioski[n] || {};
				w.id = v.id;
				w.punkty = v.points;
				w.gracz = v.owner;
				w.poparcie = v.mood;
				w.koord = n.split('|');
				wioski[n] = w;
			}
			TWManager.cache.set('wioski', wioski);
			TWMap.context.spawn = unsafe(me.context.spawn);
		},
		notifyMapSize: function () { // UNSAFE!!
			var TWMap = unsafeWindow.TWMap;
			if(TWMap.minimap_size.join('x') == '0x0') return;
			TWMap.updateSizeSelect(TWMap.size, '#map_chooser_select', '#current-map-size');
			TWMap.updateSizeSelect(TWMap.minimap_size, '#minimap_chooser_select', '#current-minimap-size');
			setTimeout(function(){
				TWManager.cache.set('wielkosc_mapy', [TWMap.size, TWMap.minimap.size]);
			},0);
		},
		context: {
			hooks: {
				mp_lock: function(TWMap, x, y, village) {
					if (!TWManager.premium)
						return error('Not implemented!');
					var url = TWMap.urls.ctx.mp_lock.replace(/__village__/, village.id);
					var now = new Date().getTime();
					if (TWMap.context._last && (now - TWMap.context._last < 900)) return;
					TWMap.context._last = now;
					unsafeWindow.TribalWars.get(url, null, unsafe(function (data) {
						TWMap.context.ajaxDone('mp_lock', data);
					}));
					// FARM		"/game.php?village=27201&mode=farm&ajaxaction=farm&h=73ed&template_id=6658&target=__village__&source=__source__&json=1&screen=am_farm"
					// LOCK		"/game.php?village=27201&id=__village__&ajaxaction=toggle_reserve_village&h=73ed&json=1&screen=info_village"
					// UNLOCK	"/game.php?village=27201&id=__village__&ajaxaction=toggle_reserve_village&h=73ed&json=1&screen=info_village"
					
				},
				mp_att: function(TWMap, x, y, village) {
					unsafeWindow.TWMap.actionHandlers.command.click(village.id);
				},
				mp_res: function(TWMap, x, y, village) {
					unsafeWindow.TWMap.actionHandlers.market.click(village.id);
				}
			},
			spawn: function (village, x, y) {
				var TWMap = unsafeWindow.TWMap;
				var coordidx = x * 1e3 + y, me = TWMap.context, pos, game_data = unsafeWindow.game_data;
				if (coordidx == me._curFocus) {
					if (village.special == 'ghost') {
						document.location.href = TWMap.urls.ctx.mp_invite;
					} else document.location.href = TWMap.urls.villageInfo.replace(/__village__/, village.id);
					return true;
				}
				me.hide();
				if (TWMap.light) {
					pos = [(x - TWMap.posTL[0]) * TWMap.tileSize[0], (y - TWMap.posTL[1]) * TWMap.tileSize[1]];
				} else {
					TWMap.popup.hide();
					var pos_center = TWMap.map.pixelByCoord(x, y),
						pos_topleft = TWMap.map.pos;
					pos = [pos_center[0] - pos_topleft[0], pos_center[1] - pos_topleft[1]];
				}
				pos[0] += TWMap.tileSize[0] / 2;
				pos[1] += TWMap.tileSize[1] / 2;
				var buttons = [],
					button_order;
				if (!village.hasOwnProperty('special')) {
					button_order = (village.owner == game_data.player.id) ? me._ownOrder : me._otherOrder;
				} else if (village.special == 'ghost') button_order = [null, null, 'mp_invite', 'mp_invite_hide'];
				var circle_pos = me._circlePos;
				$(button_order).each(function (k, v) {
					if ( (village.owner=='0') && (v=='mp_profile' || v == 'mp_msg' ) ) { return; }
					
					//else if(!me._showPremium&&(v=='mp_lock')) {return;} // wyłączenie rezerwacji dla graczy premium
					else if((v=='mp_farm_a'||v=='mp_farm_b')&&(village.owner>0)) {return;}
					else if(game_data.village.id==village.id&&(v=='mp_res'||v=='mp_att')) {return;}
					else if(game_data.player.ally_id===0&&v=='mp_lock') {return;}
					else if(!village.points&&(v=='mp_fav'||v=='mp_lock')) {return;}
					if (v == 'mp_lock' && TWMap.reservations[village.id]) v = 'mp_unlock';
					if (v == 'mp_fav' && $.inArray(parseInt(village.id), TWMap.targets) != -1) v = 'mp_unfav';
					$('#' + v).css('left', (pos[0] + circle_pos[k][0]) + 'px').css('top', (pos[1] + circle_pos[k][1]) + 'px').stop().css('opacity', 0).show().fadeTo(120, 1.0);
					if (TWManager.map.context.hooks[v]){
						$('#' + v).unbind('click').click(function (e) {
							e.preventDefault();
							try {
								TWManager.map.context.hooks[v](TWMap, x, y, village);
							} catch(e) {error(e);}
							return false;
						});
					} else if (TWMap.urls.ctx[v]) {
						var url = TWMap.urls.ctx[v].replace(/__village__/, village.id).replace(/__owner__/, village.owner).replace(/__source__/, game_data.village.id);
						if (url.match(/json=1/)) {
							me.ajaxRegister(v, url);
						} else try {
							$('#' + v)[0].href = url;
						} catch (e) {
							console.error('TWMap.context.spawn: #' + v + ' ' + e);
						}
					}
					buttons.push(v);
				});
				me._curFocus = coordidx;
				me._visible = true;
			}
		},
		hud: {
			okregi: {}, wioski: {},	sektory: {},
			init: function() {
				var me=this, okr = me.okregi.wrappedJSObject, TWMap=unsafeWindow.TWMap;
				$(TWMap).on("shouldSpawnSector", function(e, sector, data) {
					if (!jQuery.isEmptyObject(okr)) return false; // false means SHOULD spawn
				})
				.on("spawnSector", function(e, x, y, ctx, sector, data) {
				try {
					if (okr && !(!TWMap.warMode && TWMap.politicalMap.displayed && (TWMap.politicalMap.filter & 16))) {
						for (var i in okr) {
							var cx = okr[i].x,
								cy = okr[i].y,
								crad = okr[i].r;
									
							MapCanvas.mapDrawCell(ctx, x - sector.x, y - sector.y, [MapCanvas.churchInBound(x - 1, y - 1, cx, cy, crad), MapCanvas.churchInBound(x, y - 1, cx, cy, crad), MapCanvas.churchInBound(x + 1, y - 1, cx, cy, crad), MapCanvas.churchInBound(x - 1, y, cx, cy, crad), MapCanvas.churchInBound(x, y, cx, cy, crad), MapCanvas.churchInBound(x + 1, y, cx, cy, crad), MapCanvas.churchInBound(x - 1, y + 1, cx, cy, crad), MapCanvas.churchInBound(x, y + 1, cx, cy, crad), MapCanvas.churchInBound(x + 1, y + 1, cx, cy, crad)], me.okregi[i].c, 19, 19, 0.5);
						}
					}
					}catch(e){console.error(e);}
				})
				.on("createVillageIcons", function(e, icons, v, sector, data) {
					var w = me.wioski.wrappedJSObject[v.xy];
					if (!w) return;
					var el = document.createElement('div');
					el.style.position = 'absolute';
					el.style.zIndex = '11';
					el.style.width=49+'px';
					el.style.height=34+'px';
					el.style.border = '2px solid ' + w;
					icons.push(el.wrappedJSObject);
				});
			},
			dodajWioske: function(x, y, kolor) {

				if (typeof kolor == "object") {
					if (kolor.length)
						kolor = 'rgba('+kolor[0]+','+kolor[1]+','+kolor[2]+','+(kolor[3]||1)+')';
					else
						kolor = 'rgba('+kolor.r+','+kolor.g+','+kolor.b+','+(kolor.a||1)+')';
				}
				this.wioski[x*1000+y] = kolor;
				unsafeWindow.TWMap.RedrawSector(x, y);
				/*
				var el_img = document.createElement('img'),
				img = (Warplanner.data[v.id].type === 'A') ? 'attack' : 'fake';
				el_img.style.position = 'absolute';
				el_img.style.zIndex = '10';
				el_img.style.marginTop = ((38 - 30) / 2) + 'px';
				el_img.style.marginLeft = ((53 - 30) / 2) + 'px';
				el_img.src = TWMap.image_base + '/icons/warplanner_' + img + '.png';
				icons.push(el_img)
				*/
			},
			dodajOkreg: function(x, y, r, kolor, id) {
				var t = {x:x, y:y, r:r, c:kolor};// okregi = {id: {x,y,r:promien,c:kolor}, id2: ...}
				this.okregi[id] = t;
				this.getSector(x, y, true).okregi[id] = t;
				unsafeWindow.TWMap.RedrawSector(x, y);
			}, 
			getSector: function(x, y, force) {
				var n = (Math.floor(x/20)*20) + '_' + (Math.floor(y/20)*20);
				var s = this.sektory[n];
				
				if (!s && force) {					
					s = {okregi: {}};
					this.sektory[n] = s;
				}
				return s;
			}
		}
	},
	overview: {
		init: function() {
			Fwk.load(this.initPozniej.bind(this));
		},
		partialReload: function() {
			this.initPozniej();
		},
		initPozniej: function() {
			var me = this;
			this.wioski = TWManager.cache.get('wioski', {});
			var ataki = TWManager.cache.get('ataki_out', {});
			this.ustawienia = TWManager.cache.get('ustawienia_Ataki', {format: '$J - $A($W)'});
			for (var i in ataki)
				if (ataki[i].wioska == TWManager.wioska)
					ataki[i].sprawdzony = false;
					
			var t = $('span.quickedit-out');
			for (i = 0; i < t.length; i++) {
				var el = $(t[i]), id = el.data('id');
				ataki[id] = this.ladujAtak(el, id, ataki[id], true);
			}
			for (i in ataki) { // ta wioska i nie widać lub stary (dojscie + 2x trwanie i dojscie + 1 dzien minelo)
				if (((ataki[i].wioska == TWManager.wioska) && (!ataki[i].sprawdzony)) || (Math.max(ataki[i].czas + (ataki[i].czas - ataki[i].zauwazony)*2, ataki[i].czas + 86400000) < new Date().getTime()))
				{
					delete ataki[i];
					console.log('usuwanie ataku_out o id ' + i);
				}
			}
			// console.log('ataki out:', ataki);
			TWManager.cache.set('ataki_out', ataki);
			var ataki = TWManager.cache.get('ataki_in', {});
			for (var i in ataki)
				if (ataki[i].wioska == TWManager.wioska)
					ataki[i].sprawdzony = false;
					
			var t = $('#show_incoming_units').find('.quickedit');
			for (i = 0; i < t.length; i++) {
				var el = $(t[i]), id = el.data('id');
				ataki[id] = this.ladujAtak(el, id, ataki[id]);
			}
			
			for (i in ataki) { // ta wioska i nie widać lub stary (dojscie + 2x trwanie i dojscie + 1 dzien minelo)
				if (((ataki[i].wioska == TWManager.wioska) && (!ataki[i].sprawdzony)) || (Math.max(ataki[i].czas + (ataki[i].czas - ataki[i].zauwazony)*2, ataki[i].czas + 86400000) < new Date().getTime()))
				{
					delete ataki[i];
					console.log('usuwanie ataku_in o id ' + i);
				}
			}
			// console.log('ataki in:', ataki);
			TWManager.cache.set('ataki_in', ataki);
			var header = $('#show_outgoing_units').find('th').first();
			['return_attack_large', 'attack_large', 'return_attack_medium', 'attack_medium', 'return_attack_small', 'attack_small', 'return_farm', 'farm'].forEach(function(i) {
				$('<img style="float:right;opacity:1" class="" src="https://dspl.innogamescdn.com/graphic/command/'+i+'.png"><span style="float:right;opacity:1">&nbsp;</span>;').click(me.przelaczAtaki).appendTo(header);
			});
			var gd = unsafeWindow.game_data;
			if (!gd) {
				error('[Map Enhancer] Nie znaleziono struktury game_data!');
			} else if (!TWManager.premium) {
				var ud;
				try {
					ud = unsafeWindow.UnitPopup.unit_data;
				}catch(e) {return error('[Map Enhancer] Nie znaleziono struktury unit_data!');}

				if (ud) {
					var market = ([0,1,2,3,4,5,6,7,8,9,10,11,14,19,26,35,46,59,74,91,110,131,154,179,206,235])[gd.village.buildings.market];
					var flag_el = $('.village_overview_effect *');
					var data = {id: gd.village.id, xy: ~~gd.village.coord.replace('|',''), units:[],
						resources:{wood:gd.village.wood,stone:gd.village.stone,iron:gd.village.iron,max:~~gd.village.storage_max},population:{current:~~gd.village.pop,max:~~gd.village.pop_max},
						trader:{current:market-gd.village.trader_away,total:market},
					};
					if (flag_el.length) {
						data.flag = {image_path:'http://dspl.innogamescdn.com/8.24/21113/graphic/flags/small/'+flag_el[0].src.match(/[^\/]+\.png/)[0],short_desc:flag_el.text()};
						if (data.flag.image_path.indexOf('none.png') > 0) {
							delete data.flag;
						}
					}
					for (var i in units) 
						data.units.push(ud[units[i]] && ud[units[i]].count ? ~~ud[units[i]].count : 0);

					TWManager.cache.set('village-popup-data_' + TWManager.wioska, data);
				}
			}
			
		},
		przelaczAtaki: function() {
			var img = this.src.match(/(\/[a-z_]+\.png)/)[1];
			$("img[src*='" + img + "']:not(:first)").closest('tr').toggle();
			this.style.opacity = (this.style.opacity === 0.3 ? 1 : 0.3);
		},
		noweInfo: function(dane) {
			$('.quickedit[data-id='+dane.id+'] .quickedit-label').html(dane.nowa_nazwa || this.nazwa(dane)).addClass('tooltip')
				.attr('title', 'Zauważony: ' + TWManager.tools.timeToReportText(new Date(dane.zauwazony)) + '<br>Powrót: ' + TWManager.tools.timeToReportText(new Date(Math.floor((dane.czas+Math.round(dane.dystans*dane.szybkosc*60000))/1000)*1000)));
			unsafeWindow.UI.ToolTip('.tooltip');
		},
		ladujAtak: function(el, id, def, out) {
			var dane = def || {};
			dane.nazwa = el.text().trim();
			if (!dane.id) {
				dane.id = parseInt(id, 10);
				dane.wioska = TWManager.wioska;
				dane.laduj = true;
				dane.zauwazony = new Date().getTime();
				dane.czas = TWManager.tools.textToMs(el.parent().next().text());
				if (out) {
					try {
						dane.koord = TWManager.tools.parseCoords(dane.nazwa);
						var wioska = this.wioski[dane.koord.join('|')];
						dane.vid = wioska ? wioska.id : null;
					} catch(e) {console.error(e);}
				}
			}
			dane.sprawdzony = true;
			if (out) {
				dane.obrazek = el.parent().find('img:first').url().match(/\/([a-z_]+)\.png/)[1];
			} else {
				dane.obrazek = el.find('img').url().match(/\/([a-z_]+)\.png/)[1];
				if (this.ustawienia.on) {
					if (dane.laduj) {
						this.pobierzAtak(el.find('a').url(), dane);
					} else {
						this.noweInfo(dane);
					}
				}
			}
			return dane;
		}, 
		pobierzAtak: function(url, dane) {
			var me = this;
			TWManager.funkcje.pobierz(url + '&_partial', function(content, dane) {
				var ataki = TWManager.cache.get('ataki_in', {});//
				var a = $(content).find('td:eq(2), td:eq(4) span, td:eq(7), td:eq(9) span');
				dane.pochodzenie = {
					gracz: {
						nick: a.eq(0).text(),
						id: a.eq(1).data('player')
					},
					plemie: a[0].title, 
					wioska: {
						id: a.eq(1).data('id'),
						koord: TWManager.tools.parseCoords(a.eq(1).text())
					}
				};
				var p = dane.pochodzenie.wioska.koord;
				dane.dystans = TWManager.tools.distance(p[0], p[1], parseInt(unsafeWindow.game_data.village.x, 10), parseInt(unsafeWindow.game_data.village.y, 10));
				var units = [['Szlachcic', 35, 'noble'], ['Taran', 30, 'ram'], ['Miecz', 22, 'sword'], ['Topór', 18, 'axe'], ['CK', 11, 'heavy'], ['Lekka', 10, 'light'], ['Zwiad', 9, 'spy']];
				dane.jednostka = units[units.length-1][0];
				dane.szybkosc = units[units.length-1][1] + '';
				dane.nazwa_jednostki = units[units.length-1][2];
				var time = (dane.czas - dane.zauwazony) / 1000;
				for (var i = 0; i < units.length-1; i++) {
					if (time > dane.dystans * units[i+1][1] * 60){
						dane.jednostka = units[i][0];
						dane.szybkosc = units[i][1];
						dane.nazwa_jednostki = units[i][2];
						break;
					}	
				}
				me.noweInfo(dane);
				dane.laduj = false; // sprawdzony, nie laduj wiecej go.
				ataki[dane.id] = dane;
				TWManager.cache.set('ataki_in', ataki);
			}, dane);
		},
		nazwa: function(dane) {
			return this.ustawienia.format.replace(/\$J/g, dane.jednostka).replace(/\$T/g, dane.szybkosc).replace(/\$P/g, dane.nazwa).replace(/\$C/g, 'CZAS WYSLANIA').replace(/\$D/g, 'DATA WYSLANIA')
			.replace(/\$A/g, dane.pochodzenie.gracz.nick).replace(/\$W/g, dane.pochodzenie.wioska.koord.join('|')).replace(/\$X/g, dane.nazwa).replace(/\$I/g, dane.nazwa_jednostki && dane.nazwa_jednostki.length ?'<img src="https://dspl.innogamescdn.com/graphic/unit/unit_'+dane.nazwa_jednostki+'.png">' : 'X');
		}
	},
	raporty: {
		klikniecieWLink: function(e) {
			if (e.ctrlKey || e.altKey) { return; }
			e.preventDefault();
			TWManager.raporty.zaladujRaport($(this).reportId(), null, e.shiftKey);
			return false;
		},
		upiekszLink: function(el, raport) {
			if (!el) { el = $('.report[data-id='+raport.id+']')[0]; }
			if (!el) { return; } // widocznie raportu nie ma na tej stronie, ale zostal zaladowany w tle...
			try {
				if (el.nextSibling.data.trim().match(/^\([a-z]+\)$/)) {
					el.nextSibling.remove();
				}
			} catch(e) {}
			if (raport.lastmax) {
				$('<span/>')
					.addClass('grey small')
					.html(' '+(''+raport.lastres).delim('.', 3)+'/'+(''+raport.lastmax).delim('.', 3))
					.appendTo(el.parentNode);
			}
		},
		aktywujLinki: function() {
			var raporty = TWManager.cache.get('raporty', {}),
				lista = TWManager.cache.get('raportyDoPobrania', {}),
				ustawienia = TWManager.cache.get('ustawienia_Raporty');
				
			Fwk.each('.report', function() {
				var id = $(this).unbind('click').click(TWManager.raporty.klikniecieWLink);
				id = id.reportId();
				if (!raporty[id]) {
					lista[id] = true;
					return true;
				}
					
				var raport = TWManager.cache.get('raport_' + id, 'NO');
				if (raport === 'NO') {
					lista[id] = true;
					return true;
				}
				TWManager.raporty.upiekszLink(this, raport);		
			});
			
			if (ustawienia.ladujRaporty && (TWManager.url.screen === 'report' || ustawienia.ladujWTle)) {
				TWManager.raporty.pobierzRaporty(0, lista);
			}
		},
		szukajRaportow: function(szukane, limit) {
			var raporty = TWManager.cache.get('raporty', {});
			var listarap = [];
			for(var id in raporty) {
				listarap.push(id);
			}
			listarap.sort(integerSort);
			var pokaz = [];
			for(var i = listarap.length-1; i >= 0; i--) {
				if (pokaz.length > limit)
					break;
				var raport = TWManager.cache.get('raport_' + listarap[i], 'NO');
				if (raport !== 'NO') {
					if (raport.text.indexOf(szukane) != -1) {
						pokaz.push(raport);
					}
				}
			}
			return pokaz;
		},
		wygenerujWierszRaportu: function(raport) {
			var ret = $('<tr><td colspan=2 style="overflow: hidden">'+(raport.ikona ? '<img src="https://dspl.innogamescdn.com/graphic/dots/'+raport.ikona+'.png"> ':'')+'<span class="quickedit report" data-id="'+raport.id+'"><span class="quickedit-content"><a href="'+raport.url+'"><span class="quickedit-label">'+raport.text+'</span></a></span></span></td><td class="nowrap">'+TWManager.tools.timeToReportText(raport.data)+'</td></tr>');
			TWManager.raporty.upiekszLink(ret.find('span.report'), raport);
			ret.find('a').click(this.klikniecieWLink);
			return ret;
		},
		pokazWynikSzukaniaRaportow: function(lista) {
			$('#zyg_report_list td').parent().remove();
			var el = document.getElementById('zyg_report_list');
			if (!el) return;
			for (var i = 0; i < lista.length; i++) {
				this.wygenerujWierszRaportu(lista[i]).appendTo(el);
			}
		},
		pokazOkno: function() {
			TWManager.funkcje.showDraggableWindow('okno_raportow', 'Raporty',
				'<table id="zyg_report_list" class="vis" width="100%"><tbody><tr><th>Szukaj: <input id="zyg_szukaj_raportow" type="text"></th><th>Temat</th><th>Otrzymane</th></tr></tbody></table>');
			this.pokazWynikSzukaniaRaportow(this.szukajRaportow('', 50));
			document.getElementById('zyg_szukaj_raportow').onkeypress = function(e) {if (e.which == 13) {TWManager.raporty.pokazWynikSzukaniaRaportow(TWManager.raporty.szukajRaportow(this.value, 10000)); return false;}};

		},
		init: function() {
			Fwk.body(function() {
				TWManager.funkcje.addQuest('OpenReports', 'Raporty', 'http://zygzagz.pl/files/raport.png', false, $.proxy(TWManager.raporty.pokazOkno, TWManager.raporty));
			});
			var me = this;
			var ustawienia = TWManager.cache.get('ustawienia_Raporty', {wielkosc: '600px', sprawdzenie: 0, usuwaj: 172800000}); // 2 dni
			if (!ustawienia.sprawdzajRaporty) { return true; }
					
			var raporty = TWManager.cache.get('raporty', {});
			Fwk.beforeLoad(function() {
				unsafeWindow.HotKeys.nextReport = function() {setTimeout(function(){var q=$('#report-next')[0]; if(q) { q.click();}}, 0);};
				unsafeWindow.HotKeys.previousReport=function(){var q=$('#report-prev')[0]; if(q) { q.click();}};
				
				if (TWManager.url.screen !== 'report') {
					return;
				}
				
				$('.quickedit').addClass('report');			
				
				if (ustawienia.ladujRaporty) {
					Fwk.load(function() {
						var lista = TWManager.cache.get('raportyDoPobrania', {});
						var changed = false;
						$('.report').each(function() {
							var id = $(this).reportId();
							if (!raporty[id]) {
								lista[id] = true;
								changed = true;
							}
						});
						if (changed) {
							TWManager.cache.set('raportyDoPobrania', lista);
						}
					});
				}
			});
			Fwk.load(function(){
				me.aktywujLinki();
			});
			
			var now = new Date().getTime(); 
			if (!ustawienia.sprawdzenie) {
				ustawienia.sprawdzenie = 1;
			}
			if (now - 86400000 > ustawienia.sprawdzenie) {
				var del = 0;
				for(var i in raporty) {
					if (raporty[i] < now-ustawienia.usuwaj) {
						TWManager.cache.delete(del++ && 'raport_' + i);
						delete raporty[i];
					}
				}
					
				if (del>0) {	
					TWManager.cache.set('raporty', raporty);
				}
				
				Fwk.load(function(){
					unsafeWindow.UI.Notification.SHOW_TIME = 7500;
					unsafeWindow.UI.Notification.show('', 'Usuwanie raportów', 'Usunięto '+del+' raportów z cache.');
				});
				ustawienia.sprawdzenie = now;
				TWManager.cache.set('ustawienia_Raporty', ustawienia);
			}
		},
		pobierzRaporty: function(id, lista) {
			if (!lista) {
				lista = TWManager.cache.get('raportyDoPobrania', {});
			}
			var raporty = TWManager.cache.get('raporty', {});
			var updated = !!id;
			if (id) {
				lista[id]=true;
			}
			id = 0;
			for (var i in lista) {
				if (raporty[i]) {
					delete lista[i];
					updated=true;
					continue;
				}
				id = i;
				break;
			}
			if (updated) {
				TWManager.cache.set('raportyDoPobrania', lista);
			}
			if (!id) { // lista jest pusta
				return;
			}
					
			TWManager.raporty.pobierzRaport(id, function(raport) {
				var lista = TWManager.cache.get('raportyDoPobrania', {});
				delete lista[id];
				var raporty = TWManager.cache.get('raporty', {});
				if (raport.nastepny && !raporty[raport.nastepny]) {
					lista[raport.nastepny] = true;
				}
				if (raport.poprzedni && !raporty[raport.poprzedni]) {
					lista[raport.poprzedni] = true;
				}
				TWManager.cache.set('raportyDoPobrania', lista);
				TWManager.raporty.pobierzRaporty(0, lista);
			});	
		},
		pobierzRaport: function(raport, callback) {
			var zast = '';
			if (TWManager.url.t) {
				zast = 't=' + TWManager.url.t + '&';
			}
				
			if (typeof raport !== 'object') {
				raport = {id: parseInt(raport, 10), url: '/game.php?' + zast + 'village=' + TWManager.url.village + '&mode=all&view=' + raport + '&screen=report'};					
			}
			TWManager.funkcje.pobierz(raport.url + '&_partial', this.sprawdzRaport.bind(this), [raport, callback]);
		},
		sprawdzRaport: function(content, raport, callback) {
			var raporty = TWManager.cache.get('raporty', {});
			if (raporty[raport.id]) {
				if (TWManager.cache.get('raport_' + id, 'NO') !== 'NO') {
					if (typeof callback === 'function') {
						callback(raport);
					}
					return true;
				}
			}
			content = content.replace(/<h2>(\n|.)*<th width="140">Temat/, '<table class="vis"><tbody><tr><th width="140">Temat').replace(/<script>(\n|.)*<\/table>/, '').replace(/<\/td>\n\t<\/tr>\n<\/table>\n\n$/, '').replace(/[ ]+>/g, '>').replace(/[ ]+\/>/g, '\/>').replace(/<[ ]+/g, '<').replace(/<span class\=\"grey\">\.<\/span\>/g, '');
			var rep = $(content);
			rep.eq(2).find('a').each(function() {
				if (this.id === 'report-prev') {
					raport.poprzedni = parseInt(this.href.match(/view=([0-9]+)/)[1], 10);
				} else if (this.id === 'report-next') {
					raport.nastepny = parseInt(this.href.match(/view=([0-9]+)/)[1], 10);
				}
			});
			var poprz = TWManager.cache.get('raport_' + raport.poprzedni, 'NO');
			if (poprz !== 'NO') {
				poprz.nastepny = raport.id;
				TWManager.cache.set('raport_' + raport.poprzedni, poprz);
			}

			for (var i in raporty) {
				if (i > raport.id) {
					var rap = TWManager.cache.get('raport_' + i, 'NO');
					if ((rap !== 'NO') && (rap.poprzedni === raport.id)) {
						raport.nastepny = rap.id;
						break;
					}
				}
			}
			var ustawienia = TWManager.cache.get('ustawienia_Raporty');
			if (ustawienia.ostatni < raport.id) {
				ustawienia.ostatni = raport.id;
				TWManager.cache.set('ustawienia_Raporty', ustawienia);
			}
			rep = rep.eq(0);
			try {
				raport.text = rep.find('.quickedit-label').text().trim();	// string - tekst raportu
				raport.data = TWManager.tools.reportTextToTime(rep.find('tr td').eq(1).text()).getTime();
								
				if (!rep.find('#attack_luck').length) {
					// To nie jest raport z walki
					raport.content = content.replace(/<a href="[^>]+>&gt;&gt;<\/a>/, '%PREV%').replace(/<a href="[^>]+>&lt;&lt;<\/a>/, '%NEXT%');
					this.zapiszRaport(raport, callback);
					return true;				
				}
				raport.ikona = rep.find('img:first()').attr('src').match(/\/(\w+)\.png/)[1];
				raport.morale = parseInt(rep.find('h4')[1].innerHTML.substr(-4), 10);
				raport.h3 = rep.find('h3').text();
				raport.szczescie = parseFloat(rep.find('.nobg b').text());
				raport.koord = TWManager.tools.getCoords(raport.text); // pop zwraca ostatni element
				
				raport.budynki = {};
				
				var dane, budinfo = rep.find('input#attack_spy_building_data').val(), t, el;
				if (budinfo && budinfo.length) {
					budinfo = JSON.parse(budinfo);
					for (i = 0; i < budinfo.length; i++) {
						raport.budynki[budinfo[i].name.toLowerCase().split(' ')[0]] = parseInt(budinfo[i].level, 10);
					}
					
					dane = rep.find('table#attack_spy_resources td');
					raport.surowce = {};
					t = dane.find('.wood')[0];
					raport.surowce.drewno = parseInt(t ? t.nextSibling.data : 0, 10);
						
					t = dane.find('.stone')[0];
					raport.surowce.glina = parseInt(t ? t.nextSibling.data : 0, 10);
						
					t = dane.find('.iron')[0];
					raport.surowce.zelazo = parseInt(t ? t.nextSibling.data : 0, 10);
					
				}
				dane = rep.find('#attack_results th');
				for (i = 0; i < dane.length; i++) {
					el = dane.eq(i);
					if (el.html() === 'Łup:') {
						raport.lup = {};
						el=el.next();
						t = el.find('.wood')[0];
						if (t) {
							raport.lup.drewno = parseInt(t ? t.nextSibling.data : 0, 10);
						}
						t = el.find('.stone')[0];
						if (t) {
							raport.lup.glina = parseInt(t ? t.nextSibling.data : 0, 10);
						}
						t = el.find('.iron')[0];
						if (t) { 
							raport.lup.zelazo = parseInt(t ? t.nextSibling.data : 0, 10);	
						}
						
						var l = el.next().html().split('/');
						if (l && l.length) {
							raport.lastres = parseInt(l[0], 10);
							raport.lastmax = parseInt(l[1], 10);
							raport.lastfull = l[0]===l[1];
						}
					} else if (el.html().indexOf('tarany') > 0) {
						if (!raport.uszkodzenia) {
							raport.uszkodzenia = {};
						}
						var tab_tar = el.next().html().toLowerCase().match(/(^[A-z]+)|([0-9]+)/g); // ["Mur", "1", "0"]
						if (!tab_tar) {console.log('TAR tab is null: ', el, el.next(), el.next().html());continue;}
						if (!raport.budynki) {
							raport.budynki = {};
						}
						raport.budynki[tab_tar[0]] = parseInt(tab_tar[2], 10);
						raport.uszkodzenia.tarany = {budynek: tab_tar[0], poziom: parseInt(tab_tar[1], 10)};
					} else if (el.html().indexOf('katapult') > 0) {
						if (!raport.uszkodzenia) {
							raport.uszkodzenia = {};
						}
						var tab_kat = el.next().html().toLowerCase().match(/(^[A-z]+)|([0-9]+)/g); // ["Mur", "1", "0"]
						if (!tab_kat) {console.log('KAT tab is null: ', el, el.next(), el.next().html());continue;}
						if (!raport.budynki) {
							raport.budynki = {};
						}
						raport.budynki[tab_kat[0]] = parseInt(tab_kat[2], 10);
						raport.uszkodzenia.katapulty = {budynek: tab_kat[0], poziom: parseInt(tab_kat[1], 10)};
					} else if (el.html() === 'Poparcie:') {
						raport.poparcie = el.next().html().match(/\d+/g);
					} else if (el.html() === 'Uwaga:') {
						if (el.next().html() === 'Twoje wojska zostały wykryte przez wroga') {
							raport.wykrytowojska = true;
						} else {
							error('unknown raport Uwaga: ' + el.next().html());
						}
					} else {
						error('unknown raport TH: ' + el.html());
					}
				}
				
			} catch (e) {
				console.error('parsing report: ' + e); 
				//return '';
				raport.content = content.replace(/<a href="[^>]+>&gt;&gt;<\/a>/, '%PREV%').replace(/<a href="[^>]+>&lt;&lt;<\/a>/, '%NEXT%');
				this.zapiszRaport(raport, callback);
				return true;	
			}
			for (var strona in {att:1, def:1}) {
				raport[strona] = {};
				var tab = rep.find('#attack_info_' + strona);
				var label = tab.find('th:last');
				raport[strona].gracz = {
					nick: label.text(),
					//link: label.children().href(), // nawet jak barba to i tak zwroci undefined
					plemie: label.children().attr('title'), // nie bedzie exception
				};
				label = tab.find('.village_anchor');
				raport[strona].gracz.id = label.data('player');
				raport[strona].wioska = {
					id: label.data('id'),
					text: label.children().text()
				};
				raport[strona].wioska.koord = TWManager.tools.getCoords(raport[strona].wioska.text);
				raport[strona].wojska = {ilosc:{}, straty:{}};
				var typ = ['ilosc', 'straty'],
					units = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
					
				if (strona === 'def') {
					units.push('militia');
				}
	
				tab.find('.unit-item').each(function(i, e) {
					raport[strona].wojska[typ[Math.floor(i/units.length)]][units[i%units.length]] = parseInt(e.innerHTML, 10);			
				});					
			}
			this.zapiszRaport(raport, callback);
		},
		zapiszRaport: function(raport, callback) {
			TWManager.raporty.upiekszLink(null, raport);	
			var raporty = TWManager.cache.get('raporty', {});
			raporty[raport.id] = raport.data;
			TWManager.cache.set('raporty', raporty);
			TWManager.cache.set('raport_' + raport.id, raport);
			if (!raport.content) {
				var wioski = TWManager.cache.get('wioski', {});
				var w = wioski[raport.def.wioska.koord];
				if (!w) {
					wioski[raport.def.wioska.koord]=w={id: raport.def.wioska.id, koord: raport.def.wioska.koord};
				}

				if (!w.raporty) { w.raporty = {att:{}, def:{}}; }
				w.raporty.def[raport.data] = raport.id;
				if (w.raporty.def.lat < raport.id) {
					w.gracz = raport.def.gracz.id || w.gracz;
					w.budynki = raport.budynki || w.budynki;
					w.surowce = raport.surowce || w.surowce;
					w.ostatni_atak = raport.data;
					w.raporty.def.lat = raport.id;
				}
				
				w = wioski[raport.att.wioska.koord];
				if (!w) {
					wioski[raport.att.wioska.koord]=w={id: raport.att.wioska.id, koord: raport.att.wioska.koord};
				}
				if (!w.raporty) {
					w.raporty = {att:{}, def:{}};
				}
				w.raporty.att[raport.data] = raport.id;
				if (w.raporty.att.lat < raport.id) {
					w.gracz = raport.att.gracz.id || w.gracz;
					w.raporty.att.lat = raport.id;
				}
				TWManager.cache.set('wioski', wioski);
			}
			if (typeof callback === 'function') {
				callback(raport);		
			}
		},
		naTekst: function(r) {
			if (r.content) {
				// /game.php?village=27201&amp;mode=all&amp;view=8028335&amp;screen=report
				return r.content.replace('%PREV%', r.poprzedni ? ('<a id="report-prev" href="/game.php?village=' + TWManager.url.village + '&amp;mode=all&amp;view=' + r.poprzedni + '&amp;screen=report">&gt;&gt;</a>') : '').replace('%NEXT%', r.nastepny ? ('<a id="report-next" href="/game.php?village=' + TWManager.url.village + '&amp;mode=all&amp;view=' + r.nastepny + '&amp;screen=report">&lt;&lt;</a>') : '');
			}
			var att = '', def = '', spy = '', date = TWManager.tools.timeToReportText(r.data);
			for (var i in r.att.wojska.ilosc) {
				att += '<td style="text-align:center" class="unit-item' + (r.att.wojska.ilosc[i] === 0 ? ' hidden">0</td>' : ('">' + r.att.wojska.ilosc[i] + '</td>'));
			}
			att += '</tr><tr><td align="left" width="20%">Straty:</td>';
			for (i in r.att.wojska.straty) {
				att += '<td style="text-align:center" class="unit-item' + (r.att.wojska.straty[i] === 0 ? ' hidden">0</td>' : ('">' + r.att.wojska.straty[i] + '</td>'));
			}

			if ($.isEmptyObject(r.def.wojska.ilosc)) {
				def += '<td colspan="2"><p>Żaden żołnierz nie wrócił żywy. Nie można ustalić żadnych informacji o wielkości wojsk przeciwnika.</p></td>';
			} else {
				def += '<td colspan="2" style="padding:0px"><table id="attack_info_def_units" class="vis" style="border-collapse:collapse"><tr class="center"><td></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spear.png" title="Pikinier"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_sword.png" title="Miecznik"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_axe.png" title="Topornik"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_archer.png" title="Łucznik"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spy.png" title="Zwiadowca"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_light.png" title="Lekki kawalerzysta"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_marcher.png" title="Łucznik na koniu"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png" title="Taran"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_catapult.png" title="Katapulta"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_knight.png" title="Rycerz"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_snob.png" title="Szlachcic"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_militia.png" title="Chłop"/></td></tr><tr><td width="20%">Ilość:</td>';
				for (i in r.def.wojska.ilosc) {
					def += '<td style="text-align:center" class="unit-item' + (r.def.wojska.ilosc[i] === 0 ? ' hidden">0</td>' : ('">' + r.def.wojska.ilosc[i] + '</td>'));
				}
				def += '</tr><tr><td align="left" width="20%">Straty:</td>';
				for (i in r.def.wojska.straty) {
					def += '<td style="text-align:center" class="unit-item' + (r.def.wojska.straty[i] === 0 ? ' hidden">0</td>' : ('">' + r.def.wojska.straty[i] + '</td>'));	
				}
				def += '</tr></table></td>';
			}
				
			if (r.budynki && r.surowce) {	
				spy = '<h4>Szpiegostwo</h4><table id="attack_spy" style="border: 1px solid #DED3B9"><tr><th>Wyszpiegowane surowce:</th><td><span class="icon header wood"></span>'+r.surowce.drewno+' <span class="icon header stone"></span>'+r.surowce.glina+' <span class="icon header iron"></span>'+r.surowce.zelazo+' </td></tr><tr><th>Budynki:</th><td>';
				for (i in r.budynki)
					if (r.budynki[i] > 0)
						spy += ((i==='huta') ? 'Huta żelaza' : i.capitalize()) +' <b>(Poziom '+r.budynki[i]+')</b><br/>';
				spy += '</td></tr></table><br/>';
			}

			var i = 2;
			return '<table class="vis" width="470"><tr><td>Wysłane</td><td>'+date+'</td>'+(r.nastepny ? (i++ && ('<td align="center" width="20%"><a id="report-next" href="/game.php?village='+TWManager.url.village+'&amp;mode=attack&amp;view='+r.nastepny+'&amp;screen=report">&lt;&lt;</a></td>')) : '') + (r.poprzedni ? (i++ && ('<td align="center" width="20%"><a id="report-prev" href="/game.php?village='+TWManager.url.village+'&amp;mode=attack&amp;view='+r.poprzedni+'&amp;screen=report">&gt;&gt;</a></td>')) : '') + '</tr><tr><td colspan="' + i + '" valign="top" height="160" style="border:solid 1px black;padding:4px"><h3>'+r.h3+'</h3><h4>Szczęście atakującego</h4><table id="attack_luck"><tr><td class="nobg"><img src="https://dspl.innogamescdn.com/graphic/rabe'+(r.szczescie>0?'_grau':'')+'.png" alt="Pech" class=""/></td><td class="nobg"><table class="luck" cellspacing="0" cellpadding="0"><tr><td class="luck-item nobg" height="12" width="' + (50 - (Math.max(-r.szczescie, 0) * 2)) + '"></td>' + (r.szczescie < 0 ? ('<td class="luck-item nobg" style="background-image:url(https://dspl.innogamescdn.com/graphic/balken_pech.png)" width="'+(Math.max(-r.szczescie, 0) * 2)+'"></td>') : '') + '<td class="luck-item nobg" style="background-color: black" width="1"></td>'+ (r.szczescie > 0 ? ('<td class="luck-item nobg" style="background-image:url(https://dspl.innogamescdn.com/graphic/balken_glueck.png);" width="'+(Math.max(r.szczescie, 0) * 2)+'"></td>') : '') + '<td class="luck-item nobg" width="' + (50 - (Math.max(r.szczescie, 0) * 2)) + '"></td></tr></table></td><td class="nobg"><img src="https://dspl.innogamescdn.com/graphic/klee'+(r.szczescie<0?'_grau':'')+'.png" alt="Szczęście" class=""/></td><td class="nobg"><b>' + r.szczescie + '%</b></td></tr></table><h4>Morale: '+ r.morale +'%</h4><table id="attack_info_att" width="100%" style="border: 1px solid #DED3B9"><tr><th style="width:20%">Agresor:</th><th>'+(r.att.gracz.id ? ('<a href="/game.php?village='+TWManager.url.village+'&amp;id='+r.att.gracz.id+'&amp;screen=info_player" title="'+r.att.gracz.plemie+'">'+r.att.gracz.nick+'</a>') : '---')+'</th></tr><tr><td>Pochodzenie:</td><td><span class="village_anchor" data-player="'+r.att.gracz.id+'" data-id="'+r.att.wioska.id+'"><a href="/game.php?village='+TWManager.url.village+'&amp;id='+r.att.wioska.id+'&amp;screen=info_village">'+r.att.wioska.text+'</a></span></td></tr><tr><td colspan="2" style="padding:0px"><table id="attack_info_att_units" class="vis" style="border-collapse:collapse"><tr class="center"><td></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spear.png" title="Pikinier"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_sword.png" title="Miecznik"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_axe.png" title="Topornik"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_archer.png" title="Łucznik"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spy.png" title="Zwiadowca"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_light.png" title="Lekki kawalerzysta"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_marcher.png" title="Łucznik na koniu"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png" title="Taran"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_catapult.png" title="Katapulta"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_knight.png" title="Rycerz"/></td><td width="35"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_snob.png" title="Szlachcic"/></td></tr><tr><td width="20%">Ilość:</td>'+att+'</tr></table></td></tr></table><br/><table id="attack_info_def" width="100%" style="border: 1px solid #DED3B9"><tr><th style="width:20%">Obrońca:</th><th>'+(r.def.gracz.id ? ('<a href="/game.php?villa
		},
		zaladujRaport: function(id, raport, shift){
			if (!raport) {
				raport = TWManager.cache.get('raport_' + id, false);
			}
			if (!raport){
				var raporty = TWManager.cache.get('raporty', {});
				if (raporty[id]) {
					delete raporty[id];
					TWManager.cache.set('raporty', raporty);
					error("Raport wystepuje w raportach mimo ze nie ma danych o nim (" + id + ')');
				}
				unsafeWindow.TribalWars.showLoadingIndicator();
				TWManager.raporty.pobierzRaport(id, function(rap) { TWManager.raporty.zaladujRaport(rap.id, rap); } );
				return;
			}
			if (shift) 
				shift = '_'+id;
			else
				shift = '';
			
			try {
				TWManager.funkcje.showDraggableWindow('pokaz_raport'+shift, '<span style="font-size:10pt;display:inline-block;max-width:459px;margin:0 10px 2px 0;word-wrap:break-word;">'+(raport.ikona ? '<img src="https://dspl.innogamescdn.com/graphic/dots/'+raport.ikona+'.png" title="Pełna wygrana" alt="" class="tooltip"/>  ' : '')+raport.text+'</span>', TWManager.raporty.naTekst(raport));
			}catch(e){console.log(e);}
			$('#report-next, #report-prev').click(function(e) {e.preventDefault(); var t = this.href.match(/view=([0-9]+)/)[1]; TWManager.raporty.zaladujRaport(t); return false;});
			unsafeWindow.UI.ToolTip('.tooltip');
		}
	},
	info_village: {
		init: function() {
			var me = this;
			if (TWManager.premium) {
				Fwk.each('.quickedit', function(){$(this).addClass('report');});
			} else {
				Fwk.beforeLoad(function(){
					var podzial = $('#content_value > table > tbody > tr > td');
					var coord = podzial.eq(0).find('tr td:nth-child(2):contains(|)').text();
					var html = me.htmlRaportowDlaWioski(coord);
					if (html.length)
						podzial.eq(1).append(html);
				});
			}
		},
		htmlRaportowDlaWioski: function(coord) {
			var wioski = TWManager.cache.get('wioski', {});
			var wioska = wioski[coord];
			if (!wioska) return '';
			var sorted = [];
			for (var i in wioska.raporty.def) {
				if (i.match(/^[0-9]+$/)) {
					sorted.push(wioska.raporty.def[i]);
				}
			}
			sorted.sort(integerSort);
			var str = '';
			for (var i = 0; i < sorted.length; i++) {
				var r = TWManager.cache.get('raport_' + sorted[i], 'NO');
				if (r !== 'NO') {
					str = '<tr><td><div class="nowrap float_right" style="margin-top: 2px"></div><img src="https://dspl.innogamescdn.com/graphic/dots/'+r.ikona+'.png"> <span class="report" data-id="'+r.id+'"><a href="/game.php?village='+TWManager.wioska+'&mode=all&view='+r.id+'&screen=report">'+r.text+'</a></span></span></td><td>'+TWManager.tools.timeToReportText(r.data)+'</td></tr>' + str;
				} else {
					error('report ' + sorted[i] + ' not found');
				}
			}
			if (!str.length) {
				return '';
			}
			return '<table width="100%" class="vis" style="margin-top: 10px; clear:both"><tbody><tr><th>Temat</th><th width="140">Otrzymane</th></tr>'+str+'</tbody></table>';
			

		}
	},
	mail: {
		init: function() {
			if (TWManager.url.mode == 'export') {
				Fwk.each('textarea', function() {
					$('<button class="btn">Usuń BBCode</button><br/>')/*.filter(':first').html('Usuń BBCode').addClass('btn').end()*/
					.insertBefore(this).click(TWManager.mail.textareaClick);
				});
			}

		},
		textareaClick: function() {
			var textarea = $('textarea');
			textarea.val(textarea.val().replace(/\[[^\]]+\]/g, ''));
		}
	},
	am_farm: {
		init: function() {
			Fwk.each('#plunder_list a[href*=report]', function(){$(this).addClass('report');});
			Fwk.load(this.initPozniej.bind(this));
		},
		partialReload: function() {
			var possible = false;
			$('<td><a href="#"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png"/></a></td>').appendTo('.row_a, .row_b').children().addClass("TWMur").click(this.wyslij).each(function(i, e) {
				if (parseInt($(e).parent().parent().children().eq(6).text(), 10) < 1) {
					$(e).addClass('farm_icon_disabled');
				} else {
					possible = true;
				}
			});
			
			$('<th><a href="#" title="Zburz mur" class="tooltip" class="_TWMur"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png"/></a></th>').click(this.wyslijWszystkie).appendTo('#plunder_list tr:first').filter(possible?"":":not()").addClass('farm_icon_disabled');//.css('opacity', possible ? 1 : 0.5);
		},
		initPozniej: function() {
			this.partialReload();
			var ustawienia = TWManager.cache.get('ustawienia_AF', {autosend: false, przycisk:'C', refresh:false, refreshinterval:'5'});
			console.log(ustawienia);
			if (ustawienia.autosend) {
				var tout;
				// $('td img[src*=attack]').parent().parent().find('.farm_icon').addClass('farm_icon_disabled');
				function my_click() {
					var btn = $('.farm_icon_'+ustawienia.przycisk.toLowerCase()+':not(.farm_icon_disabled,.clicked,.decoration):first');
					if (!btn.length) { return; }
					if (ustawienia.przycisk.toLowerCase() === 'c' || unsafeWindow.Accountmanager.farm.unitsAppearAvailableAB(unsafe(btn[0].onclick.toString().match(/(\d+)\)/)[1]))) {
						btn.addClass('clicked').click();
						tout = setTimeout(my_click, Math.random() * 500 + 250);
					}
				}
				tout = setTimeout(my_click, Math.random() * 8000 + 1000);
				
				
				var prevFunc = unsafeWindow.TribalWars.handleResponse;
				unsafeWindow.TribalWars.handleResponse = unsafe(function(d,s,e) {
					if (d.error) {
						clearTimeout(tout);
					}
					prevFunc.call(unsafeWindow.TribalWars,d,s,e);
				});
				
			}
			if (ustawienia.refresh) {
				var time = Math.max(Math.random() * 6 + parseInt(ustawienia.refreshinterval,10), 0.5)*60*1000;
				$('<div style="float:right;margin:-25px 5px 0 0"><span>'+TWManager.tools.timeToReportText(new Date().getTime() + time)+'</span> <img style="-webkit-animation: spin 1.4s infinite linear;-moz-animation: spin 1.4s infinite linear;-o-animation: spin 1.4s infinite linear;-ms-animation: spin 1.4s infinite linear;width:20px;"src="https://www.jasonkenison.com/uploads/blog/loading.png"></div>').appendTo('#plunder_list_nav');
				setTimeout(function() {
					clearTimeout(tout);
					if (!$('#attacked_checkbox')[0].checked) {
						document.location.href = '?village='+TWManager.wioska+'&screen=am_farm';
						return;
					}
					var td = $('.body').find('tr > td[align=center]'), strong = td.find('strong'), n = strong.next();
					if (n.length) {
						n[0].click();
					} else {
						n = td.find('a')[0];
						if (n) {
							document.location.href = n.href;
						} else {
							document.location.reload();
						}
					}
				}, time);
			}
			
		},
		wyslijWszystkie: function() {
			var t = $('.TWMur:not(.farm_icon_disabled):lt(1)');
			if (!t.length) {
				$("._TWMur").addClass('farm_icon_disabled');
				return false;
			}
			t.click();
			setTimeout(TWManager.am_farm.wyslijWszystkie, 500);
			unsafeWindow.UI.SuccessMessage('Wyslij wszystkie!');
		},
		wyslij: function() {
			var me = $(this),
				row = me.parent().parent(),
				mur = parseInt(row.children().eq(6).text(), 10);
				
			if (me.hasClass('farm_icon_disabled')) 
				return false;
				
			if (mur < 1) return unsafeWindow.UI.ErrorMessage('W tej wiosce nie ma muru!');
			var wojska;
			//['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob']
			if (mur === 1)
				wojska = [0,0,0,0,1,2,0,0,2];
			else if (mur === 2)
				wojska = [0,0,0,0,1,3,0,0,4];
			else if (mur === 3)
				wojska = [0,0,0,0,1,8,0,0,7];
			else if (mur === 4)
				wojska = [0,0,0,0,1,9,0,0,10];
			else if (mur === 5)
				wojska = [0,0,0,0,1,21,0,0,14];
			else if (mur === 6)
				wojska = [0,0,0,0,1,21,0,0,19];
			else if (mur === 7)
				wojska = [0,0,0,0,1,45,0,0,24];
			else if (mur === 8)
				wojska = [0,0,0,0,1,45,0,0,30];
			else
				return error("Za wysoki poziom muru! (" + mur + ")");
			
			var koordy = TWManager.tools.parseCoordsO(row.children().eq(3).text());
			if (!koordy)
				return error("Nie znaleziono koordów w tools.parseCoordsO dla " + row.children().eq(3).text() + "!");
			
			TWManager.funkcje.wyslijAtak(koordy, wojska);
			console.log('sent to', koordy);
			me.addClass('farm_icon_disabled');
			return false;
			//unsafeWindow.UI.SuccessMessage('Wyslij!');
		}
	},
	market: {
		init: function() {
			Fwk.load(this.initPozniej.bind(this));
		},
		initPozniej:function() {
			if (TWManager.url.mode === 'own_offer')
				$('.btn').eq(0).contextmenu(function() {
					var s = ['wood', 'stone', 'iron'],
						t = [],
						x, n;
					s.forEach(function (a) {
						t.push(parseInt($('#' + a).html(), 10));
					});
					$('.offer_container').each(function(a,b) {
						b=$(b).children();
						var typ = b.eq(2).html();
						if (typ.indexOf(s[0]) > 0) typ = 0;
						else if (typ.indexOf(s[1]) > 0) typ = 1;
						else typ = 2;
						t[typ]+=(~~b.eq(2).text().replace(/\./g, ''))*(~~b.eq(3).text());
					});
					var srednia = (t[0]+t[1]+t[2])/3;
					x = Math.max.apply(0, t);
					n = Math.min.apply(0, t);
					var maxk = Math.min(Math.round((x-srednia)/1000), Math.round((srednia-n)/1000), unsafeWindow.Market.Data.Trader.amount);
					$('[name=sell]:last,[name=buy]:last').val(1000);
					$('[name=multi]').val(maxk);
					$('#res_buy_' + s[t.indexOf(n)] + ',#res_sell_' + s[t.indexOf(x)]).click();
					return false;
				});
				$('#trends_main').remove();
			if (unsafeWindow.TargetField)	
				unsafeWindow.TargetField.loadTargetsPopup = this.showWindow;
		},
		showWindow: function (e, url) {
			e.preventDefault();
			unsafeWindow.TribalWars.get(url, {}, unsafe(TWManager.market.getWindowHandler));
		},
		getWindowHandler: function (msg) {
			TWManager.funkcje.showDraggableWindow('village_targets', 'Cele', '<div style="max-height: 400px; overflow-y: scroll">' + msg.replace('vis', 'vis modemenu').replace(/href="javascript:selectTarget/g, 'class="TWTargetVillage" href="javascript:selectTarget') + '</div>');
			$('.TWTargetVillage').contextmenu(TWManager.market.onContextMenu);
		},
		onContextMenu: function(e){
			e.preventDefault();
			try {
				var dane = unsafeWindow.Market.Data,
					cap = dane.Trader.capacity();
				if (!cap) return;
				
				var c=$(e.target).parent().parent().children(),
					stor = parseInt(c.eq(2).text().replace(/\./g, ''), 10)-2000,
					s = [], k=[0,0,0];// [drewno, glina, zelazo]
				for (var i = 0; i < 3; i++)
					s.push(parseInt(c.eq(1).children().filter('span.res').eq(i).text().replace(/\./g, ''), 10));
					
				var min = s.indexOf(Math.min.apply(0,s)), 	
					mid,
					max = s.indexOf(Math.max.apply(0,s)),
					tmp;
					
				if (min === max) max++;
				mid = 2*(min+max)%3;		
				tmp = Math.min(s[mid] - s[min], cap);
				k[min] = tmp;
				cap -= tmp;
				if (cap) {
					tmp = Math.min(s[max]-s[mid], Math.floor(cap/2));
					k[min] += tmp;
					k[mid] = tmp;
					cap -= 2*tmp;
					if (cap > 1) {
						tmp = Math.floor(Math.min(3*(stor-s[max]-2000),cap)/3);
						k[min] += tmp;
						k[mid] += tmp;
						k[max] += tmp;
					}
				}
				$('input[name=wood]').val(k[0]);
				$('input[name=stone]').val(k[1]);
				$('input[name=iron]').val(k[2]);
				c = c.eq(3).text().split('|');
				$('#inputx').val(c[0]);
				$('#inputy').val(c[1]);
				if (dane.Res.wood < s[0] || dane.Res.stone < s[1] || dane.Res.iron < s[2]) 
					return error('Za mało surowców!');
				$('.btn').click();
			} catch(e) {error(e);}
		}
	},
	event_assault: {
		init: function() {
			Fwk.load(TWManager.event_assault.load);
		},
		load: function() {
			TWManager.event_assault.klikanie();
		},
		klikanie: function() {
			var time = (Math.random()+1)*30*1000;
			if (unsafeWindow.EventAssault.getEnergy() >= 1) {
				unsafeWindow.UI.SuccessMessage('Auto-klikanie', 1000);
				var el = $('.event-action-button:visible');
				el = el[Math.floor(Math.random()*el.length)];
				if (el) {
					el.click();
					time = Math.random()*10*1000;
				}
			} else {
				unsafeWindow.UI.ErrorMessage('Za mało tych śmiesznych czempionów', 1000);
			}
			setTimeout(TWManager.event_assault.klikanie, time);
		}
	},
	overview_villages: {
		init: function() {
			Fwk.load(this.initPozniej.bind(this));
		},
		initPozniej: function() {
			if ($('#paged_view_content table:first tbody').length && !$('#paged_view_content table:first tbody tr td strong:contains(wszystkie)').length) return; // jesli nie [1] [2] >wszystkie<
			var list = [];
			$('.quickedit-vn').each(function(a, b) {
				list.push($(b).data('id'));
			});
			TWManager.cache.set('villagelist', list);
			
			var mode = $('#overview_menu td.selected').text().trim();
			if (mode === '') // bez KP
				mode = 'Free';
				
			if (typeof this['init'+mode] === 'function')
				$(document).ready(this['init'+mode]);
		},
		initBudynki: function() {
			var BO = unsafeWindow.BuildingOverview;
			var wsumiezbudowano = 0;
			function sprawdzPoziom(wioska, id) {
				var w = wioska.find('td.upgrade_building.b_'+id);
				if (w.length)
					return parseInt(w.html().replace(/<.*>(\d*?)<\/.*?>$/, '$1'), 10) + wioska.children().last().find('img[src*="'+id+'"]').length;
					
				return 0;
			}
			function coBudowac(w, dane) {
				var wood=sprawdzPoziom(w, 'wood'),
					stone=sprawdzPoziom(w, 'stone'),
					iron=sprawdzPoziom(w, 'iron'),
					main=sprawdzPoziom(w, 'main'),
					storage=sprawdzPoziom(w, 'storage'),
					wall=sprawdzPoziom(w, 'wall'),
					eko = [wood, stone, iron];
				eko = [['wood', 'stone', 'iron'][eko.indexOf(Math.min.apply(Math, eko))], Math.min.apply(Math, eko)];
				var myorder = 'iron|stone|wood|place|stone,2|wood,2|iron,2|stone,3|stone,4|wood,3|wood,4|wood,5|wood,6|main,2|main,3|barracks|storage,2|main,4|main,5|storage,3|smith|smith,2|farm,2|market|barracks,2|barracks,3|smith,3|main,6|barracks,4|storage,4|main,8|farm,4|smith,4|smith,5|barracks,5|storage,5|storage,6|market,2|market,3|main,9|main,10|stable|stable,2|stable,3|wall|storage,10|farm,10|statue|eko,13|main,13|eko,19|main,17|storage,17|main,20|storage,20|farm,20|eko,25|storage,25|eko,30|wall,20|smith,20|market,10|snob|storage,30|farm,30|barracks,10|stable,8|garage,3|barracks,15|stable,10|market,20|barracks,20|stable,17|garage,10|barracks,25|stable,20|hide,10'.split('|');
				for (var i = 0; i < myorder.length; i++) {
					var d = myorder[i].split(','), lvl;
					if (d.length<2) d[1] = 1;
					if (d[0] == 'eko') {
						if (eko[1] < parseInt(d[1], 10))
							return eko[0];
					} else if (sprawdzPoziom(w, d[0]) < parseInt(d[1], 10))
						return d[0];
				}
				/*
				if(dane.buildings.place) return 'place';
				
				if (najn[1]<15) return najn[0];
				if (main < 20 || storage < 20)
					return (main >= 20) || main-5>storage?'storage':'main';
				if (najn[1] < 30) return najn[0];
				if (wall<20) return 'wall';*/
				return '';
				
			}
			function buduj(wioska, dane, i) {
				if (wioska.children().last().children().children().length > 4) return i; // bez dodatkowych kosztów
				var id = coBudowac(wioska, dane);
				if (!id.length) return i;
				if (!dane.buildings[id]) {
					unsafeWindow.UI.ToolTip(wioska.find('.quickedit-label').attr('title', 'Próbowano budować ' + id)[0]);
					return i;
				}
				var village_id = wioska.attr('id').replace('v_', '');
				setTimeout(function(){$.ajax({
					dataType: 'json',
					type: 'get',
					url: $('#upgrade_building_link').val().replace(/village=([0-9]*)/, "village=" + village_id),
					data: {
						id: id,
						force: 1,
						source: unsafeWindow.game_data.village.id
					},
					success: function(ret) {
						ret = unsafe(ret);
						try {
							if (ret.error) {
								UI.ErrorMessage(ret.error, 2e3);
								console.error(ret.error, wioska, dane, id);
								unsafeWindow.UI.ToolTip(unsafeWindow.$(wioska.find('.quickedit-label').attr('title', 'Próbowano budować ' + id + ' ('+ret.error+')')[0].wrappedJSObject));
								unsafeWindow.UI.Notification.show('https://dspl.innogamescdn.com/graphic/big_buildings/'+id+'1.png', 'Rozbudowa ['+wsumiezbudowano+']', 'Próbowano budować ' + id + ' ['+sprawdzPoziom(wioska, id)+']');
							} else if (ret.success) {
								wsumiezbudowano++;
								unsafeWindow.UI.ToolTip(unsafeWindow.$(wioska.find('.quickedit-label').attr('title', 'Wybudowano ' + id)[0].wrappedJSObject));
								BO._upgrade_villages[village_id].confirm_queue = ret.confirm_queue;
								BO.generate_buildings_for_village(ret.next_buildings, 0);
								if ($("#building_order_" + village_id).length === 0) {
									var list = unsafe(unsafeWindow.$('<ul></ul>').addClass('order_queue').attr("id", "building_order_" + village_id));
									BO.create_sortable(list);
									unsafeWindow.$("td:last-child", "#v_" + village_id).append(list);
								}
								$("#building_order_" + village_id).html(ret.building_orders);
								console.log('['+wsumiezbudowano+'] Zbudowano ' + id);
								unsafeWindow.UI.Notification.show('https://dspl.innogamescdn.com/graphic/big_buildings/'+id+'1.png', 'Rozbudowa ['+wsumiezbudowano+']', 'Zbudowano ' + id + ' ['+sprawdzPoziom(wioska, id)+']');
								setTimeout(buduj, 500, wioska, ret.next_buildings, 0);
							}
						}catch(e){console.error(e);}
					}
				});}, i*2000);
				return i+1;
			}
			BO._display_all = true;
			BO._display_type = 0;
			var possible_all_buildings_url = $('#get_all_possible_building_upgrades_link').val(),
				vars = {
					destroy: 0,
					page_start: BO.page_start,
					page_size: BO.page_size,
					order: BO.order,
					dir: BO.dir
				};
			BO.update_paged_nav();
			$.getJSON(possible_all_buildings_url, vars, function(villages) {
				$('.queue_icon img').addClass('faded');
				console.log('GOT JSON', villages);
				var i = 0;
				try {
				$.each(villages, function(village_id, village) {
					if (!village.managed_by_am) BO.generate_buildings_for_village(unsafe(village), 0);
					i=buduj($('#v_'+village_id), village, i);
				});
				}catch(e){console.error(e);console.log(village_id); console.log( $('#v_'+village_id));}
				unsafeWindow.UI.SuccessMessage('Budowanie conajmniej ' + i + ' budynków.', 4000);
			});
		
		
		},
		initFree: function() {
			TWManager.funkcje.showDraggableWindow('freemiumpanel', 'Panel zarządzania', 
			'<div class="center"><div class="premium_account_hint"><a href="#" id="xzf_wybijanie">Wybij monety</a></div></div>', function() {
				return false;
			});
			var game_data = unsafeWindow.game_data;
			/*
			var ids = [];
			$('tr.nowrap .quickedit-vn').each(function(a,b){
				var id = b.dataset.id;
				ids.push(id);
				/ *
				var w = TWManager.wioski.laduj(id);
				if (w.res) {
					// TODO: zapisywanie punktow, surki, spichlerza i zagrody
				}
				TWManager.wioski.zapisz(w, true); // nie aktualizuj daty
				* /
			});
			TWManager.cache.set('village_list', ids);*/
			// przeglądy
			var ids = TWManager.cache.get('villagelist');
			var text = '<table class="vis modemenu" width="100%" id="overview_menu"><tr>';
			var tab = ['Kombinowany', 'Produkcja', 'Transporty', 'Wojska', 'Rozkazy', 'Przybywające', 'Budynki', 'Grupy'];
			for (var i in tab) 
				text += '<td style="text-align:center;min-width:80px"><a href="#">'+tab[i]+' </a></td>';
			text+='</tr></table><br/>';
			$(text).insertBefore('#paged_view_content');
			var typ = TWManager.cache.get(typ, 1); // domyslnie Kombinowany
			$('#overview_menu td:nth-child('+typ+')').addClass('selected');
			// grupy
			text = '<div class="vis_item" align="center">Grupy: <a  class="group_tooltip group-menu-item"  title="Dynamiczna grupa"  href="#">[Pełny atak]</a>  <a  class="group_tooltip group-menu-item"  title="Dynamiczna grupa"  href="#">[Nadchodzący atak]</a>  <a  class="group_tooltip group-menu-item"  title="Dynamiczna grupa"  href="#">[Ma szlachcica]</a>  <strong  class="group_tooltip group-menu-item"  title="Wioski w grupie:&lt;br/&gt;1" >&gt;wszystkie&lt; </strong> </div>';
			$(text).prependTo('#paged_view_content');
			
			
			
			/*
			function calculateCoins(d) {
				var max = Math.floor(Math.min(game_data.village.res[0] / res[0], game_data.village.res[2] / res[1], game_data.village.res[4] / res[2])), num;
				if (d.m) num = max - d.c;
				else num=Math.min(max, d.c);
				if((num < 1) || (++d.cv > num)) return goToNextVillage(d);
				var n = loadName();
				n.wybijanie=d;
				window.name=JSON.stringify(n);
				btn[0].click();
			}
			function mintForVillage(v) {
				if (parseInt(v, 10) != v) return error('Zły id wioski! ('+v+')');
				GM_xmlhttpRequest({
					method: "GET",
					url: '/game.php?village='+v+'&screen=overview',
					onload: function(x) {
						var moznaWybijac = x.responseText.indexOf('Wybij monetę') > 0,
							koszt = x.responseText.match(/coin_cost_wood.*\n.*\n.* /)[0].replace(/<span class="grey">\.<\/span>/g, '').match(/[0-9]+/g),
							surywwiosce = 
					},
				});
			}*/
			
			var kosztMonety = TWManager.cache.get('kosztMonety', 0), kosztMonetyStr = '<img class="" style="" alt="Loading..." id="koszt-throbber" src="https://dspl.innogamescdn.com/graphic/throbber.gif">';
			kosztMonety = [14000, 15000, 12500, new Date().getTime()];
			if (kosztMonety.length && kosztMonety.length == 4) {
				if (kosztMonety[3] < new Date().getTime() - 7*24*60*60*1000)
					kosztMonety = 0;
				else
					kosztMonetyStr = '<span class="nowrap" id="coin_cost_wood"><span class="icon header wood"> </span>'+(''+kosztMonety[0]).delim('<span class="grey">.</span>',3)+' </span> <span class="nowrap" id="coin_cost_stone"><span class="icon header stone"> </span>'+(''+kosztMonety[1]).delim('<span class="grey">.</span>',3)+' </span> <span class="nowrap" id="coin_cost_iron"><span class="icon header iron"> </span>'+(''+kosztMonety[2]).delim('<span class="grey">.</span>',3)+'</span>';	
			}
			$('#xzf_wybijanie').click(function() { // wybijanie monet
				if (kosztMonety === 0) {
					
					TWManager.request({
						method: "GET",
						url: '/game.php?village='+TWManager.wioska+'&screen=snob',
						onload: function(x) {
							var exception = false;
							try {
								kosztMonety = x.match(/coin_cost_wood.*\n.*\n.*/)[0].replace(/<span class="grey">\.<\/span>/g, '').match(/[0-9]+/g);
								kosztMonety[3] = new Date().getTime();
								TWManager.cache.set('kosztMonety', kosztMonety);
								kosztMonetyStr = '<span class="nowrap" id="coin_cost_wood"><span class="icon header wood"> </span>'+(''+kosztMonety[0]).delim('<span class="grey">.</span>',3)+'</span><span class="nowrap" id="coin_cost_stone"><span class="icon header stone"> </span>'+(''+kosztMonety[0]).delim('<span class="grey">.</span>',3)+'</span><span class="nowrap" id="coin_cost_iron"><span class="icon header iron"> </span>'+(''+kosztMonety[0]).delim('<span class="grey">.</span>',3)+'</span>';
								$('#kosztmonet').html(kosztMonetyStr);
								TWManager.wioski.zaladowanoStrone(x);
							}catch(e) {
								error('Błąd przy ładowaniu kosztu monet: ' + e + '!');
								console.log(e);
								unsafeWindow.exception = unsafe(e);
								exception = true;
							}
							if (exception) throw "exception";
						},
						onerror: function(x) {
							error('Błąd z połaczeniem, spróbuj ponownie!');
							console.error(x);
						}
					});
				}
				unsafeWindow.Dialog.show('Wybijanie', '<center><h2>Wybijanie monet</h2><br><input type="checkbox" id="WMmax" checked="checked"><t>Max-</t><input type="text" id="WMnum" maxlength="3"><br><br><span id="kosztmonet">'+kosztMonetyStr+'</span><br><br><button id="WMacc" class="btn">Akceptuj</button><br></center>');
				$('#WMmax').click(function(){this.nextSibling.style.display=(this.checked?'':'none');});
				var lista = $('tr.nowrap'), length = lista.length;
				$('#WMacc').click(function() {
					var max = $('#WMmax:checked').length,
						coins = ~~$('#WMnum').val(),
						csrf = unsafeWindow.game_data.csrf,
						curwin = unsafeWindow.window;
					function wybijMonete(v, c, tr) {
						if (c < 1) {
							tr = tr.next();
							if (tr.length) {
								ladujWioske(tr);
							} else {
								var title = 'KONIEC!', interval = 0;
								function migaj() {
									if (document.title == title)
										document.title = TWManager.tytul;
									else if (!TWManager.aktywny)
										document.title = title;
									else
										clearInterval(interval);
								}
								interval = setInterval(migaj, 250);
								var notif = new Notification("Wybijanie monet skończone!");
							}
							return;
						}
						if (v.id && csrf)
							TWManager.request({
								method: "GET",
								url: '/game.php?village='+v.id+'&action=coin&h='+csrf+'&screen=snob',
								onload: function(x) {
									var v = TWManager.wioski.zaladowanoStrone(x);
									tr.find('.wood').html((v.res[0]+'').delim('<span class="grey">.</span>', 3))
											 .next().html((v.res[2]+'').delim('<span class="grey">.</span>', 3))
											 .next().html((v.res[4]+'').delim('<span class="grey">.</span>', 3))
										.parent().children().removeClass('warn').removeClass('warn_90').addClass('res');
									setTimeout(wybijMonete, Math.random()*500+250, v, c-1, tr);
								},
								onerror: function(x) {
									error('Błąd z połączeniem przy wybijaniu monety!');
									console.error(x);
									setTimeout(wybijMonete, Math.random()*500+250, v, c, tr);
								}
							});
					}
					function ladujWioske(tr) {
						var id = tr.find('.quickedit-vn').data('id'), info = TWManager.wioski.laduj(id, 
							function(v, ladowalo) {
								var monetyMax = Math.floor(Math.min(v.res[0] / kosztMonety[0], v.res[2] / kosztMonety[1], v.res[4] / kosztMonety[2])), ileWybic;
								if (max) ileWybic = monetyMax - coins;
								else ileWybic=Math.min(monetyMax, coins);	
								tr.addClass('selected').prev().removeClass('selected');
								if (ladowalo)
									setTimeout(wybijMonete, Math.random()*500+250, v, ileWybic, tr);
								else
									wybijMonete(v, ileWybic, tr);
							}
						);
					}
					unsafeWindow.Dialog.close();
					$('tr.nowrap.selected').removeClass('selected');
					ladujWioske(lista.eq(0).addClass('selected'));
				});
			});
			unsafeWindow.eval('UI.ToolTip($(".group_tooltip"),{delay:10})');
									
		}
	},
	place: {
		init: function() {
			Fwk.load(this.initPozniej.bind(this));
		},
		initPozniej: function() {
			'use strict';
			if (TWManager.url['try'] === 'confirm') {
				var url = unsafeWindow.TribalWars.buildURL('GET', 'place', unsafe({target: $('td span.village_anchor').data('id')})),
					cards = [],
					random = 0;
				$('#troop_confirm_go').click(function(e) {
					console.log('OPENED CARDS CLICK! total cards: ', cards.length, cards);
					for (var i = 0; i < cards.length; i++) {
						if (!cards[i].closed)
							cards[i].postMessage({wyslijAtak:true}, '*');
					}
				
				});
				var span = $('<button class="btn">Dodaj atak (<span>0</span>)</button>').click(function(e) {
					try {
					e.preventDefault();
					var wnd = window.open(url, '{"swiat":'+TWManager.dane.swiat+',"login":"'+TWManager.dane.login+'","lastLocation":"'+url+'","random":'+(random++)+'}', 'scrollbars=1');
					if (wnd) {
						cards.push(wnd);
						wnd.focus();
						span.html(cards.length);
					}
					}catch(w){console.log(w);}
				}).appendTo('form').children();
				setInterval(function() {
					for (var i = 0; i < cards.length; i++) {
						if (!cards[i] || cards[i].closed) {
							cards.splice(i, 1);
							i--;
						}					
					}
					span.html(cards.length);
				}, 1000);
			
			}
		},
	},
	info_member: {
		init: function() {
			Fwk.load(this.initPozniej.bind(this));
		},
		initPozniej: function() {
			$('<button class="btn">Wyślij każdemu po 5 zwiadowców</button>').prependTo('#content_value>table>tbody>tr>td[align=right]').click(function() {
				var w = $('#content_value>table.vis>tbody>tr>td.lit-item>a');
				function iter (i) {
					w.eq(i).parent().css('background-color', 'yellow');
					$.get(unsafeWindow.TribalWars.buildURL('get', 'api', unsafe({ajax:'target_selection', input:w[i].innerHTML, limit:5, offset:0, request_id:i, type:'player_name'})),
						function(d) {
							try {
								var vill = JSON.parse(d).villages[0];
								TWManager.funkcje.wyslijAtak(vill, [0,0,0,0,5]);
							}catch(e){console.error(e);error(e);return true;}
					});
					if (i < w.length-1)
						setTimeout(iter, Math.random()*2000+4000, i+1);
						
					unsafeWindow.UI.Notification.show('', 'Wysłano atak hetmański [' + (i+1) + '/'+w.length+']', w[i].innerHTML);
				}
				iter(0);
			});
		}
	},
	css: function() {
		var ustawienia = this.cache.get('ustawienia_Forum', {});
		GM_addStyle('.popup_style {position: fixed !important;};');
		if (ustawienia.naglowki) {
			GM_addStyle('h2 {margin: auto; display: table;margin-bottom: 10px;}');
			GM_addStyle('.modemenu {margin:auto}');
			GM_addStyle('.modemenu tr {display: flex;}');
			Fwk.each('#forum_box',function(){$(this).children().first().css('display', 'table').css('margin', 'auto');});
		}
		if (ustawienia.tabele) {
			GM_addStyle('.vis tr > * {border-radius: 6px; min-width:inherit !important; margin-left:6px;}');
			GM_addStyle('.modemenu tr > * {padding: 10px !important;}');
			GM_addStyle('#forum_box > div > span {border-radius: 6px}');
			GM_addStyle('#forum_box > div > span > a {padding: 4px};');
		}
		
		if (ustawienia.kolory && (this.url.screen == 'forum')) {
			Fwk.each('.forum', function(){$(this).find('img').parent().parent().not('.selected').css('background-color', 'gold');});
			Fwk.each('.shared_forum', function(){$(this).find('img').parent().parent().not('.selected').css('background-color', 'lightskyblue');});
		}
		
		if (ustawienia.spoilery) {
			function spoilerClick() {
				$.each($('.spoiler'), function(k, v) {
					unsafeWindow.toggle_spoiler(v.children[0]);
				});
				return false;
			}
			Fwk.each('.spoiler input', function(){$(this).contextmenu(spoilerClick);});
		}
		
		if (this.url.screen == 'map'){
			Fwk.load(function(){$("<style type=\"text/css\">.cmp {height:24px; width:24px; display:block; background-image:url(http://poke-evo.com/lol/TWBot/context_icons.png); position:absolute; left:0px; top:0px; z-index:15; opacity:0;}\n#cmp_notes {background-position: 0px 0px;}\n#cmp_notes: hover {background-position: 0px -24px;}\n#cmp_settings {background-position: -24px 0px;}\n#cmp_settings: hover {background-position: -24px -24px;}</style>").appendTo(document.head);});
		}

		//http://poke-evo.com/lol/TWBot/context_icons.png
		if (!this.premium) {
			Fwk.each('td.firstcell.box-item.icon-box.nowrap', function(){
				TWManager.dodajStrzalki();
				document.unbindArrive(arguments.callee);
			});
		}
	},
	dodajStrzalki: function() {
		var list = TWManager.cache.get('villagelist', []),
			index = list.indexOf(TWManager.wioska);
		if (!list.length || index < 0)
			$('<td class="box-item icon-box separate arrowCell"><a accesskey="a" href="' + document.location.href.replace(/village=[^&#]+/, 'village=p' + TWManager.wioska) + '" class="village_switch_link" id="village_switch_left"><span class="arrowLeft"> </span></a></td><td class="box-item icon-box arrowCell"><a accesskey="d" href="' + document.location.href.replace(/village=[^&#]+/, 'village=n' + TWManager.wioska) + '" class="village_switch_link" id="village_switch_right"><span class="arrowRight"> </span></a></td>').insertBefore('td.firstcell.box-item.icon-box.nowrap');
		else {
			$('<td class="box-item icon-box separate arrowCell"><a accesskey="a" href="' + document.location.href.replace(/village=[^&#]+/, 'village=' + list[(list.length+index-1)%list.length]) + '" class="village_switch_link" id="village_switch_left"><span class="arrowLeft"> </span></a></td><td class="box-item icon-box arrowCell"><a accesskey="d" href="' + document.location.href.replace(/village=[^&#]+/, 'village=' + list[(list.length+index+1)%list.length]) + '" class="village_switch_link" id="village_switch_right"><span class="arrowRight"> </span></a></td>').insertBefore('td.firstcell.box-item.icon-box.nowrap');			
		}
	},
	captcha: {
		init: function() {
			return;//todo:fix
			$.extend(this, TWManager.cache.get('CBH-passy', {}, true));

			if (!this.user || !this.user.length || !this.pass || !this.pass.length)
				return;

			if (!Fwk.isBotCheckActive()){
				if (TWManager.dane.ochrona)
					delete TWManager.dane.ochrona;

				return true;
			}
			
			setTimeout(this.resolve.bind(this), 15000);
		},
		resolve: function(cb, imgurl, conf) {
			return; //todo: fix;
			var self = this;
			if (TWManager.dane.ochrona) {
				this.report(TWManager.dane.ochrona.id, function() {TWManager.gg.wyslij('11930927', 'Captcha zgłoszona: ' + cID + '(' + TWManager.dane.ochrona.kod + ')');});
				delete TWManager.dane.ochrona;
			}
			self.getPoints(function(points) {
				console.log('getPoints', points);
				if (points < 10) {
					TWManager.gg.wyslij('11930927', 'Za mało punktów na captcha (' + points + ')');
					return;
				}
				if (TWManager.captchaWToku) 
					return;
				TWManager.captchaWToku = true;
				self.getCaptchaBlob(url ? url : $('#bot_check_image').attr('src'), function(blob) {
					console.log('getBlob', blob);
					self.sendBlob(blob, function(txt) {
						// OK-Ohw3EozL3Wi_2105201422
						console.log('sendCaptcha', txt);
						if (txt.substr(0, 3) !== 'OK-') {
							TWManager.gg.wyslij('11930927', 'Zła odpowiedź captchy: ' + txt);
							return;
						}
						var cID = txt.substr(3), tms = 0;
						function Ccheck(text) {
							console.log('Ccheck', text);
							//OK-answered-2yggar'OK-answered-2yggar'
							if (text.substr(0, 12) === 'OK-answered-') {
								var code = text.substr(12);
								if (code === 'user_timeout') {
									TWManager.gg.wyslij('11930927', 'Czas na wpisanie kodu minął.');
									if (conf)
										setTimeout(function() {GM_xmlhttpRequest(conf);}, 1000);
									else
										document.location.reload();
									return;
								}
								var rcode = code.replace(/[^a-zA-Z0-9]/g, '');
								if (code !== rcode) 
									code = ' wpisano: ' + code;
								else
									code = '';
									
								TWManager.gg.wyslij('11930927', 'Kod ochrony botowej: ' + rcode + code);
								TWManager.dane.ochrona = {id: cID, kod: code};
								
								if (conf) {
									TWManager.request({
										method: "POST",
										url: '/game.php?village='+TWManager.wioska+'&screen=overview',
										data: $.param({code: code}),
										onload: function(x) {
											GM_xmlhttpRequest(conf);
											cb();
											for (var i = 0; i < TWManager.kolejkaCaptchy.length; i++) {
												GM_xmlhttpRequest(TWManager.kolejkaCaptchy[i]);
											}
											TWManager.kolejkaCaptchy = [];
										},
									});
								} else {
								
									$('input[type=text][name=code]').val(rcode).next().click();
								}
								if (cb) {
									cb();
									
								} else if (TWManager.dane.task)
									setTimeout(TWManager.zadania[TWManager.dane.task.typ], 10000);
									// TODO: dodac ustawianie TWManager.captchaWToku = false; oraz innych smieci zwiazanych z AJAX CAPTCHA
								
								return;
							}
							if (tms++ < 15)
								setTimeout(self.getResponse.bind(self, cID, Ccheck), 5000);
							else
								TWManager.gg.wyslij('11930927', 'Nie ma odpowiedzi na captchę w wyznaczonym czasie. (' + cID + ')');
						}
						setTimeout(self.getResponse.bind(self, cID, Ccheck), 5000);
					});
				});
			});
		},
		getCaptchaBlob: function(url, callback) {
			console.log('getCaptchaBlob');
			var oReq = new XMLHttpRequest();
			oReq.open("GET", url, true);
			oReq.responseType = "arraybuffer";

			oReq.onload = function() {
				var blob = new Blob([oReq.response], {type: "image/png"});
				var fr = new FileReader();
				fr.onloadend = function(e) {
					var b = $('#bot_check_image')[0];
					console.log(e, e.target, b);
					if (b && e.target.result) b.src = e.target.result;
					fr = null;
				};
				fr.readAsDataURL(blob);
				callback(blob);
			};
			oReq.send();
		},
		getPoints: function(callback) {
			var me = this;
			GM_xmlhttpRequest({
				method: "GET",
				url: 'http://www.captchabrotherhood.com/askCredits.aspx?' + $.param({username: this.user, password: this.pass}),
				onload: function(x) {
					me._points = parseInt(x.responseText.substr(3), 10);
					console.log("getCredits", me._points);
					callback(me._points);
				},
			});
		},
		sendBlob: function(blob, callback) {
			var turl = 'http://www.captchabrotherhood.com/sendNewCaptcha.aspx?' + $.param({
					username: this.user,
					password: this.pass,
					captchaSource: 'pyLoad',
					timeout: 300
				});
			GM_xmlhttpRequest({
				method: "POST",
				url: turl,
				headers: {"Content-Type": "text/html"},
				data: blob,
				onload: function(x) {console.log("sendBlob", x.responseText);callback(x.responseText);}
			});
		
		},
		getResponse: function(id, callback) {
			GM_xmlhttpRequest({
				method: "GET",
				url: 'http://www.captchabrotherhood.com/askCaptchaResult.aspx?' + $.param({
					username: this.user,
					password: this.pass,
					captchaID: id
				}),
				onload: function(x) {console.log("getResponse", x.responseText); callback(x.responseText);}
			});
		},
		report: function(id, callback) {
			GM_xmlhttpRequest({
				method: "GET",
				url: 'http://www.captchabrotherhood.com/complainCaptcha.aspx?' + $.param({
					username: this.user,
					password: this.pass,
					captchaID: id
				}),
				onload: function(x) {console.log("invalid", x.responseText);callback(x.responseText);}
			});
		}
	},
	zadania: {
		buduj: function(d) {
			// /game.php?village=72058&screen=main
			if (TWManager.url.screen != 'main') {
				document.location.href = '/game.php?village=' + TWManager.wioska + '&screen=main';
			}
		}	
	},
	event: {
		init: function() {
			if (!Fwk.work()) return;
			var s = TWManager.cache.get('events_queue', []);
			for (var i in s) 
				TWManager.chmura.wyslij({event: s[i]});
		},
		dodaj: function(d) { if (Fwk.work()) TWManager.chmura.wyslij({event: d}); else this.dodaj_(d); },
		dodaj_: function(d) {
			var s = TWManager.cache.get('events_queue', []);
			s.push(d);
			TWManager.cache.set('events_queue', s);
		},
	},
	farmer: {
		init: function() {
			TWManager.funkcje.addQuest('OpenFarmer', 'Farmer', 'https://dspl.innogamescdn.com/graphic/unit/unit_militia.png', false, $.proxy(this.pokaz,this));
			this._wlaczony = false;
			this._szablon = TWManager.cache.get('farmer_szablon', -1);
			this._wioska = 0;
		},
		usunSzablon:function() {
			var templates = TWManager.cache.get('farmer'), tr = $(this).closest('tr'), id=tr.index()-1;
			templates.splice(id, 1);
			TWManager.cache.set('farmer', templates);
			tr.remove();
		},
		tekstNaTabliceWiosek: function(t) {
			return t.match(/\b(\d\d\d\|\d\d\d)\b/g); // w przeciwnym wypadku bierz wszystkie kordy
		},
		edytujWioski: function() {
			var t = $(this), vill = t.data('v'), tr = t.closest('tr'), id = tr.index()-1, template = TWManager.cache.get('farmer')[id], r = tr.data('r'), wnd;
			TWManager.funkcje.showDraggableWindow('wyborWioski_'+r, 'Wioski dla szablonu ' + template.name, '<textarea style="width: 700px">'+vill.join(' ')+'</textarea>', 
			function() {
				t.data('v', TWManager.farmer.tekstNaTabliceWiosek(wnd.find('div textarea').val()) || []);
				TWManager.farmer.zapisz();
			});
			wnd = $('#window_wyborWioski_'+r).addClass('wyborWioski');
		},
		wiersz: function(tid, tpl) {
			return '<tr class="farmer_'+tid+' farmer_szablon" data-r="'+(''+Math.random()).replace('.', '')+'"data-lastv="'+(tpl.lastv||0)+'"><td align="center"><input class="farmer_name" type="text" maxlength="100" size="6" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td align="center"><input type="text" class="farmer_unit" size="3" value=""></td><td><a class="farmer_vill" href="#"><span class="icon header village"></span></a></td><td><a class="farmer_remove" href="#"><img src="https://dspl.innogamescdn.com/graphic/delete.png"></a></td><td style="background-color:transparent;"><div style="width: 11px; height:11px; background-image: url(https://dspl.innogamescdn.com/graphic/sorthandle.png); cursor:pointer" class="farmerhandle"> </div></td></tr>';
		},
		pokaz: function() {
			if ($('#window_TWBot_farmer').length) {
				TWManager.farmer.zamknij();
				return;
			}
			var templates = TWManager.cache.get('farmer', []);
			var text = '<table class="vis" width="100%"><tbody id="farmer_sortable"><tr class="farmer_-1"><th width="75" style="text-align:center">Szablon</th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spear.png" title="Pikinier"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_sword.png" title="Miecznik"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_axe.png" title="Topornik"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_archer.png" title="Łucznik"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spy.png" title="Zwiadowca"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_light.png" title="Lekki kawalerzysta"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_marcher.png" title="Łucznik na koniu"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png" title="Taran"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_catapult.png" title="Katapulta"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_knight.png" title="Rycerz"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_snob.png" title="Szlachcic"></th><th colspan="3" width="62"></th></tr>';
			for (var tid in templates) {
				text+=this.wiersz(tid, templates[tid]);
			}
			text+='<tr><th colspan="16" style="text-align: right"><button class="btn farmer_trigger">Włącz</button> <button class="btn farmer_add">Dodaj</button> <button class="edit farmer_save">Zapisz</button> </th></tr></tbody></table>';
			TWManager.funkcje.showDraggableWindow('TWBot_farmer', 'Farmer', '<div id="TWBot_farmer_holder" style="padding:2px; max-width: 800px">'+text+'</div>', this.zamknij.bind(this));

			$('tr.farmer_szablon').each(function(i){
				$(this).find('.farmer_unit').each(function(q){
					$(this).val(templates[i].units[q]);
				}).end()
				.find('.farmer_name').val(templates[i].name).end()
				.find('.farmer_vill').data('v', templates[i].vill);
			});

			$('.farmer_remove').click(this.usunSzablon);
			$('.farmer_vill').click(this.edytujWioski);
			$('.farmer_add').click(this.dodajSzablon.bind(this));
			$('.farmer_save').click(this.zapisz.bind(this));
			$('.farmer_trigger').click(this.wlacz);

			unsafeWindow.$.fn.sortable.call($('#farmer_sortable'), {
				axis: 'y',
				handle: '.farmerhandle',
				helper: function(e, tr) {
					var $originals = tr.children(),
						$helper = tr.clone();
					$helper.children().each(function(index) {
						$(this).width($originals.eq(index).width());
					});
					return $helper;
				},
				stop: function() {
					TWManager.farmer.zapisz();
				}
			});
			unsafeWindow.$.fn.sortable.call($('#farmer_sortable'), 'option', 'items', '.farmer_szablon');
		},
		zapisz:function() {
			var templates = [];
			$('tr.farmer_szablon').each(function(){
				var t = $(this).children(), tpl = {name:t.find('.farmer_name').val(), lastv:$(this).data('lastv'), units:[], vill:t.find('.farmer_vill').data('v')};
				t.find('.farmer_unit').each(function(){
					tpl.units.push($(this).val());
				});
				templates.push(tpl);
			});
			TWManager.cache.set('farmer', templates);
		},
		zamknij: function() {
			TWManager.farmer.zapisz();
			$('.wyborWioski').remove();
			$('#window_TWBot_farmer').remove();
		},
		dodajSzablon: function() {
			var templates = TWManager.cache.get('farmer', []), 
				tid = templates.length,
				tpl = {name:'Szablon ' + (tid+1), units:[0,0,0,0,0,0,0,0,0,0,0,0], vill:[]},
				text = $(this.wiersz(tid, tpl));

			templates.push(tpl);
			text.find('.farmer_unit').each(function(){
				$(this).val(0);
			}).end()
			.find('.farmer_name').val(tpl.name).end();

			text.find('.farmer_remove').click(this.usunSzablon).end().find('.farmer_vill').click(this.edytujWioski).data('v', []);
			text.insertBefore('#farmer_sortable tr:last');
			TWManager.cache.set('farmer', templates);
		},
		wlacz:function() {
			// wlaczenie farmera
			var me = TWManager.farmer;
			if (me._wlaczony) {
				return me.wylacz(this);
			} 
			this.innerHTML = 'Wyłącz';
			me.zapisz();

			$('#OpenFarmer .fill').show();

			if (me._timeout) {
				clearTimeout(me._timeout);
			}

			me._timeout = setTimeout(me.wyslijDoWioski.bind(me, true), 1000);
			me._wlaczony = true;
		},
		wylacz: function(btn) {
			this._wlaczony = false;
			if (this._timeout) {
				clearTimeout(this._timeout);
				this._timeout = 0;
			}
			btn.innerHTML = 'Włącz';
			$('#OpenFarmer .fill').hide();
		},
		nastepnySzablon: function(t, i) {
			if (i > 1000) { throw 'Stack overflow.'; }
			this._szablon++;
			if (this._szablon >= t.length) {
				this._szablon = 0;
			}

			if (!t[this._szablon].vill.length) {
				return this.nastepnySzablon(t, i+1);
			}

			TWManager.cache.set('farmer_szablon', this._szablon);
			this._wioska = (t[this._szablon].lastv || 0);
		},
		nastepnaWioska: function(t, i) {
			if (i > 1000) { throw 'Stack overflow.'; }
			$('.farmer_'+this._szablon).data('lastv', this._wioska);
			this._wioska++;
			if (this._wioska >= t[this._szablon].vill.length) {
				this.nastepnySzablon(t, i+1);
			}
		},
		wyslijDoWioski: function(czy_nast_szablon, czy_nast_wioska) {
			var me = this;
			this._timeout = 0;

			var t = TWManager.cache.get('farmer', []);
			if (!t.length) {
				return;
			}

			if (t.length <= this._szablon) {
				this._szablon = 0;
			}

			if (czy_nast_wioska) {
				me.nastepnaWioska(t, 1);
			}
			if (czy_nast_szablon || this._wioska >= t[this._szablon].vill.length) {
				this.nastepnySzablon(t, 1);
			}

			var coord = t[this._szablon].vill[this._wioska].split('|');
			coord = {x:coord[0], y:coord[1]};
			TWManager.cache.set('farmer', t);

			TWManager.funkcje.wyslijAtak(coord, t[this._szablon].units, function() {
				me._timeout = setTimeout(me.wyslijDoWioski.bind(me, false, true), 250);//Math.random()*1500 + 1500);
			}, function() {
				me.nastepnySzablon(t,1);
				me._timeout = setTimeout(me.wyslijDoWioski.bind(me, true), Math.random()*15*1000 + 60*1000); // losowo 4-5min
			});
		},
	},
	nodeBot: {
		init: function() {
			var settings = TWManager.cache.get('ustawienia_NodeBot', {});
			if (!!settings.on) {
				TWManager.funkcje.addQuest('NB_rozkazy', 'Rozkazy', 'https://dspl.innogamescdn.com/graphic/buildings/place.png', false, TWManager.nodeBot.pokazRozkazy);
			}
		},
		pokazRozkazy: function() {
			var self = TWManager.nodeBot;
			TWManager.tools.nodeRequest({type:'commandList'}, function(templates) {
				var text = '<table class="vis" width="100%"><tbody id="NB_cmd"><tr><th width="200" style="text-align:center">Wioska</th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spear.png" title="Pikinier"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_sword.png" title="Miecznik"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_axe.png" title="Topornik"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_archer.png" title="Łucznik"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spy.png" title="Zwiadowca"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_light.png" title="Lekki kawalerzysta"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_marcher.png" title="Łucznik na koniu"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_heavy.png" title="Ciężki kawalerzysta"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png" title="Taran"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_catapult.png" title="Katapulta"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_knight.png" title="Rycerz"></th><th style="text-align:center" width="41"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_snob.png" title="Szlachcic"></th><th width="110">Cel</th><th width="110">Na miejscu</th><th colspan="3" width="62"></th></tr>';
				for (var i = 0; i < templates.length; i++) {
					text+=self.wiersz(templates[i]);
				}
				text+='<tr><th colspan="18" style="text-align: right"><button class="btn NB_cmd_add">Dodaj</button> <button class="btn NB_cmd_refresh">Odśwież</button> </th></tr></tbody></table>';
				TWManager.funkcje.showDraggableWindow('NB_cmd', 'Rozkazy', '<div style="padding:2px; max-width: 800px">'+text+'</div>');

				$('.NB_cmd_remove').click(self.usunRozkaz);
				$('.NB_cmd_edit').click(self.edytujRozkaz);
				$('.NB_cmd_add').click(self.dodajRozkaz);
				$('.NB_cmd_refresh').click(self.odswiez.bind(self));
				unsafeWindow.UI.ToolTip('.tooltip');
				for (var i = 0; i < templates.length; i++) {
					$('.NB_cmd[data-id="'+templates[i].id+'"]').data('att', templates[i]);
				}
			});
		},
		odswiez: function(){
			var self = this;
			$('.NB_cmd').remove();
			TWManager.tools.nodeRequest({type:'commandList'}, function(templates) {
				var text = '';
				for (var i = 0; i < templates.length; i++) {
					text+=self.wiersz(templates[i]);
				}
				$(text).insertBefore('#NB_cmd tr:last');
				$('.NB_cmd_remove').click(self.usunRozkaz);
				$('.NB_cmd_edit').click(self.edytujRozkaz);
				unsafeWindow.UI.ToolTip('.tooltip');
				for (var i = 0; i < templates.length; i++) {
					$('.NB_cmd[data-id="'+templates[i].id+'"]').data('att', templates[i]);
				}
			});
		},
		wiersz: function(att) {
			var ret = '<tr class="NB_cmd" data-id="'+att.id+'"><td align="center"><a class="nowrap" href="/game.php?village='+TWManager.wioska+'&screen=overview">&nbsp;<img src="https://dspl.innogamescdn.com/graphic/command/'+(att.support ? 'support' : 'attack') + '.png"/>&nbsp;'+att.source.name+' ('+att.source.x+'|'+att.source.y+')&nbsp;</a></td>';

			for (var i = 0; i < 12; i++) {
				ret += '<td align="center">'+(att.troops.length > i ? att.troops[i] : 0)+'</td>';
			}
			ret += '<td>&nbsp;'+att.target.x+'|'+att.target.y+'&nbsp;</td><td class="tooltip nowrap" title="Czas wysłania: '+TWManager.tools.timeToText(att.sendTime)+'">&nbsp;'+TWManager.tools.timeToReportText(att.time)+'&nbsp;</td><td> <a class="rename-icon NB_cmd_edit" href="#" title="Edytuj"> </a> </td><td> <a class="NB_cmd_remove" href="#"> <img src="https://dspl.innogamescdn.com/graphic/delete.png"> </a> </td></tr>';
			return ret;
		},
		usunRozkaz:function() {
			var tr = $(this).closest('tr.NB_cmd'), id=tr.data('id'), cb=TWManager.nodeBot.odswiez.bind(TWManager.nodeBot);
			TWManager.tools.nodeRequest({type:'removeCommand', id: id}, cb, cb);
		},
		edytujRozkaz:function() {
			TWManager.nodeBot.edytuj($(this).closest('tr.NB_cmd').data('id'));
		},
		dodajRozkaz: function() {
			TWManager.nodeBot.edytuj(-1);	
		},
		wioski: function() {
			var el = $(this), id = el.data('id');
			TWManager.tools.nodeRequest({type:'villageList'}, function(villages) {
				var text = '<tr class="NB_inp"><td><input type="text" id="NB_wioski_x_'+id+'"></td><td><input type="text" id="NB_wioski_y_'+id+'"></td></tr>';
				for (var i = 0; i < villages.length; i++) {
					text += '<tr data-n="'+i+'"><td><a href="#">'+villages[i].name+'</a></td><td><a href="#">'+villages[i].x+'|'+villages[i].y+'</a></td></tr>';
				}
				TWManager.funkcje.showDraggableWindow('NB_village_select_'+id, 'Wybór wioski', '<table class="vis" width="100%">'+text+'</table>');
				$('#window_NB_village_select_'+id+'_content a').click(function(){
					var i = $(this).closest('tr').data('n');
					el.data('v', villages[i]).text(el.text().match(/[^:]+/)[0] + ': ' + villages[i].name + ' (' + villages[i].x + '|' + villages[i].y + ')');
					setTimeout(function(){$('#window_NB_village_select_'+id).remove();}, 0);
					TWManager.nodeBot.aktualizuj(el.closest('div'));
					return false;
				});
				$('#NB_wioski_x_'+id+', #NB_wioski_y_'+id).keydown(function(e){if(e.which===13){
					var $this = $(this);
					if (!$this.val().length) { return false; }
					if (this.id === 'NB_wioski_x_'+id) {
						$('#NB_wioski_y_'+id).focus();
					} else {
						var prev = $('#NB_wioski_x_'+id);
						el.data('v', {x:prev.val(), y:$this.val()}).text(el.text().match(/[^:]+/)[0] + ': ' + ' (' + prev.val() + '|' + $this.val() + ')');
						setTimeout(function(){$('#window_NB_village_select_'+id).remove();}, 0);
						TWManager.nodeBot.aktualizuj(el.closest('div'));
					}
					return false;
				}});
			});
			return false;
		},
		wojska: function(wnd, tr) {
			if (!tr) {
				tr = [];
				var zle = false;
				var inputs = wnd.find('.NB_cmd_unit').each(function() {
					var v = parseInt($(this).val()||'0',10);
					if (isNaN(v)) {
						$(this).css('background-color', 'pink');
						zle = true;
					} else {
						tr.push(v);
					}
				});
				if (zle) { return []; }
				inputs.css('background-color', ''); 
				return tr;
			} else {
				wnd.find('.NB_cmd_unit').each(function(i) {
					$(this).val(tr[i]);
				});
			}
		},
		czas: function(wnd) {
			var send_time = new Date();
			send_time.setDate(parseInt(wnd.find('.DD').val(),10));
			send_time.setMonth(parseInt(wnd.find('.MM').val(),10)-1);
			send_time.setFullYear(parseInt(wnd.find('.YYYY').val(),10));
			send_time.setHours(parseInt(wnd.find('.HH').val(),10));
			send_time.setMinutes(parseInt(wnd.find('.mm').val(),10));
			send_time.setSeconds(parseInt(wnd.find('.ss').val(),10));
			send_time.setMilliseconds(parseInt(wnd.find('.ms').val(),10));
			return send_time.getTime();
		},
		aktualizuj: function(wnd) {
			if (!wnd.closest) {
				wnd = $(this).closest('div');
			}
			var self = TWManager.nodeBot,
				troops = self.wojska(wnd),
				len = troops.length,
				speed = 0;

				
			if (units_speed.length < len) {
				len = units_speed.length;
			}
			for (var i = 0; i < len; i++) {
				if (troops[i] > 0 && speed < units_speed[i]) {
					speed = units_speed[i];
				}
			}
			if (speed === 0) {
				wnd.find('.time_out').html('<b>Brak jednostek!</br>');
				return;
			}
			var source = wnd.find('.NB_source').data('v'),
				target = wnd.find('.NB_target').data('v');

			if (typeof source !== 'object' || typeof target !== 'object' || !source.x || !target.x || !source.y || !target.y) { 
				wnd.find('.time_out').html('<b>Brak źródła / celu!</br>');
				return;
			}
			if (source.x === target.x && source.y === target.y) {
				wnd.find('.time_out').html('<b>Źródło i cel to jedna wioska!</br>');
				return;	
			}

			var send_time = self.czas(wnd);
			if (!wnd.find('.type_time').is(':checked')) {
				send_time -=  speed * 60000 * TWManager.tools.distance(source.x, source.y, target.x, target.y);
			}
			send_time = new Date(send_time);
			wnd.find('.time_out')[0].innerHTML = addZero(send_time.getDate(),2) + '/' + addZero(send_time.getMonth(),2) + '/' + send_time.getFullYear() + ' - ' + addZero(send_time.getHours(),2) + ':' + addZero(send_time.getMinutes(),2) + ':' + addZero(send_time.getSeconds(),2) + '.' + addZero(send_time.getMilliseconds(),3);
		},
		edytuj: function(id) {
			var id_str = (''+id).replace('.', '');
			if ($('#window_NB_cmd_'+id_str).length) {return;}
			var att = $('.NB_cmd[data-id="'+id+'"]').data('att'), 
				czas_dotarcia = new Date();
			if (att) {
				czas_dotarcia = new Date(att.time || att.sendTime);
			} else {
				czas_dotarcia.setMinutes(czas_dotarcia.getMinutes()+10);
			}
			var text = '<table><tbody><tr><td style="border:1px solid #603000; padding:5px"><table><tbody><tr><td colspan=2><a class="NB_source" data-id="'+id+'" href="#">» Źródło</a></td><td colspan=2><a class="NB_target" data-id="'+id+'" href="#">» Cel</a></td></tr><tr><td valign="top"><table class="vis" width="100%"><tbody><tr><th>Piechota</th></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spear.png" title="Pikinier"></a> <input name="spear" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_sword.png" title="Miecznik"></a> <input name="sword" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_axe.png" title="Topornik"></a> <input name="axe" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_archer.png" title="Łucznik"></a> <input name="archer" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr></tbody></table></td><td valign="top"><table class="vis" width="100%"><tbody><tr><th>Kawaleria</th></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_spy.png" title="Zwiadowca"></a> <input name="spy" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_light.png" title="Lekki Kawalerzysta"></a> <input name="light" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_marcher.png" title="Łucznik na Koniu" ></a> <input name="marcher" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_heavy.png" title="Ciężki Kawalerzysta"></a> <input name="heavy" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr></tbody></table></td><td valign="top"><table class="vis" width="100%"><tbody><tr><th>Bronie oblężnicze</th></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_ram.png" title="Taran"></a> <input name="ram" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_catapult.png" title="Katapulta"></a> <input name="catapult" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr></tbody></table></td><td valign="top"><table class="vis" width="100%"><tbody><tr><th>Inne</th></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_knight.png" title="Rycerz"></a> <input name="knight" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr><tr><td class="nowrap"><img src="https://dspl.innogamescdn.com/graphic/unit/unit_snob.png" title="Szlachcic"></a> <input name="snob" style="width: 40px" class="NB_cmd_unit NB_cmd_aktualizuj" type="text"></td></tr></tbody></table></td></tr></tbody></table></td><td style="border:1px solid #603000; width:280px; padding:5px"><table width=100% height=100%><tr><th colspan=4><center>Atak</center></th></tr><tr><td colspan=4>&nbsp;Czas wysłania: <input type=checkbox class="type_time"'+(!att || att.time ?'' : ' checked=checked')+'></td></tr><tr><td colspan=2>Czas:</td><td colspan=2><input type=text class="NB_cmd_aktualizuj DD" value=' + addZero(czas_dotarcia.getDate(),2) + ' size=2>/<input type=text class="NB_cmd_aktualizuj MM" value=' + addZero(czas_dotarcia.getMonth()+1,2) + ' size=2>/<input type=text class="NB_cmd_aktualizuj YYYY" value=' + czas_dotarcia.getFullYear()+' size=4><br><input type=text class="NB_cmd_aktualizuj HH" value=' + addZero(czas_dotarcia.getHours(),2) + ' size=2>:<input type=text class="NB_cmd_aktualizuj mm" valu
			TWManager.funkcje.showDraggableWindow('NB_cmd_'+id_str, id===-1 ? 'Nowy rozkaz' : 'Edytuj rozkaz', '<div style="padding:2px; max-width: 800px">'+text+'</div>');
			var wnd = $('#window_NB_cmd_'+id_str);
			if (att) {
				TWManager.nodeBot.wojska(wnd, att.troops);
				wnd.find('.NB_source').data('v', att.source).text('» Źródło: ' + att.source.name + ' (' + att.source.x + '|' + att.source.y + ')');
				wnd.find('.NB_target').data('v', att.target).text('» Cel: (' + att.target.x + '|' + att.target.y + ')');
			}
			wnd.find('.NB_source, .NB_target').click(TWManager.nodeBot.wioski);
			wnd.find('.NB_cmd_aktualizuj').keyup(TWManager.nodeBot.aktualizuj);
			wnd.find('.type_time').change(TWManager.nodeBot.aktualizuj);
			wnd.find('.NB_cmd_target_btn').click(function(){
				var cmd = {source: wnd.find('.NB_source').data('v'), target: wnd.find('.NB_target').data('v'), troops: TWManager.nodeBot.wojska(wnd), support: $(this).hasClass('btn-support')};
				cmd[wnd.find('.type_time').is(':checked') ? 'sendTime' : 'time'] = TWManager.nodeBot.czas(wnd);
				TWManager.tools.nodeRequest({type:'addCommand', command:cmd}, TWManager.nodeBot.odswiez.bind(TWManager.nodeBot));
			});
		}
	},
	onPartialReload: function() {
		var funkcja = TWManager[TWManager.url.screen];
		if (undefined !== funkcja) {
			if (typeof funkcja.partialReload === 'function') {
				setTimeout(funkcja.partialReload.bind(funkcja), 0);
			} else if (typeof funkcja.init === 'function') {
				setTimeout(funkcja.init.bind(funkcja), 0);
			}
		}
	}
};
unsafeWindow.TWManager = TWManager;
String.prototype.repeat = function(num) {return new Array(num + 1).join(this);};
String.prototype.delim = function(delimiter, len) {var str2 = this.substring(0, this.length % len) + this.substring(this.length % len).replace(RegExp("\\d".repeat(len), "g"), function(a) {return delimiter + a;});if (str2.substring(0, delimiter.length) == delimiter) str2=str2.substring(delimiter.length); return str2;};
String.prototype.capitalize = function() {return this[0].toUpperCase()+this.slice(1);};
Number.prototype.zero = function(y) {var i = this+''; while (i.length < y) i = '0' + i; return i;};
unsafeWindow.eval('String.prototype.delim = '+ String.prototype.delim.toString());
unsafeWindow.eval('String.prototype.repeat = '+ String.prototype.repeat.toString());
//unsafeWindow.eval('Dialog.close=function(by_user){"use strict";$(".popup_box_container").remove();if(Dialog.closeCallback)Dialog.closeCallback(by_user);inlinePopupClose();return false;}');
$.fn.reverse = Array.prototype.reverse;
$.fn.settings = function() {
	if (this.length < 1) {
		error('jQuery settings: no elements given.');
		return this;
	}
	var k = this[0].getElementsByTagName('INPUT'), tab={};
	for (var i=0;i<k.length;i++)
	{
		if (!k[i].name) { continue; }
		if (['text', 'hidden', 'password'].indexOf(k[i].type) >= 0) {
			tab[k[i].name] = k[i].value;
		} else if (k[i].type === 'checkbox') {
			tab[k[i].name] = k[i].checked;
		} else if (k[i].type === 'radio') {
			if (k[i].checked) {
				tab[k[i].name] = k[i].value;
			}
		} else {
			error('unknown input type: ' + k[i].type);
		}
	}
	return tab;
};
$.fn.url = function (){return this.attr('href')||this.attr('src');};
$.fn.reportId = function() { var id = this.data('id'); if (!id) { id = ~~this.attr('href').match(/view=([0-9]+)/)[1] || 0; this.attr('data-id', id).data('id', id); } return id; };

function addZero(i,y) {
	i=i.toString();
	return new Array(y-i.length+1).join('0')+i;
}
/*
function bind(prev) {
	eval('prev = ' + prev + ';' + prev + ' = function() {console.log(\'' + prev.match('[^.]+$') + '\', arguments);return prev.apply(this, arguments);}');
}
*/
function getChecked(n,q) {
	if (((undefined === q) && n) || (n == q))
		return ' checked';
	return '';
}
var wname = window.name;
try {
	wname = JSON.parse(name);
	if (!wname || typeof(wname) != 'object' || JSON.stringify(wname) == '[]') {
		wname = {swiat: parseInt(document.location.href.match(/^http[s]{0,1}:\/\/[a-z]{2}([0-9a-z]{1,3})\./)[1])};  
	}
} catch (e) {
	wname = {swiat: parseInt(document.location.href.match(/^http[s]{0,1}:\/\/[a-z]{2}([0-9a-z]{1,3})\./)[1])};
}
try {
	TWManager.init(wname);
} catch(e) {if (Fwk.work()) TWManager.gg.wyslij(11930927, ''+e); else {alert(e); console.error(e);}}
	
console.log('TWBot loaded.');

