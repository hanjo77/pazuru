function Wall(type, col, row, size) {

	this.type = type;
	this.col = col;
	this.row = row;
	this.size = size;
	this.startX = this.col*config.blockSize;
	this.startY = this.row*config.blockSize;
}

Wall.prototype.draw = function(context) {

	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	switch(this.type) {

		case 1: // horizontal
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX+(this.size*config.blockSize), this.startY);
			break;

		case 2: // vertical
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX, this.startY+(this.size*config.blockSize));
			break;
	}
	context.stroke();
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
