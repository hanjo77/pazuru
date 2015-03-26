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
	this.addLine(1, (config.blockSize)+(config.blockSize/2), (config.blockSize)+(config.blockSize/2), config.blockSize);
	this.draw();
	this.startControls();
}

Game.prototype.startControls = function() {

	$(document).keyup(function(event) {

		console.log(event.keyCode);
		switch(event.keyCode) {

			case 32: // space
				pazuru.game.gameLoop = window.setInterval(function() {

					pazuru.game.move();
				}, 100);
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

	for (var i = 0; i < this.tiles.lines.length; i++) {

		var line = this.tiles.lines[i];
		line.move();
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

Game.prototype.addLine = function(type, row, col, size) {

	var line = new Line(type, row, col, size);
	this.tiles.lines.push(line);
}

Game.prototype.addWall = function(type, row, col, size) {

	var wall = new Wall(type, row, col, size);
	this.tiles.walls.push(wall);
}

Game.prototype.addReflector = function(type, row, col) {

	var reflector = new Reflector(type, row, col);
	this.tiles.reflectors.push(reflector);
}