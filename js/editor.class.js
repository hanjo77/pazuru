function Editor() {

	this.bgCanvas = null;
	this.canvas = null;
	this.context = null;
	this.tiles = null;
	this.lastWall = null;

	this.levelNr = 17;
	this.cols = 0;
	this.rows = 0;
	this.init();
}

Editor.prototype.init = function() {

	$('body').html('<canvas id="game"></canvas><div id="menu"></div>');
	this.updateSize();
	this.btns = [
		new Wall(1, 1, .5, 1, 1),
		new Line(1, .5*config.blockSize, config.blockSize, config.blockSize, config.blockSize),
		new Star(.5, .5),
		new Reflector(1, .5, .5, {}),
		new Reflector(1, .5, .5, { rotatable: true }),
		new Reflector(1, .5, .5, { hideable: true, hidden: false }),
		new Reflector(1, .5, .5, { hideable: true, hidden: true }),
		new Brick(.5, .5),
		new Trap(1, 1, .5, 1, 1),
	];
	this.loadLevel(this.levelNr);
	this.drawMenu();
	this.startControls();
}

Editor.prototype.loadLevel = function(levelNr) {

	this.canvas = document.getElementById('game');
	this.context = this.canvas.getContext('2d');
	this.lastWall = null;
	$(this.canvas).click(function(e) {

			$tile = $(e.target);
			var col = Math.floor(e.offsetX/config.blockSize)-config.padding;
			var row = Math.floor(e.offsetY/config.blockSize)-config.padding;
			if (pazuru.editor.selectedItem) {

				pazuru.editor.addTile(pazuru.editor.selectedItem, col, row);
			}
			console.log(col + " - " + row);
	});

	$.getJSON("js/levels/level" + levelNr + ".json", function(data) {
		
		var tmpObj;
		pazuru.editor.canvas.width = ((2*config.padding)+data.width)*config.blockSize;
		pazuru.editor.canvas.height = ((2*config.padding)+data.height)*config.blockSize;
		pazuru.editor.tiles = {

			lines: [],
			walls: [],
			traps: [],
			stars: [],
			reflectors: [],
			bricks: []
		};
		if (data.tiles) {

			if (data.tiles.lines) {

				for (var i = 0; i < data.tiles.lines.length; i++) {

					tmpObj = data.tiles.lines[i];
					var startX = tmpObj.col*config.blockSize;
					var startY = tmpObj.row*config.blockSize;
					switch(tmpObj.type) {

						case 1:
						case 3:
							startY += (config.blockSize/2);
							break;
						case 2:
						case 4:
							startX += (config.blockSize/2);
							break;
					}
					pazuru.editor.addLine(tmpObj.type, startX+(config.padding*config.blockSize), startY+(config.padding*config.blockSize), tmpObj.size*config.blockSize);
				}
			}
			if (data.tiles.walls) {

				for (var i = 0; i < data.tiles.walls.length; i++) {

					tmpObj = data.tiles.walls[i];
					pazuru.editor.addWall(tmpObj.type, tmpObj.row, tmpObj.col, tmpObj.size);
				}
			}
			if (data.tiles.traps) {

				for (var i = 0; i < data.tiles.traps.length; i++) {

					tmpObj = data.tiles.traps[i];
					pazuru.editor.addTrap(tmpObj.type, tmpObj.row, tmpObj.col);
				}
			}
			if (data.tiles.stars) {

				for (var i = 0; i < data.tiles.stars.length; i++) {

					tmpObj = data.tiles.stars[i];
					pazuru.editor.addStar(tmpObj.row, tmpObj.col);
				}
			}
			if (data.tiles.reflectors) {

				for (var i = 0; i < data.tiles.reflectors.length; i++) {

					tmpObj = data.tiles.reflectors[i];
					pazuru.editor.addReflector(tmpObj.type, tmpObj.row, tmpObj.col, tmpObj.opt);
				}
			}
			if (data.tiles.bricks) {

				for (var i = 0; i < data.tiles.bricks.length; i++) {

					tmpObj = data.tiles.bricks[i];
					pazuru.editor.addBrick(tmpObj.row, tmpObj.col);
				}
			}
		}
		pazuru.editor.updateSize();
	}).error(function() { 

		document.write("all done");
	});
}

Editor.prototype.startControls = function() {

	$(document).keyup(function(event) {

		// console.log(event.keyCode);
		switch(event.keyCode) {

			case 32: // space
				if (!pazuru.editor.gameLoop) {

					pazuru.editor.gameLoop = window.setInterval(function() {

						pazuru.editor.move();
					}, 1000/50);
				}
				break;
			case 16: // shift
				pazuru.editor.toggleHiddenReflectors();
				break;
			case 37: // left
				pazuru.editor.rotateLeft();
				break;
			case 39: // right
				pazuru.editor.rotateRight();
				break
		}
	})
}

