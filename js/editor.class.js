function Editor(levelNr) {

	this.bgCanvas = null;
	this.canvas = null;
	this.context = null;
	this.tiles = null;
	this.lastWall = null;
	this.currentLine = [];
	this.doDrawBg = true;

	if (levelNr) {
		
		this.levelNr = levelNr;
	}
	this.init();
}

Editor.prototype.init = function() {

	$('body').html('<div id="playground">'
		+ '<canvas id="editor"></canvas>'
		+ '</div>'
		+ '<a id="exitButton" onclick="pazuru.drawTitle()">Exit</a>'
		+ '<a id="editButton" onclick="pazuru.content.toggleEditMenu()">Menu</a>'
		+ '<div id="menu"></div>'
	);
	this.canvas = document.getElementById('editor');
	this.context = this.canvas.getContext('2d');
	$(this.canvas).click(function(e) {

		pazuru.content.placeTile(event);
	});
	Util.updateSize(this);
	this.btns = [
		new Wall(1, 1, .5, 1, 1),
		new Line(1, .5*config.blockSize, config.blockSize, config.blockSize, config.blockSize),
		new Star(.5, .5),
		new Spiral(.5, .5),
		new Reflector(1, .5, .5, {}),
		new Reflector(1, .5, .5, { rotatable: true }),
		new Reflector(1, .5, .5, { hideable: true, hidden: false }),
		new Reflector(1, .5, .5, { hideable: true, hidden: true }),
		new Brick(.5, .5),
		new Trap(1, 1, .5, 1, 1),
	];
	this.tiles = {

		lines: [],
		walls: [],
		traps: [],
		stars: [],
		spirals: [],
		reflectors: [],
		bricks: []
	};
	if (this.levelNr) {
		
		this.loadLevel(this.levelNr);
	}
	this.draw();
	Util.startControls(this);

	window.onresize = function() {

		Util.updateSize(pazuru.content);
	}
}

Editor.prototype.toggleEditMenu = function() {

	if ($("#menu").css("display") == "none") {

		$("#menu").css({

			display: "block"
		});
	}
	else {

		$("#menu").css({

			display: "none"
		});
	}
}

Editor.prototype.loadLevel = function(levelNr) {

	config.lastWall = null;
	config.firstWall = null;
	
	$.getJSON("js/levels/level" + levelNr + ".json", function(data) {
		
		Util.initLevel(pazuru.content, data);
	}).error(function() { 
//		document.write("all done");
	});
}

Editor.prototype.draw = function() {

	this.drawMenu();
	Util.drawGame(this);
}

Editor.prototype.drawMenu = function() {

	var $menu = $('#menu');
	$menu.html("");
	var menuHtml = "";

	$('<a>').attr({
		id: 'btn_close',
		class: 'button'
	}).html(
		"Close"
	).click(function(e) {
		pazuru.content.toggleEditMenu();
	}).appendTo('#menu');

	$('<div>').attr({
		id: 'menuButtons'
	}).appendTo('#menu');

	var btnCanvas, btnContext;
	if (this.btns) {
		for (var i = 0; i < this.btns.length; i++) {

			var btn = this.btns[i];
			var btnActive = (btn == this.selectedItem) ? ' active' : '';
			$('<canvas>').attr({
				id: 'btn_' + i,
				class: 'button_canvas' + btnActive,
				width: (config.blockSize*2),
				height: (config.blockSize*2)
			}).css({
				width: (config.blockSize*2) + 'px',
				height: (config.blockSize*2) + 'px'
			}).appendTo('#menuButtons');

			var canvas = document.getElementById('btn_' + i);
			var context = canvas.getContext("2d");
			context.clearRect(0, 0, config.blockSize, config.blockSize);
			if (i == 0) {

				btn.startDraw(context);
			}
			btn.draw(context);
			if (i == 0) {

				Wall.endDraw(context);
			}
			$(canvas).click(function(e) {

				$tile = $(e.target);
				pazuru.content.clickTile($tile);
			});
		}
	}
	var active = "";
	if (!this.selectedItem) {

		active = " active";
	}

	$('<a>').attr({
		id: 'btn_delete',
		class: 'button' + active
	}).html(
		"Remove"
	).click(function(e) {
		pazuru.content.selectedItem = null;
		pazuru.content.drawMenu();
		pazuru.content.draw();
	}).appendTo('#menu');

	$('<a>').attr({
		id: 'btn_delete',
		class: 'button'
	}).html(
		"Save"
	).click(function(e) {
		pazuru.content.selectedItem = null;
		pazuru.content.drawMenu();
		pazuru.content.draw();
		pazuru.content.saveLevel();
	}).appendTo('#menu');

	// $menu.html('<canvas id="menuBtn' + )
}

