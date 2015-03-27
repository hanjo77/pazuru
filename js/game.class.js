function Game() {

	this.bgCanvas = null;
	this.canvas = null;
	this.context = null;
	this.tiles = {

		lines: [],
		reflectors: [],
		walls: []
	};

	this.gameLoop = null;
	this.init();
}

Game.prototype.init = function() {

	document.write('<canvas id="game"></canvas>');
	this.canvas = document.getElementById('game');
	this.context = this.canvas.getContext('2d');
	this.canvas.width = 600;
	this.canvas.height = 500;
	// this.drawBgCanvas();
	// this.context.drawImage(this.bgCanvas, 600, 500);
	this.addReflector(1, 2, 2);
	this.addReflector(2, 4, 2);
	this.addReflector(3, 2, 4);
	this.addReflector(4, 4, 4);
	this.addWall(1, 0, 0, 8);
	this.addWall(2, 8, 0, 8);
	this.addWall(1, 0, 8, 8);
	this.addWall(2, 0, 0, 8);
	this.addLine(1, (0*config.blockSize)+(config.blockSize/2), (2*config.blockSize)+(config.blockSize/2), config.blockSize);
	this.draw();
	this.startControls();
}

Game.prototype.startControls = function() {

	$(document).keyup(function(event) {

		console.log(event.keyCode);
		switch(event.keyCode) {

			case 32: // space
				if (!pazuru.game.gameLoop) {
					
					pazuru.game.gameLoop = window.setInterval(function() {

						pazuru.game.move();
					}, 1000/60);
				}
				break;
			case 37: // left
				pazuru.game.rotateLeft();
				break;
			case 39: // right
				pazuru.game.rotateRight();
				break
		}
	})
}

Game.prototype.rotateLeft = function() {

	for (var i = 0; i < this.tiles.reflectors.length; i++) {

		var reflector = this.tiles.reflectors[i];
		reflector.rotateLeft();
	}
	this.drawGame();
}

Game.prototype.rotateRight = function() {

	for (var i = 0; i < this.tiles.reflectors.length; i++) {

		var reflector = this.tiles.reflectors[i];
		reflector.rotateRight();
	}
	this.drawGame();
}

Game.prototype.move = function() {

	for (var i = this.tiles.lines.length-1; i >= 0; i--) {

		var line = this.tiles.lines[i];
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
			if (wall.collidesWithLine(line) && !line.followUp) {

				var newLine;
				switch(line.type) {

					case 1:
						newLine = this.addLine(3, line.endX, line.startY, 0, config.blockSize);
						break;
					case 2:
						newLine = this.addLine(4, line.startX, line.endY, 0, config.blockSize);
						break;
					case 3:
						newLine = this.addLine(1, line.endX, line.startY, 0, config.blockSize);
						break;
					case 4:
						newLine = this.addLine(2, line.startX, line.endY, 0, config.blockSize);
						break;
				}
				line.followUp = newLine;
				line.targetSize = 0;
			}
		}
		line.move();
		if (line.size <= 0) {

			this.tiles.lines.splice(i, 1);
			delete(line);
		}
	}
	this.drawGame();
}

Game.prototype.draw = function() {

	this.drawGame();
}

Game.prototype.drawBg = function() {

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

Game.prototype.drawGame = function() {

	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	for (var type in this.tiles) {

		for (var i = 0; i < this.tiles[type].length; i++) {

			this.tiles[type][i].draw(this.context);
		}
	}
}

Game.prototype.addLine = function(type, row, col, size, targetSize) {

	var line = new Line(type, row, col, size, targetSize);
	this.tiles.lines.push(line);
	return line;
}

Game.prototype.addWall = function(type, row, col, size) {

	var wall = new Wall(type, row, col, size);
	this.tiles.walls.push(wall);
}

Game.prototype.addReflector = function(type, row, col) {

	var reflector = new Reflector(type, row, col);
	this.tiles.reflectors.push(reflector);
}