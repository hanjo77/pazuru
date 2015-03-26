function Wall(type, col, row, size) {

	this.type = type;
	this.col = col;
	this.row = row;
	this.size = size;
}

Wall.prototype.draw = function(context) {

	var startX = this.col*config.blockSize;
	var startY = this.row*config.blockSize;
	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	switch(this.type) {

		case 1: // horizontal
			context.moveTo(startX, startY);
			context.lineTo(startX+(this.size*config.blockSize), startY);
			break;

		case 2: // vertical
			context.moveTo(startX, startY);
			context.lineTo(startX, startY+(this.size*config.blockSize));
			break;
	}
	context.stroke();
}