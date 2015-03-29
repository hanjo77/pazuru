function Wall(type, row, col, size) {

	if (!col && config.lastWall) {

		row = config.lastWall.row;
		col = config.lastWall.col;
	}
	this.type = type;
	this.col = col;
	this.row = row;
	this.size = size;
	this.startX = this.col*config.blockSize;
	this.startY = this.row*config.blockSize;
	switch(this.type) {

		case 1: // horizontal
			config.lastWall = {

				"col": this.col+this.size,
				"row": this.row
			}
			break;
		case 2: // horizontal
			config.lastWall = {

				"col": this.col,
				"row": this.row+this.size
			}
			break;
	}
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

	var col, row;
	switch(this.type) {

		case 1: // horizontal
			col = this.startX+(this.size*config.blockSize);
			row = this.startY;
			break;
		case 2: // vertical
			col = this.startX;
			row = this.startY+(this.size*config.blockSize);
			break;
	}
	context.lineTo(col, row);
	config.lastWall = {

		"col": col/config.blockSize,
		"row": row/config.blockSize
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
