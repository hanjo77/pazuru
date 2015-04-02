function Util() {

}

Util.getItemForPosition = function(event, tiles, deleteItem) {

	var clickX = event.offsetX;
	var clickY = event.offsetY;
	var col = Math.floor(clickX/config.blockSize);
	var row = Math.floor(clickY/config.blockSize);
	for (var elem in tiles) {

		var tileItems = tiles[elem];
		var firstIndex, lastIndex;
		for (var i = tileItems.length-1; i >= 0; i--) {

			var tileItem = tileItems[i];
			if (elem == "lines") {

				switch (tileItem.type) {

					case 1:
					case 2:
						tileItem.col = Math.floor(tileItem.startX/config.blockSize);
						tileItem.row = Math.floor(tileItem.startY/config.blockSize);
						break;
					case 3:
					case 4:
						tileItem.col = Math.floor(tileItem.endX/config.blockSize);
						tileItem.row = Math.floor(tileItem.endY/config.blockSize);
						break;
				}
			}
			else if (elem == "traps") {
				
				switch(tileItem.type) {
					
					case 1:
						clickY = event.offsetY+config.blockSize/2;
						break;
					case 2:
						clickX = event.offsetX+config.blockSize/2;
						break;
				}
				col = Math.floor(clickX/config.blockSize);
				row = Math.floor(clickY/config.blockSize);
			}
			
			if (elem == "walls") {

				var firstIndex = tileItem.getFirst(tileItems);
				var lastIndex = tileItem.getLast(tileItems);

				clickX = event.offsetX+config.blockSize/2;
				clickY = event.offsetY+config.blockSize/2;
				col = Math.floor(clickX/config.blockSize);
				row = Math.floor(clickY/config.blockSize);

				if (tileItem) {

					switch (tileItem.type) {

						case 1:
							if (
								(
									(tileItem.col <= col && tileItem.col+tileItem.size >= col)
									|| (tileItem.col >= col && tileItem.col+tileItem.size <= col)
								)
								&& (tileItem.row == row)
								) {

								if (deleteItem) {

									tileItems.splice(firstIndex, lastIndex-firstIndex);
									i = firstIndex;
								}
							}
							break;
						case 2:
							if (
								(
									(tileItem.row <= row && tileItem.row+tileItem.size >= row)
									|| (tileItem.row >= row && tileItem.row+tileItem.size <= row)
								)
								&& (tileItem.col == col)
								) {

								if (deleteItem) {

									tileItems.splice(firstIndex, lastIndex-firstIndex);
									i = firstIndex;
								}
							}
							break;
					}
				}
			}			
			else if (tileItem && tileItem.col == col && tileItem.row == row) {

				if (deleteItem) {

					tileItems.splice(i, 1);
				}
				return tileItem;
			}
		}
	}
}

Util.initLevel = function(parent, data, cropCanvas) {

	var tmpObj;
	parent.canvas.width = ((2*config.padding)+data.width)*config.blockSize;
	parent.canvas.height = ((2*config.padding)+data.height)*config.blockSize;
	this.updateSize(parent, cropCanvas);
	parent.tiles = {

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
				Util.addLine(parent, tmpObj.type, startX+(config.padding*config.blockSize), startY+(config.padding*config.blockSize), tmpObj.size*config.blockSize);
			}
		}
		if (data.tiles.walls) {

			for (var i = 0; i < data.tiles.walls.length; i++) {

				tmpObj = data.tiles.walls[i];
				Util.addWall(parent, tmpObj.type, tmpObj.row, tmpObj.col, tmpObj.size);
			}
		}
		if (data.tiles.traps) {

			for (var i = 0; i < data.tiles.traps.length; i++) {

				tmpObj = data.tiles.traps[i];
				Util.addTrap(parent, tmpObj.type, tmpObj.row, tmpObj.col);
			}
		}
		if (data.tiles.stars) {

			for (var i = 0; i < data.tiles.stars.length; i++) {

				tmpObj = data.tiles.stars[i];
				Util.addStar(parent, tmpObj.row, tmpObj.col);
			}
		}
		if (data.tiles.reflectors) {

			for (var i = 0; i < data.tiles.reflectors.length; i++) {

				tmpObj = data.tiles.reflectors[i];
				Util.addReflector(parent, tmpObj.type, tmpObj.row, tmpObj.col, tmpObj.opt);
			}
		}
		if (data.tiles.bricks) {

			for (var i = 0; i < data.tiles.bricks.length; i++) {

				tmpObj = data.tiles.bricks[i];
				Util.addBrick(parent, tmpObj.row, tmpObj.col);
			}
		}
	}
	Util.updateSize(parent, cropCanvas);
}