Editor.prototype.drawMenu = function() {

	var $menu = $('#menu');
	$menu.html("");
	var menuHtml = "";
	var btnCanvas, btnContext;
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
		}).appendTo('#menu');

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
			$('.active').removeClass('active');
			$tile.addClass('active');
			var id = parseInt($tile.attr('id').replace('btn_', ''), 10);
			var selectedItem = pazuru.editor.btns[id];
			if (selectedItem.type) {

				selectedItem.type++;
				console.log(selectedItem.constructor.name);
				switch(selectedItem.constructor.name) {

					case "Reflector":
					case "Line":

						selectedItem.type %= 4;
						if (selectedItem.type == 0) {

							selectedItem.type = 4;							
						}
						break;
					case "Wall":
					case "Trap":
						selectedItem.type %= 2;
						if (selectedItem.type == 0) {

							selectedItem.type = 2;							
						}
						break;
				}
			}
			pazuru.editor.selectedItem = selectedItem;
			pazuru.editor.drawMenu();
		});
	}


	// $menu.html('<canvas id="menuBtn' + )
}

var loadCanvas = function(id, tile) {
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	tile.draw(context);
	return $(canvas);
};

window.onresize = function() {

	pazuru.editor.updateSize();
	pazuru.editor.loadLevel(pazuru.editor.levelNr);
}

Editor.prototype.updateSize = function() {

	var screenSize = [$(window).width(), $(window).height()];
	var blockSize = screenSize[0]/config.maxCols;
	blockSize = blockSize-(blockSize%config.maxCols);
	if (screenSize[1]/config.maxRows < blockSize) {

		blockSize = screenSize[1]/config.maxRows;
		blockSize = blockSize-(blockSize%config.maxRows);
	}
	config.blockSize = blockSize;
	config.lineWidth = blockSize/10;
	config.speed = blockSize/config.speedDivider;
	if (this.canvas) {

		$(this.canvas).css({
			left: ((screenSize[0]-this.canvas.width)/2) + "px",
			top: ((screenSize[1]-this.canvas.height)/2) + "px",
		});
		this.draw();
	}
}

Editor.prototype.toggleHiddenReflectors = function() {

	for (var i = 0; i < this.tiles.reflectors.length; i++) {

		var reflector = this.tiles.reflectors[i];
		if (reflector.hideable) {

			reflector.hidden = !reflector.hidden;
		}
	}
	this.drawGame();
}

Editor.prototype.rotateLeft = function() {

	for (var i = 0; i < this.tiles.reflectors.length; i++) {

		var reflector = this.tiles.reflectors[i];
		if (reflector.rotatable) {

			reflector.rotateLeft();
		}
	}
	this.drawGame();
}

Editor.prototype.rotateRight = function() {

	for (var i = 0; i < this.tiles.reflectors.length; i++) {

		var reflector = this.tiles.reflectors[i];
		if (reflector.rotatable) {

			reflector.rotateRight();
		}
	}
	this.drawGame();
}

Editor.prototype.move = function() {

	for (var i = this.tiles.lines.length-1; i >= 0; i--) {

		var line = this.tiles.lines[i];
		for (var j = 0; j < this.tiles.traps.length; j++) {

			var trap = this.tiles.traps[j];
			if (trap.collidesWithLine(line)) {

				line.followUp = line;
				line.targetSize = 0;
			}
		}
		for (var j = 0; j < this.tiles.reflectors.length; j++) {

			var reflector = this.tiles.reflectors[j];
			if (reflector.collidesWithLine(line) && !line.followUp) {

				var newType;
				var newX;
				var newY;
				switch(line.type) {

					case 1:
						switch(reflector.type) {

							case 1:
							case 2:
								newType = 3;
								newX = reflector.startX;
								newY = reflector.startY+(config.blockSize/2);
								break;
							case 3:
								newType = 4;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
							case 4:
								newType = 2;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
						}
						break;
					case 2:
						switch(reflector.type) {

							case 1:
							case 4:
								newType = 4;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY;
								break;
							case 2:
								newType = 1;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
							case 3:
								newType = 3;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
						}
						break;
					case 3:
						switch(reflector.type) {

							case 3:
							case 4:
								newType = 1;
								newX = reflector.startX+config.blockSize;
								newY = reflector.startY+(config.blockSize/2);
								break;
							case 1:
								newType = 2;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
							case 2:
								newType = 4;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
						}
						break;
					case 4:
						switch(reflector.type) {

							case 2:
							case 3:
								newType = 2;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+config.blockSize;
								break;
							case 1:
								newType = 1;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
							case 4:
								newType = 3;
								newX = reflector.startX+(config.blockSize/2);
								newY = reflector.startY+(config.blockSize/2);
								break;
						}
						break;
				}
				if (newType) {

					var newLine = this.addLine(newType, newX, newY, 0, config.blockSize);
					line.followUp = newLine;
					line.targetSize = 0;

				}
			}
		}		
		for (var j = 0; j < this.tiles.walls.length; j++) {

			var wall = this.tiles.walls[j];
			if (wall.collidesWithLine(line) && !line.followUp && line.targetSize != 0) {

				if (line.size == line.targetSize) {

					var newType, newX, newY;
					switch(line.type) {

						case 1:
							newType = 3;
							newX = line.endX-config.speed;
							newY = line.startY;
							break;
						case 2:
							newType = 4;
							newX = line.startX;
							newY = line.endY-config.speed;
							break;
						case 3:
							newType = 1;
							newX = line.endX+config.speed;
							newY = line.startY;
							break;
						case 4:
							newType = 2;
							newX = line.startX;
							newY = line.endY+config.speed;
							break;
					}
					var newLine = this.addLine(newType, newX, newY, config.speed, config.blockSize);
					line.followUp = newLine;
					line.targetSize = 0;
				}
			}
		}
		for (var j = this.tiles.stars.length-1; j >= 0; j--) {

			var star = this.tiles.stars[j];
			if (star.collidesWithLine(line) && !line.followUp) {

				this.tiles.stars.splice(j, 1);
				if (this.tiles.stars.length < 1) {

					if (this.gameLoop) {

						window.clearInterval(this.gameLoop);
						this.gameLoop = null;
					}
					this.levelNr++;
					this.loadLevel(this.levelNr);
				}
			}
		}
		for (var j = this.tiles.bricks.length-1; j >= 0; j--) {

			var brick = this.tiles.bricks[j];
			if (brick.collidesWithLine(line) && !line.followUp) {

				this.tiles.bricks.splice(j, 1);
				if (line.size == line.targetSize) {

					var newType, newX, newY;
					switch(line.type) {

						case 1:
							newType = 3;
							newX = line.endX-config.speed;
							newY = line.startY;
							break;
						case 2:
							newType = 4;
							newX = line.startX;
							newY = line.endY-config.speed;
							break;
						case 3:
							newType = 1;
							newX = line.endX+config.speed;
							newY = line.startY;
							break;
						case 4:
							newType = 2;
							newX = line.startX;
							newY = line.endY+config.speed;
							break;
					}
					var newLine = this.addLine(newType, newX, newY, config.speed, config.blockSize);
					line.followUp = newLine;
					line.targetSize = 0;
				}
			}
		}
		line.move();
		if (line.size <= 0) {

			if (this.tiles.lines.length > 1) {

				this.tiles.lines.splice(i, 1);
				delete(line);
			}
			else {

				window.clearInterval(this.gameLoop);
				this.gameLoop = null;
				this.loadLevel(this.levelNr);
			}
		}
	}
	this.drawGame();
}

