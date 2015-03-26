function Line(type, startX, startY, size, maxLength) {

	this.type = type;
	this.startX = startX;
	this.startY = startY;
	this.size = size;
	this.direction = 0;
	if (maxLength) {

		this.maxLength = maxLength;
	}
}

Line.prototype.draw = function(context) {

	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	if (this.maxLength < this.size) {

		this.size += config.speed;
	}
	switch(this.type) {

		case 1: // right
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX+this.size, this.startY);
			break;
		case 2: // down
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX, this.startY+this.size);
			break;
		case 3: // left
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX+this.size, this.startY);
			break;
		case 4: // up
			context.moveTo(this.startX, this.startY);
			context.lineTo(this.startX, this.startY-this.size);
			break;
	}
	context.stroke();
}

Line.prototype.move = function() {

	switch (this.type) {

		case 1: // right;
			this.startX += config.speed;
			break;
		case 2: // down
			this.startY += config.speed;
			break;
		case 3: // left
			this.startX -= config.speed;
			break;
		case 4: // up
			this.startY -= config.speed;
			break;
	}
}