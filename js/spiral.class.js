function Spiral(col, row) {

	this.col = col;
	this.row = row;
	this.startX = (this.col+.5)*config.blockSize;
	this.startY = (this.row+.5)*config.blockSize;
}

Spiral.prototype.draw = function(context) {

	context.strokeStyle = '#0000ff';
	context.fillStyle = '#ffffff';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	context.moveTo(this.startX, this.startY);
	var tmpX = 0;
	var tmpY = this.startY-(config.blockSize*.5);
	var padding = config.blockSize/5;
	while (Math.abs(tmpX) <= (config.blockSize/2)-padding) {

		var lastX = tmpX;
		currentX = tmpX > 0 ? -1 : 1;
		tmpX = currentX*((.1*config.blockSize)+Math.abs(tmpX));
		var middleX = (tmpX-lastX)*(Math.PI/10);
		context.bezierCurveTo(this.startX+lastX,this.startY-(1.1*tmpX), this.startX+tmpX,this.startY-(1.1*tmpX),this.startX+tmpX,this.startY);
	}
	// context.closePath();
	// context.fill();
	context.stroke();
}

Spiral.prototype.collidesWithLine = function(line) {

	var startX = this.startX-(.5*config.blockSize); 
	var startY = this.startY-(.5*config.blockSize); 
	var endX = this.startX+(.5*config.blockSize); 
	var endY = this.startY+(.5*config.blockSize); 
	return (
		line.endX >= startX 
		&& line.endX <= endX 
		&& line.endY >= startY 
		&& line.endY <= endY
	);
}
