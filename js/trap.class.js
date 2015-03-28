function Trap(type, row, col) {

	this.type = type;
	this.col = col;
	this.row = row;
	this.startX = (this.col)*config.blockSize;
	this.startY = (this.row)*config.blockSize;
}

Trap.prototype.draw = function(context) {

	var startX1, startY1, endX1, endY1, startX2, startY2, endX2, endY2;
	var gap = config.blockSize/4;
	switch(this.type) {
		case 1:
			startX1 = this.startX+((config.blockSize-gap)/2);
			endX1 = startX1;
			startY1 = this.startY-(config.blockSize/2);
			endY1 = this.startY+(config.blockSize/2);

			startX2 = startX1+gap;
			endX2 = endX1+gap;
			startY2 = startY1;
			endY2 = endY1;
			break;
		case 2:
			startX1 = this.startX-(config.blockSize/2);
			endX1 = this.startX+(config.blockSize/2);
			startY1 = this.startY+((config.blockSize-gap)/2);
			endY1 = startY1;

			startX2 = startX1;
			endX2 = endX1;
			startY2 = startY1+gap;
			endY2 = endY1+gap;
			break;
	}
	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	context.moveTo(startX1, startY1);
	context.lineTo(endX1, endY1);
	context.stroke();
	context.beginPath();
	context.moveTo(startX2, startY2);
	context.lineTo(endX2, endY2);
	context.stroke();
}

Trap.prototype.collidesWithLine = function(line) {

	var startX = this.startX-(.5*config.blockSize); 
	var startY = this.startY-(.5*config.blockSize); 
	var endX = this.startX+(.5*config.blockSize); 
	var endY = this.startY+(.5*config.blockSize); 
	return ((
			(line.startX < startX && endX <= line.endX)
			|| (line.startX > startX && endX >= line.endX)
		) && (
			(startY < line.startY && line.endY <= endY)
			|| (startY > line.startY && line.endY >= endY)
		)
		);
}
