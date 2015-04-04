function Star(col, row) {

	this.col = col;
	this.row = row;
	this.startX = (this.col+.5)*config.blockSize;
	this.startY = (this.row+.5)*config.blockSize;
}

Star.prototype.draw = function(context) {

	var outerPoint = config.blockSize*.3;
	var innerPoint = config.blockSize*.1;
	context.strokeStyle = '#ffcc00';
	context.fillStyle = '#ffff00';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	context.moveTo(this.startX, this.startY-outerPoint);
	context.lineTo(this.startX+innerPoint, this.startY-innerPoint);
	context.lineTo(this.startX+outerPoint, this.startY);
	context.lineTo(this.startX+innerPoint, this.startY+innerPoint);
	context.lineTo(this.startX, this.startY+outerPoint);
	context.lineTo(this.startX-innerPoint, this.startY+innerPoint);
	context.lineTo(this.startX-outerPoint, this.startY);
	context.lineTo(this.startX-innerPoint, this.startY-innerPoint);
	context.closePath();
	// context.fill();
	context.stroke();
}

Star.prototype.collidesWithLine = function(line) {

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
