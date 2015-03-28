function Wall(type, row, col, size) {

	this.type = type;
	this.col = col;
	this.row = row;
	this.size = size;
	this.startX = this.col*config.blockSize;
	this.startY = this.row*config.blockSize;
}

Wall.prototype.startDraw = function(context) {

	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	context.moveTo(this.startX, this.startY);
}

Wall.endDraw = function(context) {

	context.closePath();
	context.stroke();
}

Wall.prototype.draw = function(context) {

	switch(this.type) {

		case 1: // horizontal
			context.lineTo(this.startX+(this.size*config.blockSize), this.startY);
			break;

		case 2: // vertical
			context.lineTo(this.startX, this.startY+(this.size*config.blockSize));
			break;
	}
}

Wall.prototype.collidesWithLine = function(line) {

	var endX = this.startX+((this.type%2)*this.size*config.blockSize); 
	var endY = this.startY+(((this.type+1)%2)*this.size*config.blockSize); 
	return ((
			(line.startX < this.startX && endX <= line.endX)
			|| (line.startX > this.startX && endX >= line.endX)
		) && (
			(this.startY < line.startY && line.endY <= endY)
			|| (this.startY > line.startY && line.endY >= endY)
		)
		);
}