Util.startControls = function(parent) {

	$(document).keyup(function(event) {

		// console.log(event.keyCode);
		switch(event.keyCode) {

			case 32: // space
				if (!parent.gameLoop) {

					config.currentParent = parent;
					parent.gameLoop = window.setInterval(function() {
						
						Util.move(config.currentParent);
					}, 1000/50);
				}
				break;
			case 16: // shift
				Util.toggleHiddenReflectors(parent);
				break;
			case 37: // left
				Util.rotateLeft(parent);
				break;
			case 39: // right
				Util.rotateRight(parent);
				break
		}
	})
}

Util.loadCanvas = function(id, tile) {
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	tile.draw(context);
	return $(canvas);
};

Util.updateSize = function(parent, cropCanvas) {

	var screenSize = [$(window).width(), $(window).height()];
	var blockSize = screenSize[0]/config.maxCols;
	blockSize = blockSize-(blockSize%config.maxCols);
	if (screenSize[1]/config.maxRows < blockSize) {

		blockSize = screenSize[1]/config.maxRows;
		blockSize = blockSize-(blockSize%config.maxRows);
	}
	screenSize = [blockSize*config.maxCols, blockSize*config.maxRows];
	config.blockSize = blockSize;
	config.lineWidth = blockSize/10;
	config.speed = blockSize/config.speedDivider;
	if (parent.canvas) {

		if (!cropCanvas) {
			
			parent.canvas.width = blockSize*config.maxCols;
			parent.canvas.height = blockSize*config.maxRows;
		}
		else {
			
			$(parent.canvas).css({
				left: (($(window).width()-parent.canvas.width)/2) + "px",
				top: (($(window).height()-parent.canvas.height)/2) + "px",
			});
		}
		parent.draw();
	}
}

Util.toggleHiddenReflectors = function(parent) {

	for (var i = 0; i < parent.tiles.reflectors.length; i++) {

		var reflector = parent.tiles.reflectors[i];
		if (reflector.hideable) {

			reflector.hidden = !reflector.hidden;
		}
	}
	this.drawGame(parent);
}

Util.rotateLeft = function(parent) {

	for (var i = 0; i < parent.tiles.reflectors.length; i++) {

		var reflector = parent.tiles.reflectors[i];
		if (reflector.rotatable) {

			reflector.rotateLeft();
		}
	}
	this.drawGame(parent);
}

Util.rotateRight = function(parent) {

	for (var i = 0; i < parent.tiles.reflectors.length; i++) {

		var reflector = parent.tiles.reflectors[i];
		if (reflector.rotatable) {

			reflector.rotateRight();
		}
	}
	this.drawGame(parent);
}

Util.move = function(parent) {

	for (var i = parent.tiles.lines.length-1; i >= 0; i--) {

		var line = parent.tiles.lines[i];
		for (var j = 0; j < parent.tiles.traps.length; j++) {

			var trap = parent.tiles.traps[j];
			if (trap.collidesWithLine(line)) {

				line.followUp = line;
				line.targetSize = 0;
			}
		}
		for (var j = 0; j < parent.tiles.reflectors.length; j++) {

			var reflector = parent.tiles.reflectors[j];
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

					var newLine = Util.addLine(parent, newType, newX, newY, 0, config.blockSize);
					line.followUp = newLine;
					line.targetSize = 0;

				}
			}
		}		
		for (var j = 0; j < parent.tiles.walls.length; j++) {

			var wall = parent.tiles.walls[j];
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
					var newLine = Util.addLine(parent, newType, newX, newY, config.speed, config.blockSize);
					line.followUp = newLine;
					line.targetSize = 0;
				}
			}
		}
		for (var j = parent.tiles.stars.length-1; j >= 0; j--) {

			var star = parent.tiles.stars[j];
			if (star.collidesWithLine(line) && !line.followUp) {

				parent.tiles.stars.splice(j, 1);
				if (parent.tiles.stars.length < 1) {

					if (parent.gameLoop) {

						window.clearInterval(parent.gameLoop);
						parent.gameLoop = null;
					}
					pazuru.endLevel(parent.levelNr);
				}
			}
		}
		for (var j = parent.tiles.bricks.length-1; j >= 0; j--) {

			var brick = parent.tiles.bricks[j];
			if (brick.collidesWithLine(line) && !line.followUp) {

				parent.tiles.bricks.splice(j, 1);
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
					var newLine = Util.addLine(parent, newType, newX, newY, config.speed, config.blockSize);
					line.followUp = newLine;
					line.targetSize = 0;
				}
			}
		}
		line.move();
		if (line.size <= 0) {

			if (parent.tiles.lines.length > 1) {

				parent.tiles.lines.splice(i, 1);
				delete(line);
			}
			else {

				window.clearInterval(parent.gameLoop);
				parent.gameLoop = null;
				pazuru.loadGame(parent.levelNr);
			}
		}
	}
	Util.drawGame(parent);
}

