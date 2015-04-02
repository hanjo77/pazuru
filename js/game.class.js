function Game() {

	this.canvas = null;
	this.context = null;
	this.tiles = null;

	this.levelNr = 1;
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

	$('body').html('<canvas id="game"></canvas>');
	this.canvas = document.getElementById('game');
	this.context = this.canvas.getContext('2d');
	config.lastWall = null;
	$.getJSON("js/levels/level" + levelNr + ".json", function(data) {
		
		Util.initLevel(pazuru.game, data, true);
	}).error(function() { 

		document.write("all done");
	});
}

window.onresize = function() {

	Util.updateSize(pazuru.game, true);
	pazuru.game.loadLevel(pazuru.game.levelNr);
}

Game.prototype.draw = function() {

	Util.drawGame(this);
}