Editor.prototype.saveLevel = function() {

	var obj = {
		"width": this.maxCol-this.minCol,
		"height": this.maxRow-this.minRow
	};
	var tiles = {};
	for (var tileType in this.tiles) {

		tiles[tileType] = [];
		for (var i = 0; i < this.tiles[tileType].length; i++) {

			var tile = this.tiles[tileType][i];
			var tmpTile = {};
			var t = $.extend({}, tile);
			if (tile.col) t.col -= this.minCol;
			if (tile.row) t.row -= this.minRow;
			if (tile.startX) t.startX -= config.blockSize*this.minCol;
			if (tile.startY) t.startY -= config.blockSize*this.minRow;
			if (tile.hidden || tile.hideable || tile.rotatable) {

				t.opt = {

					"hidden": tile.hidden,
					"hideable": tile.hideable,
					"rotatable": tile.rotatable
				};
			}
			if (!t.col && t.startX) {

				t.col = Math.floor(t.startX/config.blockSize);
			}
			if (!t.row && t.startY) {

				t.row = Math.floor(t.startY/config.blockSize);
			}

			switch (tileType) {

				case "walls":
					tmpTile = {
						type: tile.type,
						size: tile.size
					};
					if (tile.first) {

						tmpTile.row = t.row;
						tmpTile.col = t.col;
					}
					break;
				case "traps":
					tmpTile = {
						type: tile.type,
						row: t.row,
						col: t.col
					};
					break;
				case "lines":
					tmpTile = {
						type: tile.type,
						size: tile.size/config.blockSize,
						row: t.row,
						col: t.col
					};
					break;
				case "reflectors":
					tmpTile = {
						type: tile.type,
						row: t.row,
						col: t.col,
						opt: t.opt
					};
					break;
				case "stars":
				case "spirals":
				case "bricks":
					tmpTile = {
						row: t.row,
						col: t.col
					};
					break;
			}

			tiles[tileType].push(tmpTile);
		}
	}
	obj.tiles = tiles;
	console.log(JSON.stringify(obj));
}

Editor.prototype.placeTile = function(event) {

	var started;
	var clickX = event.offsetX;
	var clickY = event.offsetY;
	$tile = $(event.target);
	if (this.selectedItem) {
		
		if (this.selectedItem.constructor.name == "Wall") {
			
			clickX += config.blockSize/2;
			clickY += config.blockSize/2;
		}
		else if (this.selectedItem.constructor.name == "Trap") {
			
			switch(this.selectedItem.type) {
				
				case 1:
					clickY += config.blockSize/2;
					break;
				case 2:
					clickX += config.blockSize/2;
					break;
			}
		}
	}
	var col = Math.floor(clickX/config.blockSize);
	var row = Math.floor(clickY/config.blockSize);
	if (this.selectedItem) {

		if (this.selectedItem.constructor.name == "Wall") {

			if (!config.firstWall) {

				config.lastWall = {
					"col": col, 
					"row": row
				};
				config.firstWall = config.lastWall;
			}
			else {

				var distX = col - config.lastWall.col;
				var distY = row - config.lastWall.row;

				if (Math.abs(distX) > Math.abs(distY)) {

					if (!config.lineStarted) {

						Util.addWall(this, 1, config.firstWall.row-config.padding, config.firstWall.col-config.padding, distX);
						config.lineStarted = true;
					}
					else {

						Util.addWall(this, 1, undefined, undefined, distX);
					}
					if (Math.abs(distY) > 0) {

						Util.addWall(this, 2, undefined, undefined, distY);
					}
				}
				else {

					if (!config.lineStarted) {

						Util.addWall(this, 2, config.firstWall.row-config.padding, config.firstWall.col-config.padding, distY);
						config.lineStarted = true;
					}
					else {

						Util.addWall(this, 2, undefined, undefined, distY);
					}
					if (Math.abs(distX) > 0) {

						Util.addWall(this, 1, undefined, undefined, distX);
					}
				}
				this.draw();
				if (row == config.firstWall.row && col == config.firstWall.col) {

					this.selectedItem = null;
					config.lastWall = null;
					config.firstWall = null;
					config.lineStarted = undefined;
					this.drawMenu();
				}
			}
		}
		else {

			Util.addTile(this, this.selectedItem, col, row);
			this.draw();
		}
	}
	else {

		Util.getItemForPosition(event, this.tiles, true);
		this.draw();
	}
}

Editor.prototype.clickTile = function($tile) {

	$('.active').removeClass('active');
	$tile.addClass('active');
	var id = parseInt($tile.attr('id').replace('btn_', ''), 10);
	var selectedItem = this.btns[id];
	if (selectedItem.type && selectedItem.constructor.name != "Wall") {

		selectedItem.type++;
		switch(selectedItem.constructor.name) {

			case "Reflector":
				selectedItem.type %= 4;
				if (selectedItem.type == 0) {

					selectedItem.type = 4;							
				}
				break;
			case "Line":

				selectedItem.type %= 4;
				if (selectedItem.type == 0) {

					selectedItem.type = 4;							
				}
				switch(selectedItem.type) {

					case 1:
						selectedItem.row = 1;
						selectedItem.col = .5;
						break;
					case 2:
						selectedItem.row = .5;
						selectedItem.col = 1;
						break;
					case 3:
						selectedItem.row = 1;
						selectedItem.col = 1.5;
						break;
					case 4:
						selectedItem.row = 1.5;
						selectedItem.col = 1;
						break;
				}
				selectedItem.startX = selectedItem.col*config.blockSize;
				selectedItem.startY = selectedItem.row*config.blockSize;
				break;
			case "Trap":
				selectedItem.type %= 2;
				if (selectedItem.type == 0) {

					selectedItem.type = 2;							
				}
				switch(selectedItem.type) {

					case 1:						
						selectedItem.row = 1;
						selectedItem.col = .5;
						break;
					case 2:						
						selectedItem.row = .5;
						selectedItem.col = 1;
						break;
				}
				selectedItem.startX = selectedItem.col*config.blockSize;
				selectedItem.startY = selectedItem.row*config.blockSize;
				break;
		}
	}
	this.selectedItem = selectedItem;
	this.drawMenu();
} 
