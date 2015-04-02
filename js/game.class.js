function Game(levelNr) {

	this.canvas = null;
	this.context = null;
	this.tiles = null;

	if (levelNr) {
		
		this.levelNr = levelNr;
	}
	else {
		
		this.levelNr = 1;
	}
	if (this.gameLoop) {

		window.clearInterval(this.gameLoop);
		delete (this.gameLoop);
	}
	this.gameLoop = null;
	this.cols = 0;
	this.rows = 0;
	this.init();
}

Game.prototype.init = function() {

	this.loadLevel(this.levelNr);
	Util.startControls(this);
	Util.updateSize(this, true);
}

Game.prototype.loadLevel = function(levelNr) {

	if (levelNr) {
		
		this.levelNr = levelNr;
	}
	$('body').html('<canvas id="game"></canvas>'
		+ '<a id="exitButton" onclick="pazuru.drawTitle()">Exit</a>'
	);
	this.canvas = document.getElementById('game');
	this.context = this.canvas.getContext('2d');
	config.lastWall = null;
	$.getJSON("js/levels/level" + levelNr + ".json", function(data) {
		
		Util.initLevel(pazuru.content, data, true);
		Util.addTouchControls(pazuru.content);
	}).error(function() { 

		document.write("all done");
	});
}

window.onresize = function() {

	Util.updateSize(pazuru.content, true);
	pazuru.content.loadLevel(pazuru.content.levelNr);
}

Game.prototype.draw = function() {

	Util.drawGame(this);
}
