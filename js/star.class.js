function Star(col, row) {

	this.col = col;
	this.row = row;
	this.startX = (this.col+.5)*config.blockSize;
	this.startY = (this.row+.5)*config.blockSize;
}

Star.prototype.draw = function(context) {

	context.strokeStyle = '#ff9900';
	context.fillStyle = '#ffff00';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	context.moveTo(this.startX, this.startY-(config.blockSize*.5));
	context.lineTo(this.startX+(config.blockSize*.2), this.startY-(config.blockSize*.2));
	context.lineTo(this.startX+(config.blockSize*.5), this.startY);
	context.lineTo(this.startX+(config.blockSize*.2), this.startY+(config.blockSize*.2));
	context.lineTo(this.startX, this.startY+(config.blockSize*.5));
	context.lineTo(this.startX-(config.blockSize*.2), this.startY+(config.blockSize*.2));
	context.lineTo(this.startX-(config.blockSize*.5), this.startY);
	context.lineTo(this.startX-(config.blockSize*.2), this.startY-(config.blockSize*.2));
	context.closePath();
	context.fill();
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
