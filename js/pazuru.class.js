/**
 * Imports a script file
 * @param {String} url Script path relative to the script root folder
 */

function importScript(url) {

	document.write('<scr' + 'ipt type="text/javascript" src="js/' + url + '"></script>');
}

importScript("config.inc.js");
importScript("util.class.js");
importScript("reflector.class.js");
importScript("wall.class.js");
importScript("line.class.js");
importScript("star.class.js");
importScript("trap.class.js");
importScript("brick.class.js");
importScript("game.class.js");
importScript("editor.class.js");

function Pazuru() {
	
	this.handleHash();
}

Pazuru.prototype.drawTitle = function() {
	
	window.location.hash = "title";
	$.get("templates/title.php", function(data) {
		
		$("body").html(data);
	});
}

Pazuru.prototype.loadGame = function(levelNr) {
	
	window.location.hash = levelNr;
	if (this.content && this.content.constructor.name == "Game") {
		
		this.content.loadLevel(levelNr);
	}
	else {
		
		this.content = new Game(levelNr);
	}
}

Pazuru.prototype.loadEditor = function(levelNr) {
	
	window.location.hash = "editor";
	if (levelNr) {
		
		window.location.hash += levelNr;
	}
	this.content = new Editor(levelNr);
}

Pazuru.prototype.startLevel = function(levelNr) {
	
	if (!levelNr) {
		
		levelNr = 1;
	}
	window.location.hash = levelNr;
	$.get("templates/start_level.php?levelNr=" + levelNr, function(data) {
		
		$("body").html(data);
	});
}

Pazuru.prototype.endLevel = function(levelNr) {
	
	$.get("templates/end_level.php?levelNr=" + levelNr, function(data) {
		
		$("body").html(data);
	});
}

Pazuru.prototype.handleHash = function() {
	
	var hash = window.location.hash.replace("#", "");
	var levelNr = parseInt(hash, 10);
	if (!isNaN(levelNr)) {
		
		this.startLevel(levelNr);
	}
	else if (hash.indexOf("editor") > -1) {
	
		levelNr = parseInt(hash.replace("editor", ""), 10);
		if (isNaN(levelNr)) {
			
			this.loadEditor();
		}
		else {
			
			this.loadEditor(levelNr);
		}
	}
	else {
		
		this.drawTitle();
	}
}

var pazuru;

$(document).ready(function() {

	pazuru = new Pazuru();
});

$(window).bind("hashchange", function(e) {
	
	pazuru.handleHash();
});