Editor.prototype.draw = function() {

	this.drawGame();
}

Editor.prototype.drawBg = function() {

	this.bgCanvas = document.getElementById('gameBg');
	this.bgCanvas.width = this.canvas.width;
	this.bgCanvas.height = this.canvas.height;
	var ctx = this.bgCanvas.getContext('2d');
	ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	ctx.strokeStyle = '#000000';
	ctx.lineWidth = this.config.lineWidth;
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(100, 100);
	ctx.stroke();
}

Editor.prototype.drawGame = function() {

	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	if (this.tiles && this.tiles.reflectors) {

		for (var i = 0; i < this.tiles.reflectors.length; i++) {

			var tile = this.tiles.reflectors[i];
			if (tile.hidden) {

				tile.draw(this.context);
			}
		}
	}
	for (var type in this.tiles) {

		for (var i = 0; i < this.tiles[type].length; i++) {

			var tile = this.tiles[type][i];
			if (type == "walls" && tile.col) {

				Wall.endDraw(this.context);
				tile.startDraw(this.context);
			}
			if (type != "reflectors" || !tile.hidden) {

				tile.draw(this.context);
			}
		}
		if (type == "walls") {

			Wall.endDraw(this.context);
		}
	}
}

Editor.prototype.addTile = function(tile, col, row) {

	switch(tile.constructor.name) {

		case "Line":
			break;
		case "Trap":
			this.addTrap(tile.type, row, col);
			break;
		case "Brick":
			this.addBrick(row, col);
			break;
		case "Star":
			this.addStar(row, col);
			break;
		case "Reflector":
			this.addReflector(tile.type, row, col, {
				rotatable: tile.rotatable,
				hideable: tile.hideable,
				hidden: tile.hidden
			})
			break;
		case "Wall":
			break;
	}
	this.draw();
}

Editor.prototype.addLine = function(type, startX, startY, size, targetSize) {

	var line = new Line(type, startX, startY, size, targetSize);
	this.tiles.lines.push(line);
	return line;
}

Editor.prototype.addTrap = function(type, row, col) {

	var trap = new Trap(type, config.padding+row, config.padding+col);
	this.tiles.traps.push(trap);
}

Editor.prototype.addStar = function(row, col) {

	var star = new Star(config.padding+col, config.padding+row);
	this.tiles.stars.push(star);
}

Editor.prototype.addWall = function(type, row, col, size) {

	var wall = new Wall(type, config.padding+row, config.padding+col, size);
	this.tiles.walls.push(wall);
}

Editor.prototype.addReflector = function(type, row, col, options) {

	var reflector = new Reflector(type, config.padding+col, config.padding+row, options);
	this.tiles.reflectors.push(reflector);
}

Editor.prototype.addBrick = function(row, col) {

	var brick = new Brick(config.padding+col, config.padding+row);
	this.tiles.bricks.push(brick);
}