Util.drawBg = function(context) {

	context.strokeStyle = '#CCCCCC';
	context.lineWidth = config.lineWidth;
	for (var row = config.padding; row < config.maxRows; row++) {

		context.beginPath();
		context.moveTo(config.padding*config.blockSize, row*config.blockSize);
		context.lineTo((config.maxCols-2)*config.blockSize, row*config.blockSize);
		context.stroke();
	}
	for (var col = config.padding; col < config.maxCols-1; col++) {

		context.beginPath();
		context.moveTo(col*config.blockSize, config.padding*config.blockSize);
		context.lineTo(col*config.blockSize, (config.maxRows-1)*config.blockSize);
		context.stroke();
	}
}

Util.drawGame = function(parent) {

	if (parent && parent.context) {
		
		parent.minCol = undefined;	
		parent.maxCol = undefined;	
		parent.minRow = undefined;	
		parent.maxRow = undefined;	
		parent.context.clearRect(0, 0, parent.canvas.width, parent.canvas.height);
		if (parent.doDrawBg) {

			Util.drawBg(parent.context);
		}
		if (parent.tiles && parent.tiles.reflectors) {

			for (var i = 0; i < parent.tiles.reflectors.length; i++) {

				var tile = parent.tiles.reflectors[i];
				if (tile.hidden) {

					tile.draw(parent.context);
				}
			}
		}
		for (var type in parent.tiles) {

			for (var i = 0; i < parent.tiles[type].length; i++) {

				var tile = parent.tiles[type][i];
				if (type == "walls" && tile.col) {

					Wall.endDraw(parent.context);
					tile.startDraw(parent.context);
				}
				if (type != "reflectors" || !tile.hidden) {

					tile.draw(parent.context);
				}
				if (parent.minCol == undefined || tile.col < parent.minCol) {

					parent.minCol = tile.col;
				}
				if (parent.maxCol == undefined || tile.col > parent.maxCol) {

					parent.maxCol = tile.col;
				}
				if (parent.minRow == undefined || tile.row < parent.minRow) {

					parent.minRow = tile.row;
				}
				if (parent.maxRow == undefined || tile.row > parent.maxRow) {

					parent.maxRow = tile.row;
				}
			}
			if (type == "walls") {

				Wall.endDraw(parent.context);
			}
		}
	}
}

Util.addTile = function(parent, tile, col, row) {

	switch(tile.constructor.name) {

		case "Line":
			var tmpCol, tmpRow
			switch(tile.type) {

				case 1:
					tmpCol = col*config.blockSize;
					tmpRow = (row+.5)*config.blockSize;
					break;
				case 3:
					tmpCol = (col+1)*config.blockSize;
					tmpRow = (row+.5)*config.blockSize;
					break;
				case 2:
					tmpCol = (col+.5)*config.blockSize;
					tmpRow = row*config.blockSize;
					break;
				case 4:
					tmpCol = (col+.5)*config.blockSize;
					tmpRow = (row+1)*config.blockSize;
					break;
			}
			Util.addLine(parent, tile.type, tmpCol, tmpRow, config.blockSize, config.blockSize);
			break;
		case "Trap":
			switch(tile.type) {

				case 1:
					Util.addTrap(parent, tile.type, row-config.padding, col-config.padding);
					break;
				case 2:
					Util.addTrap(parent, tile.type, row-config.padding, col-config.padding);
					break;
			}
			break;
		case "Brick":
			Util.addBrick(parent, row-config.padding, col-config.padding);
			break;
		case "Star":
			Util.addStar(parent, row-config.padding, col-config.padding);
			break;
		case "Reflector":
			Util.addReflector(parent, tile.type, row-config.padding, col-config.padding, {
				rotatable: tile.rotatable,
				hideable: tile.hideable,
				hidden: tile.hidden
			})
			break;
		case "Wall":
			break;
	}
	parent.draw();
}

Util.addLine = function(parent, type, startX, startY, size, targetSize) {

	var line = new Line(type, startX, startY, size, targetSize);
	parent.tiles.lines.push(line);
	return line;
}

Util.addTrap = function(parent, type, row, col) {

	var trap = new Trap(type, config.padding+row, config.padding+col);
	parent.tiles.traps.push(trap);
}

Util.addStar = function(parent, row, col) {

	var star = new Star(config.padding+col, config.padding+row);
	parent.tiles.stars.push(star);
}

Util.addWall = function(parent, type, row, col, size) {

	var wall = new Wall(type, config.padding+row, config.padding+col, size);
	parent.tiles.walls.push(wall);
}

Util.addReflector = function(parent, type, row, col, options) {

	var reflector = new Reflector(type, config.padding+col, config.padding+row, options);
	parent.tiles.reflectors.push(reflector);
}

Util.addBrick = function(parent, row, col) {

	var brick = new Brick(config.padding+col, config.padding+row);
	parent.tiles.bricks.push(brick);
}
