function Brick(col, row) {

	this.col = col;
	this.row = row;
	this.startX = this.col*config.blockSize;
	this.startY = this.row*config.blockSize;
}

Brick.prototype.draw = function(context) {

	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();

	var padding = config.blockSize/5;
	var width = config.blockSize-(2*padding);
	var height = width;
	context.moveTo(this.startX+padding, this.startY+padding);
	context.lineTo(this.startX+padding+width, this.startY+padding);
	context.lineTo(this.startX+padding+width, this.startY+padding+width);
	context.lineTo(this.startX+padding, this.startY+padding+width);
	context.closePath();
	// context.fill();
	context.stroke();
	context.moveTo(this.startX+padding, this.startY+padding+(height/3));
	context.lineTo(this.startX+padding+width, this.startY+padding+(height/3));
	context.stroke();
	context.moveTo(this.startX+padding, this.startY+padding+((height/3)*2));
	context.lineTo(this.startX+padding+width, this.startY+padding+((height/3)*2));
	context.stroke();
}

Brick.prototype.collidesWithLine = function(line) {

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
