function Reflector(type, col, row) {

	this.type = type;
	this.col = col;
	this.row = row;
	this.startX = this.col*config.blockSize;
	this.startY = this.row*config.blockSize;
}

Reflector.prototype.draw = function(context) {

	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	switch(this.type) {

		case 1:
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX, this.startY+config.blockSize);
			context.lineTo(this.startX+config.blockSize, this.startY);
			context.lineTo(this.startX, this.startY);
			break;

		case 2:
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX, this.startY+config.blockSize);
			context.lineTo(this.startX+config.blockSize, this.startY+config.blockSize);
			context.lineTo(this.startX, this.startY);
			break;

		case 3:
			context.moveTo(this.startX, this.startY+config.blockSize);
			context.lineTo(this.startX+config.blockSize, this.startY+config.blockSize);
			context.lineTo(this.startX+config.blockSize, this.startY);
			context.lineTo(this.startX, this.startY+config.blockSize);
			break;

		case 4:
			context.moveTo(this.startX+config.blockSize, this.startY+config.blockSize);
			context.lineTo(this.startX+config.blockSize, this.startY);
			context.lineTo(this.startX, this.startY);
			context.lineTo(this.startX+config.blockSize, this.startY+config.blockSize);
			break;
	}
	context.stroke();
}

Reflector.prototype.collidesWithLine = function(line) {

	var middleX = this.startX+(config.blockSize/2); 
	var middleY = this.startY+(config.blockSize/2); 
	var endX = this.startX+config.blockSize; 
	var endY = this.startY+config.blockSize; 
	return (
	(
		(line.type == 1)
		&& (this.startY < line.startY && line.startY < endY)
		&& (
			(
				(this.type > 2) 
				&& (
					(line.startX <= middleX && middleX <= line.endX) 
					|| (line.startX >= middleX && middleX >= line.endX) 
				)
			) || (
				(this.type < 3)
				&& (
					(line.startX <= this.startX && this.startX <= line.endX) 
					|| (line.startX >= this.startX && this.startX >= line.endX) 
				)
			)
		)
	) || (
		(line.type == 2) 
		&& (this.startX < line.startX && line.startX < endX)
		&& (
			(
				(this.type > 1 && this.type < 4) 
				&& (
					(line.startY <= middleY && middleY <= line.endY) 
					|| (line.startY >= middleY && middleY >= line.endY) 
				)
			) || (
				(this.type < 2 || this.type > 3)
				&& (
					(line.startY <= this.startY && this.startY <= line.endY) 
					|| (line.startY >= this.startY && this.startY >= line.endY) 
				)
			)
		)
	) || (
		(line.type == 3) 
		&& (this.startY < line.startY && line.startY < endY)
		&& (
			(
				(this.type < 3)
				&& (
					(line.startX <= middleX && middleX <= line.endX) 
					|| (line.startX >= middleX && middleX >= line.endX)
				)
			) || (
				(this.type > 2)
				&& (
					(line.startX <= endX && endX <= line.endX) 
					|| (line.startX >= endX && endX >= line.endX) 
				)
			)
		)
	) || (
		(line.type == 4) 
		&& (this.startX < line.startX && line.startX < endX)
		&& (
			(
				(this.type < 2 || this.type > 3) 
				&& (
					(line.startY <= middleY && middleY <= line.endY) 
					|| (line.startY >= middleY && middleY >= line.endY) 
				)
			) || (
				(this.type > 1 && this.type < 4)
				&& (
					(line.startY <= endY && endY <= line.endY) 
					|| (line.startY >= endY && endY >= line.endY)
				)
			)
		)
	));
}

Reflector.prototype.rotateLeft = function() {

	this.type = (this.type < 4) ? this.type+1 : 1; 
}

Reflector.prototype.rotateRight = function() {

	this.type = (this.type > 1) ? this.type-1 : 4; 
}