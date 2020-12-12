// ==UserScript==
// @id				TW Map Enhancer
// @name			TW Map Enhancer
// @version			1.6.0
// @author			zygzagZ
// @downloadURL		http://zygzagz.pl/GM/twmapenhancer.user.js
// @updateURL		http://zygzagz.pl/GM/twmapenhancer.meta.js
// @description		Usprawniacz mapy w plemionach (KP)
// @include			https://pl*.plemiona.pl/game.php?*screen=map*
// @run-at			document-start
// @grant			GM_setClipboard
// @grant			GM_addStyle
// @grant			unsafeWindow
// @grant			GM_info
// ==/UserScript==

GM_addStyle('.nothideable {display: block !important;}', 0);
function main() {
	function CreateToggle(id, f) {
		return new MapToggleBox({id: id+'_options', onShow:function(){document.getElementById(id+'_mode').checked=1;f(true);}, onHide:function(){document.getElementById(id+'_mode').checked=0;f(false);}});
	}
	var units = ['spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'];
	function showDraggableWindow(name, title, content, onclose) {
		var win = $('#window_' + name), closefunc;
		if (!win.length) {
			win = $('<div id="window_' + name + '" class="nothideable popup_style ui-draggable" style="display: block"><div id="window_' + name + '_header"><div class="close popup_menu">' + title + '<a style="cursor:pointer;"><img id="window_' + name + '_close" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAFSSURBVChTbVE9SwNBEH27OdAjgiQQrK2EEBvBImAhKKKFCIK2FhaCIIhgkSp/wMLGQAr/gdiIiKBlCCix8UhrJ+hJonDJfWT3zp1lc36QB+9u7s28mblddrZTTKKghyGSWCImSpGS8wyYogh9WL7XxczWMfK5Sdj2mLH9he+H6HS/8FA7AmeM6+JCIYepQn4kKUc1nIMMTHfO2uO4PjlA+7aObNbWpJg0ylENV80tOYjMYGB6toSnu3sEvT6cRgMfn32sbm+YLCBkDC7Fj2F+8xDFchntZjMtJm0IEauVfk8gUOf3jofWK/S0/+BiEJoQeLw8VT/Gdee10gRuHA/1/XWTNROEkOYTeHl2MLe8pNfYq12lpiHIwKqLSFYq5/ro6DRGoecHcN0uLqq74JmMpS+FhDe3M5KUoxoCqywg0bvRpSiBYgK9YvWIExUwLSGSwDceyKWk9VatnwAAAABJRU5ErkJggg=="></a></div></div><div id="window_' + name + '_content">' + content + '</div></div>') .appendTo(document.body);
			win.draggable({
				cursor: 'move',
				handle: win.find('div:first'),
				containment: [0, 60],
			})
			.css('top', Math.max(($(window).height() - win.height()) / 2, 10))
			.css('left', Math.max(($(window).width() - win.width()) / 2, 10));
		} else {
			win.css('display', 'block').find('span').html(title);
			$('#window_' + name + '_content').html(content);
		}
		if (typeof (onclose) == 'function')
			closefunc = function (ev) {
				ev.preventDefault();
				var ret;
				try {
					ret = onclose();
				} catch (e) {
					UI.ErrorMessage('Error on window close: ' + e);
				}
				if (ret === false) return false;
				$('#window_' + name).remove();
				return false;
			};
		else
			closefunc = function () {$('#window_' + name).remove();return false;};
		$(win.find('div:first')).unbind('contextmenu').contextmenu(closefunc);
		$('#window_' + name + '_close').unbind('click').click(closefunc);
		return true;
	}
	TWMap.mapHandler.onClick = function (x, y, e) {
		var village = TWMap.villages[x * 1e3 + y];
		if (village) {
			var event = jQuery.Event("villageClick");
			$(TWMap).trigger(event, [village, x, y, e]);
			if (event.isDefaultPrevented()) {
				return false;
			} else {
				if (!event.isPropagationStopped()) {
					if (TWMap.warMode && Warplanner.admin) {
						Warplanner.onVillageClicked(village.id, x, y);
						return false;
					} else if (!TWMap.context.enabled) {
						if (!e || ($.browser.msie && ~~($.browser.version) < 8)) window.location.href = TWMap.urls.villageInfo.replace(/__village__/, village.id);
						return true;
					}
					TWMap.context.spawn(village, x, y);
				} else
					return true;
			}
		} else TWMap.context.hide();
		return false;
	};
	TWMap.mapHandler.spawnSector = function (data, sector) {
		sector.data = data;
		if (TWMap.minimap_only) return;
		var beginX = sector.x - data.x,
			endX = beginX + TWMap.mapSubSectorSize,
			beginY = sector.y - data.y,
			endY = beginY + TWMap.mapSubSectorSize,
			event = jQuery.Event("shouldSpawnSector");
			
		$(TWMap).trigger(event, [sector, data]);
		if (TWMap.church.displayed || TWMap.politicalMap.displayed || TWMap.warMode || event.isDefaultPrevented()) MapCanvas.createCanvas(sector, data);
		
		sector.dom_fragment = document.createDocumentFragment();
		var el_border = this._createBorder(sector.x % 100 == 0);
		el_border.style.width = '1px';
		el_border.style.height = (TWMap.mapSubSectorSize * TWMap.tileSize[1]) + 'px';
		sector.appendElement(el_border, 0, 0);
		el_border = this._createBorder(sector.y % 100 == 0);
		el_border.style.height = '1px';
		el_border.style.width = (TWMap.mapSubSectorSize * TWMap.tileSize[0]) + 'px';
		sector.appendElement(el_border, 0, 0);
		if (TWMap.ghost) {
			var ghostX = TWMap.ghost.x,
				ghostY = TWMap.ghost.y;
			if (ghostX >= sector.x && ghostX < sector.x + TWMap.mapSubSectorSize && ghostY >= sector.y && ghostY < sector.y + TWMap.mapSubSectorSize) {
				TWMap.villages[ghostX * 1e3 + ghostY] = {
					owner: 0,
					points: 0,
					img: TWMap.ghost_village_tile,
					special: 'ghost'
				};
			}
		}
		var x;
		for (x in data.tiles) {
			if (!data.tiles.hasOwnProperty(x)) continue;
			x = parseInt(x);
			if (x < beginX || x >= endX) continue;
			var y;
			for (y in data.tiles[x]) {
				if (!data.tiles[x].hasOwnProperty(y)) continue;
				y = parseInt(y);
				if (y < beginY || y >= endY) continue;
				var el = document.createElement('img');
				el.style.position = 'absolute';
				el.style.zIndex = '2';
				var v = TWMap.villages[(data.x + x) * 1e3 + data.y + y];
				if (v) {
					var owner = v.owner,
						ally = (v.owner > 0 && TWMap.players[v.owner]) ? TWMap.players[v.owner].ally : 0;
					if (v.owner == 0) {
						if (TWMap.villageColors[v.id]) {
							var col = TWMap.villageColors[v.id],
								circle = TWMap.createVillageDot(col);
							sector.appendElement(circle, x - beginX, y - beginY);
						}
					} else {
						var col = null;
						if (v.id == game_data.village.id) {
							col = TWMap.colors['this'];
						} else col = TWMap.getColorByPlayer(owner, ally, v.id);
						el.style.backgroundColor = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
					}
					var imgsrc = TWMap.images[v.img];
					el.id = 'map_village_' + v.id;
					el.setAttribute('src', TWMap.graphics + imgsrc);
					if (TribalWars._settings.map_casual_hide && parseInt(v.owner) !== parseInt(game_data.player.id) && $.inArray(v.owner, TWMap.non_attackable_players) !== -1) {
						el.style.opacity = 0.4;
						el.style.filter = 'alpha(opacity=40)';
					}
					var icons = TWMap.createVillageIcons(v),
						i;
						
					$(TWMap).trigger("createVillageIcons", [icons, v, sector, data]);
					for (i = 0; i < icons.length; i++) sector.appendElement(icons[i], x - beginX, y - beginY);
					$(el).mouseout(TWMap.popup.hide());
				} else el.setAttribute('src', TWMap.graphics + TWMap.images[data.tiles[x][y]]);
				sector.appendElement(el, x - beginX, y - beginY);
			}
		}
		sector._element_root.appendChild(sector.dom_fragment);
		sector.dom_fragment = undefined;
	};
	MapCanvas.createCanvas = function (sector, data) {
		var canvas = document.createElement('canvas');
		if (!canvas || !canvas.getContext) return null;
		var tileScale = TWMap.map.scale,
			size = TWMap.map.sectorSize;
		canvas.id = 'map_canvas_' + sector.x + '_' + sector.y;
		canvas.className = 'church_radius_display';
		canvas.width = (tileScale[0] * size);
		canvas.height = (tileScale[1] * size);
		canvas.style.position = 'absolute';
		canvas.style.zIndex = '10';
		sector.appendElement(canvas, 0, 0);
		var ctx = canvas.getContext("2d"),
			i;
		ctx.save();
		var churches = this.churchData,
			map = data.pmap[0],
			ally = data.pmap[1],
				width = 20;
		if (map.length < 1) map = null;
		var tilew = canvas.offsetWidth / size,
			tileh = canvas.offsetHeight / size;
		ctx.scale(tilew / 37.75, tileh / 37.75);
		var x, y, cells, pmap_filter = TWMap.politicalMap.filter % 8,
			war_mode = TWMap.warMode,
			show_pmap = !war_mode && TWMap.politicalMap.displayed && (TWMap.politicalMap.filter & 16),
			war, event;
		if (war_mode) war = Warplanner.data;
		for (y = sector.y - 1; y < sector.y + size + 1; y++)
			for (x = sector.x - 1; x < sector.x + size + 1; x++) {
				if (war_mode) {
					var ee = x * 1e3 + y;
					if (war && TWMap.villages.hasOwnProperty(ee)) {
						var id = TWMap.villages[ee].id;
						if (war[id] && war[id].type !== 'D') {
							cells = [false, false, false, false, true, false, false, false, false];
							var col = Warplanner.getColorByPlayerId(war[id].player_id);
							this.mapDrawCell(ctx, x - sector.x, y - sector.y, cells, col, 19, 19, 0.6);
						}
					}
				}
				event = jQuery.Event("spawnSector");
				$(TWMap).trigger(event, [x, y, ctx, sector, data]);
				if (show_pmap) {
					var dx = x - data.x + 1,
						dy = y - data.y + 1,
						ee = dx + dy * (width + 2);
					if (map && map[ee] !== 0) {
						var aa = (dx - 1) + (dy - 1) * (width + 2),
							bb = (dx - 0) + (dy - 1) * (width + 2),
							cc = (dx + 1) + (dy - 1) * (width + 2),
							dd = (dx - 1) + dy * (width + 2),
							ff = (dx + 1) + dy * (width + 2),
							gg = (dx - 1) + (dy + 1) * (width + 2),
							hh = (dx - 0) + (dy + 1) * (width + 2),
							ii = (dx + 1) + (dy + 1) * (width + 2),
							we = dx < 1,
							ea = dx >= width + 1,
							no = dy < 1,
							so = dy >= width + 1;
						if (pmap_filter == 1 || map[ee] == game_data.player.id) {
							cells = [we || no ? 0 : map[aa], no ? 0 : map[bb], ea || no ? 0 : map[cc], we ? 0 : map[dd], map[ee], ea ? 0 : map[ff], we || so ? 0 : map[gg], so ? 0 : map[hh], so || ea ? 0 : map[ii]];
							var col = [255, 0, 255],
								pid = map[ee],
								aid = ally[ee];
							col = TWMap.getColorByPlayer(pid, aid);
							this.mapDrawCell(ctx, x - sector.x, y - sector.y, cells, col, 19, 19, 0.6);
						}
						if (pmap_filter == 1 || pmap_filter == 2 || (pmap_filter != 4 && ally[ee] == game_data.player.ally)) {
							cells = [we || no ? 0 : ally[aa], no ? 0 : ally[bb], ea || no ? 0 : ally[cc], we ? 0 : ally[dd], ally[ee], ea ? 0 : ally[ff], we || so ? 0 : ally[gg], so ? 0 : ally[hh], so || ea ? 0 : ally[ii]];
							this.mapDrawCell(ctx, x - sector.x, y - sector.y, cells, [0, 0, 0], 5, 19, 1);
						}
					}
				}
				if (TWMap.church.displayed && churches) {
					cells = [false, false, false, false, false, false, false, false, false];
					for (i = 0; i < churches.length; i++) {
						var cx = churches[i][0],
							cy = churches[i][1],
							crad = churches[i][2];
						cells = [cells[0] || this.churchInBound(x - 1, y - 1, cx, cy, crad), cells[1] || this.churchInBound(x, y - 1, cx, cy, crad), cells[2] || this.churchInBound(x + 1, y - 1, cx, cy, crad), cells[3] || this.churchInBound(x - 1, y, cx, cy, crad), cells[4] || this.churchInBound(x, y, cx, cy, crad), cells[5] || this.churchInBound(x + 1, y, cx, cy, crad), cells[6] || this.churchInBound(x - 1, y + 1, cx, cy, crad), cells[7] || this.churchInBound(x, y + 1, cx, cy, crad), cells[8] || this.churchInBound(x + 1, y + 1, cx, cy, crad)];
					}
					this.mapDrawCell(ctx, x - sector.x, y - sector.y, cells, [128, 128, 255], 19, 19, 0.5);
				}
			}
			
		
		event = jQuery.Event("afterSpawnSector");
		$(TWMap).trigger(event, [ctx, sector, data]);
		ctx.restore();
		ctx = null;
		canvas = null;
		return null;
	};
	MapCanvas.mapDrawSquare = function (ctx, x, y, color, bw, grad) {
		x = x * 38;
		y = y * 38;
		x-=2;
		y-=1;
		ctx.save();
		ctx.translate(x+10, y+10);
		this.mapDrawBorderLine(ctx, this.mapGetSectorLine(false, false, false, 10), bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+29, y+10);
		this.mapDrawBorderLine(ctx, [10, -9, 0, -9, -19, -9, -20, -9], bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+29, y+10);
		ctx.rotate(Math.PI * 0.5);
		this.mapDrawBorderLine(ctx, this.mapGetSectorLine(false, false, false, 10), bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+29, y+29);
		ctx.rotate(Math.PI * 0.5);
		MapCanvas.mapDrawBorderLine(ctx, MapCanvas.mapGetSectorLine(true, false, false, 10), bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+29, y+29);
		ctx.rotate(Math.PI);
		this.mapDrawBorderLine(ctx, this.mapGetSectorLine(false, false, false, 10), bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+10, y+29);
		ctx.rotate(Math.PI);
		MapCanvas.mapDrawBorderLine(ctx, [10, -9, 0, -9, -19, -9, -20, -9], bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+10, y+29);
		ctx.rotate(Math.PI * 1.5);
		this.mapDrawBorderLine(ctx, this.mapGetSectorLine(false, false, false, 10), bw, color, grad);
		ctx.restore();
		ctx.save();
		ctx.translate(x+10, y+10);
		ctx.rotate(Math.PI * 1.5);
		MapCanvas.mapDrawBorderLine(ctx, MapCanvas.mapGetSectorLine(true, false, false, 10), bw, color, grad);
		ctx.restore();
	};
	TWMap.RedrawSector = function(x, y) {
		x = Math.floor(x/5);
		y = Math.floor(y/5);
		if (!TWMap.map) return;// TWMap didn't spawn yet.
		var s = TWMap.map._loadedSectors[x+'_'+y];
		if (s) {
			$('#map_canvas_'+x*5+'_'+y*5).remove();
			TWMap.mapHandler.spawnSector(s.data, s);
		}
	}
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	try{
	var defaultTemplate = "%coord[%points] - %oname (%atag)";
	TWMap.ClickableMode = false;
	var Clickable = {
		data: {},
		onVillageClicked: function (id, x, y) {
			if (!this.data[id]) {
				this.data[id] = true;
			} else {
				delete this.data[id];
			}
			TWMap.RedrawSector(x, y);
		}, change: function(c) {
			TWMap.ClickableMode = c;
			TWMap.reload();
		}, import: function() {
			try {
				var tab = JSON.parse(prompt('Wioski do zaimportowania')), lacking = [];
				if (!tab) {UI.ErrorMessage('Zły format!'); return;}
				while(tab.length > 0) {
					var i = tab.pop();
					Clickable.data[i] = true;
					if (!TWMap.villages[TWMap.villageKey[i]])
						lacking.push(i);
				}
				if (lacking.length) 
					TWMap.popup.loadVillage(lacking.join(','));
					
			} catch (e) {alert(e);}
			TWMap.reload(false, true);
			return;
		}, export: function() {
			Clickable.saveToClipboard(JSON.stringify(Clickable.data).replace("{", "[").replace("}", "]").replace(/:true/g,'').replace(/"/g,''));
		}, exportbb: function() {
			var d = "";
			var tpl = $('#clickable_template').val();
			for (var i in Clickable.data) {
				if (i) {
					try {
						var village = TWMap.villages[TWMap.villageKey[i]];
						if (!village) throw 'village is undefined!';
					} catch(e) {console.error('TWMap.villages[TWMap.villageKey['+i+']] is undefined');return false;}
					/*{"id":"93649","img":8,"name":"wioska barbarzyńska","points":"2.031","owner":"0","mood":"100","xy":623777}*/
					var owner = TWMap.players[village.owner] || {name:'Brak',points:'0',ally:'0',newbie:0};
					/*{"name":"Oster132","points":"3.080.334","ally":"1793","newbie":0}*/
					var ally = TWMap.allies[owner.ally] || {name:'Brak',points:'0',tag:'Brak'};
					/*{"name":"Fuzja","points":"165.916.606","tag":"~~F~~"}*/
					d += tpl.replace(/%id/g, village.id).replace(/%name/g, village.name).replace(/%points/g, village.points).replace(/%oname/g, owner.name).replace(/%opoints/g, owner.points).replace(/%mood/g, village.mood)
						.replace(/%coord/g, (Math.floor(village.xy*1/1000)+'|'+(village.xy%1000))).replace(/%aname/g, ally.name).replace(/%apoints/g, ally.points).replace(/%atag/g, ally.tag)+'\n';
				}
			}
			Clickable.saveToClipboard(d);
		}, dodajdogrupy: function() {
			var POST = '';
			for (var i in Clickable.data) {
				try {
					var villageOwner = TWMap.villages[TWMap.villageKey[i]].owner;
				} catch(e) {e.message=e.message.replace('[i]','['+i+']');console.error(e);UI.ErrorMessage(e.message);return false;}
				if (villageOwner == game_data.player.id)
					POST += 'village_ids[]='+i+'&';
			}
				
			if (!POST.length)
				return UI.ErrorMessage('Nie zaznaczono żadnych wiosek!');
			TribalWars.get('groups', {mode:'overview',ajax:'load_groups'}, function(r) {
				var txt = '';
				$(r.result).each(function(a,g) {if (g.group_id != 0) txt += '<a href="'+g.link+'" class="clickable_dodawaczdogrup" data-id="'+g.group_id+'"> ['+g.name+'] </a>';});
				Dialog.show('nazwy_wiosek', '<h1>Dodawanie do grupy</h1><br><div>'+txt+'</div>');
				$('a.clickable_dodawaczdogrup').click(function(e) {
					if (e.ctrlKey) return true;
					$.ajax({
						type: "POST",
						url: TribalWars.buildURL('POST', '/game.php?village=' + game_data.village.id + '&action=bulk_edit_villages&mode=groups&partial=&screen=overview_villages'),
						data: POST+'selected_group='+$(this).data('id')+'&add_to_group=Dodaj',
						success: function () {
							UI.SuccessMessage('Wioski dodano pomyslnie!')
						}
					});
					Dialog.close()
				});
			})
		}, dodajdogrupynamapie: function() {
			if (!ColorGroups.Other.editor.group_id) {
				UI.ErrorMessage('Najpierw otwórz okno edycji wybranej grupy na mapie!');
				return;
			}
			var btn = this;
			btn.disabled = true;
			var POST = [];

			for (var i in Clickable.data) {
				POST.push(TWMap.villageKey[i]);
			}
				
			if (!POST.length) {
				return UI.ErrorMessage('Nie zaznaczono żadnych wiosek!');
			}

			(function dodaj() {
				if (!POST.length || !ColorGroups.Other.editor.group_id) {
					btn.disabled = false;
					if (POST.length) {
						UI.ErrorMessage('Najpierw otwórz okno edycji wybranej grupy na mapie!');
					} else {
						UI.SuccessMessage('Wszystkie wioski zostały dodane do grupy');
					}
					TWMap.minimap_cache_stamp++;
					TWMap.minimap.reload(true);
					TWMap.reload();
					return;
				}
				var v = POST.pop();
				ColorGroups.Other.editor.ajax_request('add_village', {
					x: Math.floor(v/1000),
					y: v%1000
				}, ColorGroups.Other.editor.ENTITY_VILLAGE, function(o) {
					MapHighlighter.alterVillage(o.village_id, o.color);

					if ('undefined' != typeof TWMap.villageKey[o.village_id]) {
						MapHighlighter.colorVillage(TWMap.villages[TWMap.villageKey[o.village_id]]);
					}

					setTimeout(dodaj, Math.random()*200+300);
				});
			})();
		}
	};
	
	$(TWMap).on('villageClick', function(e, village, x, y, clickEvent) {
		if(clickEvent.ctrlKey || clickEvent.shiftKey || clickEvent.altKey) { //open village in new tab, don't show up context
			if (!clickEvent.altKey) e.stopImmediatePropagation();
			return true;
		} else if (TWMap.ClickableMode) {try {
			Clickable.onVillageClicked(village.id, x, y);
			e.stopImmediatePropagation();
			e.preventDefault();
			}catch(e){console.error('villageClick: ' + e);}
		}
	}).on('shouldSpawnSector', function() {
		if (TWMap.ClickableMode) return false;
	}).on('spawnSector', function(event, x, y, ctx, sector, data) {
		if (TWMap.ClickableMode) {
			var ee = x * 1e3 + y;
			if (TWMap.villages.hasOwnProperty(ee)) {
				var id = TWMap.villages[ee].id;
				if (Clickable.data[id]) {
					MapCanvas.mapDrawSquare(ctx, x - sector.x, y - sector.y, [255,255,255], 10, 0.7);
				}
			}
		}
	});
	
	$(document).ready(function() {
		$('<tr class="clickable_options_toggler">\
			<td>\
				<input type="checkbox" id="clickable_mode">\
			</td>\
			<td>\
				<label for="clickable_mode">Włącz zaznaczanie</label>\
			</td>\
			<td width="18">\
				<img src="https://dspl.innogamescdn.com/graphic/icons/slide_down.png">	</td>\
		</tr>\
		<tr id="clickable_options" style="display: none;">\
			<td style="padding-left:8px" colspan="3">\
				<table>\
					<tbody><tr>\
						<td>\
							<button class="btn" id="clickable_import">Import</button>\
							<button class="btn" id="clickable_export">Eksport</button>\
						</td>\
					</tr><tr>\
						<td>\
							<button class="btn" id="clickable_exportbb">Eksport do BB-Code</button>\
						</td>\
						<td>\
							<input type="text" id="clickable_template" value="'+defaultTemplate+'">\
					</tr><tr>\
						<td>\
							<button class="btn" id="clickable_dodajdogrupy">Dodaj do grupy</button>\
						</td>\
						<td>\
							<button class="btn" id="clickable_dodajdogrupynamapie">Dodaj do grupy na mapie</button>\
						</td>\
					</tr>\
				</tbody></table>\
			</td>\
		</tr>\
		').appendTo('#map_config tbody:visible:last');

		Clickable.optionToggle = CreateToggle('clickable', Clickable.change);
		$('#clickable_import').click(Clickable.import);
		$('#clickable_export').click(Clickable.export);
		$('#clickable_exportbb').click(Clickable.exportbb);
		$('#clickable_dodajdogrupy').click(Clickable.dodajdogrupy);
		$('#clickable_dodajdogrupynamapie').click(Clickable.dodajdogrupynamapie);
		
	});
	}catch(e){console.error('Clickable: ' + e);}

	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	
	try{
	TWMap.VillagesDistance = false;
	var hoverVillage = {id:0, x:0, y:0},
		speed = [0.0009259259259,0.0007575757576,0.0009259259259,0.0009259259259,0.001851851852,0.001666666667,0.001666666667,0.001515151515,0.0005555555556,0.0005555555556,0.001666666667,0.0004761904762];
	var VillagesDistance = {
		clickUnit: function(e) {
			var me = $(this),
				unit = me.parent().index()-2;
			
			me.closest('tbody').find('.relative_time').each(function(a, b) {
				var m = $(b),
					dist = m.data('dist');
						
				m.data('duration', TWMap.context.FATooltip.calculateDuration(dist, speed[unit]));
			});
			me.css('rotation', 0).stop().animate(
				{rotation: 360},
				{
					duration: 1000,
					step: function(now, fx) {
						$(this).css({"transform": "rotate("+now+"deg)"});
					}
				}
			);
		},
		shouldSpawnSector: function(event, sector, data) {
			if ((sector.x == hoverVillage.x-(hoverVillage.x%5)) && (sector.y == hoverVillage.y-(hoverVillage.y%5)))
				return false;
		},
		spawnSector: function(event, x, y, ctx, sector, data) {
			if ((x == hoverVillage.x) && (y == hoverVillage.y)) {
				MapCanvas.mapDrawSquare(ctx, x - sector.x, y - sector.y, [255,255,255], 10, 0.9);
			}
		},
		hoverOn: function() {
			var id = $(this).data('id'),
				coord = TWMap.CoordByXY(TWMap.villages[TWMap.villageKey[id]].xy);
			hoverVillage = {id: id, x: coord[0], y: coord[1]};
			$(TWMap).on('shouldSpawnSector', VillagesDistance.shouldSpawnSector).on('spawnSector', VillagesDistance.spawnSector);
			TWMap.RedrawSector(hoverVillage.x, hoverVillage.y);
		}, 
		hoverOff: function() {
			$(TWMap).off('shouldSpawnSector', VillagesDistance.shouldSpawnSector).off('spawnSector', VillagesDistance.spawnSector);
			TWMap.RedrawSector(hoverVillage.x, hoverVillage.y);
		}	
	}
	$(TWMap).on("villageClick", function(e, village, x, y, clickEvent) {
		if(clickEvent.ctrlKey || clickEvent.shiftKey || clickEvent.altKey) { //open village in new tab, don't show up context
			if (!clickEvent.altKey) e.stopImmediatePropagation();
			return true;
		} else if (TWMap.VillagesDistance) {try {
			e.stopImmediatePropagation();
			e.preventDefault();
			var villages = [];
			for (var i in TWMap.villages) {
				villages.push(TWMap.villages[i]);			
			}
			villages.sort(function(a,b) {
				a = TWMap.CoordByXY(a.xy);
				b = TWMap.CoordByXY(b.xy);
				return TWMap.context.FATooltip.distance(x, y, a[0], a[1]) > TWMap.context.FATooltip.distance(x, y, b[0], b[1])
			});
			var txt = '<table class="vis" width="100%" cellpadding="0" cellspacing="0">\
						<tr class="center row_' + (i%2?'a':'b') + '">\
							<th class="center">\
								Wioska\
							</th><th>\
								Dystans\
							</th>';
				for (var i = 0; i < units.length; i++)
					txt += '<th>\
								<img class="VillagesDistance" src="https://dspl.innogamescdn.com/graphic/unit/unit_' + units[i] + '.png" title="" alt="" class="" />\
							</th>';
				txt += '</tr>';
				var d, dist, time, vill;
				for (i=0;i<40 && villages.length;) {
					vill = villages.shift();
					d = TWMap.CoordByXY(vill.xy);
					dist = TWMap.context.FATooltip.distance(x, y, d[0], d[1]);
					if (dist <= 0) continue;
					if (('true' === localStorage.vdown) && (vill.owner != game_data.player.id)) continue;
					
					time = TWMap.context.FATooltip.calculateDuration(dist, speed[0]);
					txt += '<tr class="center nowrap ' + ((vill.id == game_data.village.id) ? 'selected ' : '') + 'row_' + (i%2?'a':'b') + '">\
								<td>';
						if (vill.owner == game_data.player.id)
							txt += '<a class="VillagesDistance_village_'+village.id+'" href="game.php?village='+vill.id+'&target=' + village.id + '&screen=place" data-id="' + vill.id + '">';
						else
							txt += '<a class="VillagesDistance_village_'+village.id+'" href="game.php?village='+game_data.village.id+'&id='+vill.id+'&screen=info_village" data-id="' + vill.id + '">';
										
										txt+=vill.name;
							txt += '</a>\
								</td>\
								<td>' + (Math.floor(dist*10+0.5)/10) + '</td>\
								<td colspan="12">\
									<span data-duration="'+ time +'" data-dist="' + dist + '" class="relative_time"></span>\
								</td>\
							</tr>';
						
					i++;
				}
			txt += '</table>';
			showDraggableWindow('VillagesDistance' + village.id, village.name, txt);
			$('.VillagesDistance_village_'+village.id).click(function(e) {
				if (e.ctrlKey) {return true;}
				if (this.href.indexOf('info_village') < 0) {
					var prevvill = game_data.village.id;
					game_data.village.id = $(this).data('id');
					TWMap.actionHandlers.command.click(village.id);
					game_data.village.id = prevvill;
				} else {
					window.open(this.href);
				}
				return false;
			}).hover(VillagesDistance.hoverOn, VillagesDistance.hoverOff);
			$('img.VillagesDistance').unbind('click').click(VillagesDistance.clickUnit);
			Timing.tickHandlers.forwardTimers.init();
			}catch(e){console.error('villageClick: ' + e);}
		}
	});
	
	$(document).ready(function() {
		$('<tr class="VillagesDistance_options_toggler">\
			<td>\
				<input type="checkbox" id="VillagesDistance_mode">\
			</td>\
			<td>\
				<label for="VillagesDistance_mode">Włącz informacje o dystansie</label>\
			</td>\
			<td width="18">\
				<img src="https://dspl.innogamescdn.com/graphic/icons/slide_down.png">	</td>\
		</tr>\
		<tr id="VillagesDistance_options" style="display: none;">\
			<td style="padding-left:8px" colspan="3">\
				<table>\
					<tbody><tr>\
						<td>\
							<input type="checkbox" id="VillagesDistance_own"'+(('true' === localStorage.vdown)?'checked="checked"':'')+'>\
						</td><td>\
							<label for="VillagesDistance_own">Tylko Twoje wioski</label>\
						</td>\
					</tr>\
				</tbody></table>\
			</td>\
		</tr>\
		').appendTo('#map_config tbody:visible:last');
		CreateToggle('VillagesDistance', function(c) {
			TWMap.VillagesDistance = c;
		});
		$('#VillagesDistance_own').change(function() {localStorage.vdown = this.checked;});
	});
	}catch(e){console.error('Clickable: ' + e);}

	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	/*************************************************************************************************************************************************/
	
	try{
	TWMap.Circles = {
		dodajOkreg: function(x, y, r, kolor, id) {
			var t = {x:x, y:y, r:r, c:kolor};// okregi = {id: {x,y,r:promien,c:kolor}, id2: ...}
			TWMap.Circles.data[id] = t;
			localStorage.circles = JSON.stringify(TWMap.Circles.data);
			this.num++;
			TWMap.Circles.scheduleReload();
		}, 
		reload: function() {
			for (var s in TWMap.map._loadedSectors) {
				var y = s.split('_'), x=y[0]; y=y[1];
				$('#map_canvas_'+x*5+'_'+y*5).remove();
				TWMap.mapHandler.spawnSector(TWMap.map._loadedSectors[s].data, TWMap.map._loadedSectors[s]);
			}
			TWMap.Circles.reloadTimeout = false;
		},
		scheduleReload: function() {
			if (this.reloadTimeout) 
				clearTimeout(this.reloadTimeout)
			this.reloadTimeout = setTimeout(this.reload, 50);
		},
		editCoordKeypress: function(e) {
			if (e.which == 13) {
				if (parseInt(this.value) != this.value || parseInt(this.value) < 1) {
					UI.ErrorMessage("Wpisz poprawną wsþółrzędną.");
					return false;
				}
				if (this.className == 'x') { 
					this.nextElementSibling.select(); 
				} else if (this.className == 'y') {
					// update changes
					var ox=$(this).prev().val(), oy=this.value, p=$(this).parent();
					x = parseInt(ox), y = parseInt(oy);
					if (x != ox || x < 1 || y != oy || y < 1) {
						UI.ErrorMessage("Wpisz poprawną wsþółrzędną.");
						return false;
					}
					p.find('p').html(x+'|'+y).show();
					p.find('input').hide();
					p=p.parent().data('x', x).data('y', y);
					TWMap.Circles.data[p.data('name')].x = x;
					TWMap.Circles.data[p.data('name')].y = y;
					localStorage.circles = JSON.stringify(TWMap.Circles.data);
					TWMap.Circles.focusClosestEdit(p);
				} else 
					console.error('Unknown classname "' + this.className + '"');
				return false;
			}
		},
		editCoord: function() {
			var p = $(this).find("p"), y = p.html().split('|'), x=y[0]; y=y[1];
			p.hide();
			var e = $(this).find('input');
			if (!e.length) {
				e = $('<input type="textedit" class="x" maxlength="3" style="width:50px"><input style="width:50px" type="textedit" class="y" maxlength="3">').appendTo(this).keypress(TWMap.Circles.editCoordKeypress);
			} else
				e.show();

			e.first().val(x).select().end().last().val(y);
		},
		editRadiusKeypress: function(e) {
			if (e.which == 13 && this.className == 'r') {
				var r = parseInt(this.value);
				if (r != this.value || r < 1) {
					UI.ErrorMessage("Wpisz poprawny promień.");
					return false;
				}
				var p=$(this).hide().parent().find('p').html(r).show().parent().parent().data('r', r);
				TWMap.Circles.data[p.data('name')].r = r;
				localStorage.circles = JSON.stringify(TWMap.Circles.data);
				TWMap.Circles.focusClosestEdit(p);
				return false;
			}
		},
		editRadius: function() {
			var p = $(this).find("p"), r = parseInt(p.html());
			p.hide();
			var e = $(this).find('input');
			if (!e.length) {
				e = $('<input type="textedit" class="r" maxlength="3" style="width:100px">').appendTo(this).keypress(TWMap.Circles.editRadiusKeypress);
			} else {
				e.show();
			}
			e.val(r).select();
		}, 
		focusClosestEdit: function(p) {
			if (!p.find('input[type=textedit]:visible').first().focus().length)
				TWMap.Circles.scheduleReload();
		},
		editColor: function(e) {
			var colorButton = $(this),
				colorPopup = $('#bb_color_picker'),
				x = colorButton.offset().left + colorButton.width() - colorPopup.width(),
				y = colorButton.offset().top + colorButton.height() + 2;
			if (/MSIE 7/.test(navigator.userAgent)) x = x - 200;
			colorPopup.css('left', x+'px').css('top', y+'px');
			BBCodes.colorPickerToggle();
			TWMap.Circles.colorTarget = this.children[0];
		},
		deleteCircle: function() {
			var p = $(this).parent().parent();
			if (TWMap.Circles.num-- == 1) 
				$('#Circles_none').show();
			delete TWMap.Circles.data[p.data('name')];
			localStorage.circles = JSON.stringify(TWMap.Circles.data);
			p.remove();
			TWMap.Circles.scheduleReload();
		},
		addCircleGUI: function(name, data) {
			var n = !data;

			if (n) {
				name = $('#Circles_name_text').val();
				data = {x:game_data.village.x, y:game_data.village.y, c:'#ffffff', r:4};
				if (!name || !name.length)
					return UI.ErrorMessage("Wpisz nazwę okręgu.");
				if (TWMap.Circles.data[name])
					return UI.ErrorMessage("Już istnieje okręg o takiej nazwie.");
				TWMap.Circles.num++;
			}
			$('#Circles_none').hide();
			var p = $('<tr><td><p>'+data.x+'|'+data.y+'</p></td><td><p>'+data.r+'</p></td><td><div style="border:1px solid black;border-radius:10px;height:20px;width:20px;background-color:'+data.c+'"></div></td><td>'+name+'</td><td><input type="image" alt="Skasuj" src="https://dspl.innogamescdn.com/graphic/delete.png"></td></tr>')
			.appendTo('#Circles_list').data('name', name).data(data).find('td');
			p
				.eq(0).dblclick(TWMap.Circles.editCoord).end()
				.eq(1).dblclick(TWMap.Circles.editRadius).end()
				.eq(2).dblclick(TWMap.Circles.editColor).end()
				.eq(4).children().click(TWMap.Circles.deleteCircle).end();
			
			if (n) {
				TWMap.Circles.editRadius.call(p[1]);
				TWMap.Circles.editCoord.call(p[0]);
				TWMap.Circles.data[name] = data;
				localStorage.circles = JSON.stringify(TWMap.Circles.data);
				$('#Circles_name_text').val('');
				TWMap.Circles.focusClosestEdit(p.parent());
			}
			TWMap.Circles.num++;
			$('#Circles_name').appendTo('#Circles_list');
			return false;
		},
		reloadTimeout: false,
		data: {},
		num: 0,
		colorTarget: false,
	}
	BBCodes.colorPickerToggle_ = BBCodes.colorPickerToggle;
	BBCodes.colorPickerToggle = function(assign) {
		if (assign) {
			var inp = $('#bb_color_picker_tx').first();
			inp.unbind('keyup').keyup(function() {
				var inp = $('#bb_color_picker_tx').first(),
					g = $('#bb_color_picker_preview').first();
				try {
					g.css('color', inp.val())
				} catch (e) {}
			});
			TWMap.Circles.data[$(TWMap.Circles.colorTarget).css('background-color', inp.val()).parent().parent().data('c',inp.val()||'#000000').data('name')].c = inp.val();
			localStorage.circles = JSON.stringify(TWMap.Circles.data);

			TWMap.Circles.scheduleReload();
			$('#bb_color_picker').toggle();
			return false
		} else
			BBCodes.colorPickerToggle_(assign);
	}
	$(TWMap).on("shouldSpawnSector", function() {
		if ('true' === localStorage.crclon && TWMap.Circles.num>0) return false;
	}).on("spawnSector", function(e, x, y, ctx, sector, data) {
		try {
			var okr = TWMap.Circles.data;
			if ('true' === localStorage.crclon && okr && !(!TWMap.warMode && TWMap.politicalMap.displayed && (TWMap.politicalMap.filter & 16))) {
				for (var i in okr) {
					var cx = okr[i].x,
						cy = okr[i].y,
						crad = okr[i].r*okr[i].r;
									
					MapCanvas.mapDrawCell(ctx, x - sector.x, y - sector.y, [MapCanvas.churchInBound(x - 1, y - 1, cx, cy, crad), MapCanvas.churchInBound(x, y - 1, cx, cy, crad), MapCanvas.churchInBound(x + 1, y - 1, cx, cy, crad), MapCanvas.churchInBound(x - 1, y, cx, cy, crad), MapCanvas.churchInBound(x, y, cx, cy, crad), MapCanvas.churchInBound(x + 1, y, cx, cy, crad), MapCanvas.churchInBound(x - 1, y + 1, cx, cy, crad), MapCanvas.churchInBound(x, y + 1, cx, cy, crad), MapCanvas.churchInBound(x + 1, y + 1, cx, cy, crad)], [parseInt(okr[i].c.substr(1,2),16),parseInt(okr[i].c.substr(3,2),16),parseInt(okr[i].c.substr(5,2),16)], 19, 19, 0.5);
				}
			}
		}catch(e){console.error(e);}
	});
	
	$(document).ready(function() {
		$('<tr class="Circles_options_toggler">\
			<td>\
				<input type="checkbox" id="Circles_mode"'+(('true' === localStorage.crclon)?'checked="checked"':'')+'>\
			</td>\
			<td>\
				<label for="Circles_mode">Włącz pokazywanie okręgów</label>\
			</td>\
			<td width="18">\
				<img src="https://dspl.innogamescdn.com/graphic/icons/slide_down.png">	</td>\
		</tr>\
		<tr id="Circles_options" style="display: none;">\
			<td style="padding-left:8px; text-align: center" colspan="3">\
				<table style="width:100%">\
				<tbody id="Circles_list">\
					<tr id="Circles_none">\
						<td style="text-align:right;font-style:italic;width:60%">\
							Nie dodałeś żadnych okręgów\
						</td>\
					</tr>\
					<tr id="Circles_name">\
						<td style="text-align:right;font-style:italic;width:60%">\
							<input id="Circles_name_text" type="textedit">\
						</td><td style="width: 40%">\
							<input type="image" id="Circles_add" src="graphic/plus.png" style="cursor: pointer;padding-top:2px">\
						</td>\
					</tr>\
				</tbody></table>\
			</td>\
		</tr>').appendTo('#map_config tbody:visible:last');
		$('<div class="bb_popup_container" id="bb_popup_container"><div style="clear: both; top: 448px; left: 413.7px; display: none; width:111px;" class="bb_color_picker" id="bb_color_picker"><div style="cursor:default" class="popup_menu"><a href="#" onclick="$(\'#bb_color_picker\').toggle();return false;">Zamknąć</a></div><div id="bb_color_picker_colors"><div style="background:#f00" id="bb_color_picker_c0"></div><div style="background:#ff0" id="bb_color_picker_c1"></div><div style="background:#0f0" id="bb_color_picker_c2"></div><div style="background:#0ff" id="bb_color_picker_c3"></div><div style="background:#00f" id="bb_color_picker_c4"></div><div style="background:#f0f" id="bb_color_picker_c5"></div><br></div><div id="bb_color_picker_tones"><div id="bb_color_picker_10" style="background-color: rgb(134, 134, 134);"></div><div id="bb_color_picker_11" style="background-color: rgb(174, 134, 134);"></div><div id="bb_color_picker_12" style="background-color: rgb(214, 134, 134);"></div><div id="bb_color_picker_13" style="background-color: rgb(255, 134, 134);"></div><div id="bb_color_picker_14" style="background-color: rgb(255, 219, 219);"></div><div id="bb_color_picker_15" style="background-color: rgb(255, 255, 255);"></div><br style="clear: both"><div id="bb_color_picker_20" style="background-color: rgb(85, 85, 85);"></div><div id="bb_color_picker_21" style="background-color: rgb(141, 85, 85);"></div><div id="bb_color_picker_22" style="background-color: rgb(198, 85, 85);"></div><div id="bb_color_picker_23" style="background-color: rgb(255, 85, 85);"></div><div id="bb_color_picker_24" style="background-color: rgb(255, 170, 170);"></div><div id="bb_color_picker_25" style="background-color: rgb(255, 255, 255);"></div><br style="clear: both"><div id="bb_color_picker_30" style="background-color: rgb(46, 46, 46);"></div><div id="bb_color_picker_31" style="background-color: rgb(116, 46, 46);"></div><div id="bb_color_picker_32" style="background-color: rgb(185, 46, 46);"></div><div id="bb_color_picker_33" style="background-color: rgb(255, 46, 46);"></div><div id="bb_color_picker_34" style="background-color: rgb(255, 131, 131);"></div><div id="bb_color_picker_35" style="background-color: rgb(255, 216, 216);"></div><br style="clear: both"><div id="bb_color_picker_40" style="background-color: rgb(14, 14, 14);"></div><div id="bb_color_picker_41" style="background-color: rgb(94, 14, 14);"></div><div id="bb_color_picker_42" style="background-color: rgb(174, 14, 14);"></div><div id="bb_color_picker_43" style="background-color: rgb(255, 14, 14);"></div><div id="bb_color_picker_44" style="background-color: rgb(255, 99, 99);"></div><div id="bb_color_picker_45" style="background-color: rgb(255, 184, 184);"></div><br style="clear: both"><div id="bb_color_picker_50" style="background-color: rgb(0, 0, 0);"></div><div id="bb_color_picker_51" style="background-color: rgb(75, 0, 0);"></div><div id="bb_color_picker_52" style="background-color: rgb(165, 0, 0);"></div><div id="bb_color_picker_53" style="background-color: rgb(255, 0, 0);"></div><div id="bb_color_picker_54" style="background-color: rgb(255, 71, 71);"></div><div id="bb_color_picker_55" style="background-color: rgb(255, 156, 156);"></div><br style="clear: both"></div><div id="bb_color_picker_preview" style="color: rgb(170, 0, 170);">Text</div><input type="text" id="bb_color_picker_tx"><input type="button" onclick="BBCodes.colorPickerToggle(true);return false;" id="bb_color_picker_ok" value="OK"></div></div>').appendTo('body');
		var CircleToggle = CreateToggle('Circles', function(c) {
			localStorage.crclon = c;
			TWMap.Circles.scheduleReload();
		});

		if (localStorage.crclon === 'true') {
			CircleToggle.show();
		}
		$('#Circles_own').change(function() {localStorage.vdown = this.checked;});
		$('#Circles_add').click(TWMap.Circles.addCircleGUI);
		$('#Circles_name_text').keydown(function(e){if(e.which==13)TWMap.Circles.addCircleGUI();});
		var data = {};
		try {
			data = JSON.parse(localStorage.circles);
		} catch(e) {};
		for (var i in data) {
			TWMap.Circles.addCircleGUI(i, data[i]);
			TWMap.Circles.data[i]=data[i];
		}
	});
	if (localStorage.crclon === 'true') {
		TWMap.Circles.scheduleReload(); // initial paint
	}
	}catch(e){console.error('Circles: ' + e);}
}


function execute() {
	var ch = unsafeWindow.document.createElement('script');
	ch.innerHTML = main.toString().replace(/^function.*{|}$/g, '');
	ch.type = 'text/javascript';
	(unsafeWindow.document.getElementsByTagName('head')[0] || unsafeWindow.document.body || unsafeWindow.document.documentElement).appendChild(ch);
	ch.remove();
	unsafeWindow.Clickable.saveToClipboard = function(data) {
		setTimeout(function() {
			GM_setClipboard(data);
			unsafeWindow.UI.InfoMessage('Zapisano do schowka!', 500);
		}, 0);
	};
}

window.addEventListener('DOMContentLoaded', function(e) {
	window.removeEventListener(e.type, arguments.callee, true);
	execute();
}, true);
