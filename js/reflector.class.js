function Reflector(type, col, row) {

	this.type = type;
	this.col = col;
	this.row = row;
}

Reflector.prototype.draw = function(context) {

	var startX = this.col*config.blockSize;
	var startY = this.row*config.blockSize;
	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	console.log(this.type);
	switch(this.type) {

		case 1:
			context.moveTo(startX, startY);
			context.lineTo(startX, startY+config.blockSize);
			context.lineTo(startX+config.blockSize, startY);
			context.lineTo(startX, startY);
			break;

		case 2:
			context.moveTo(startX, startY);
			context.lineTo(startX, startY+config.blockSize);
			context.lineTo(startX+config.blockSize, startY+config.blockSize);
			context.lineTo(startX, startY);
			break;

		case 3:
			context.moveTo(startX, startY+config.blockSize);
			context.lineTo(startX+config.blockSize, startY+config.blockSize);
			context.lineTo(startX+config.blockSize, startY);
			context.lineTo(startX, startY+config.blockSize);
			break;

		case 4:
			context.moveTo(startX+config.blockSize, startY+config.blockSize);
			context.lineTo(startX+config.blockSize, startY);
			context.lineTo(startX, startY);
			context.lineTo(startX+config.blockSize, startY+config.blockSize);
			break;
	}
	context.stroke();
}

Reflector.prototype.rotateLeft = function() {

	this.type = (this.type < 4) ? this.type+1 : 1; 
}

Reflector.prototype.rotateRight = function() {

	this.type = (this.type > 1) ? this.type-1 : 4; 
}