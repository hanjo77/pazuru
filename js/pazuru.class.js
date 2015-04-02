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
	
	this.drawTitle();
	this.content;
}

Pazuru.prototype.drawTitle = function() {
	
	$.get("templates/title.php", function(data) {
		
		$("body").html(data);
	});
}

Pazuru.prototype.loadGame = function() {
	
	this.content = new Game();
}

Pazuru.prototype.loadEditor = function() {
	
	this.content = new Editor();
}

var pazuru;

$(document).ready(function() {

	pazuru = new Pazuru();
});
