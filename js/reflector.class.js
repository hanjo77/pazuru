function Reflector(type, col, row, options) {

	this.type = type;
	this.rotatable = options ? options.rotatable : false;
	this.hideable = options ? options.hideable : false;
	this.hidden = options ? options.hidden : false;
	this.col = col;
	this.row = row;
	this.startX = (this.col*config.blockSize);
	this.startY = (this.row*config.blockSize);
}

Reflector.prototype.draw = function(context) {

	var dot = null;
	context.strokeStyle = '#000000';
	if (this.rotatable) {

		context.strokeStyle = '#ff0000';
	}
	if (this.hideable && this.hidden) {

		context.strokeStyle = '#cccccc';
	}
	context.fillStyle = '#ffffff';
	context.lineWidth = config.lineWidth;
	context.beginPath();
	var padding = config.blockSize/5;
	switch(this.type) {

		case 1:
			context.moveTo(this.startX+padding, this.startY+padding);
			context.lineTo(this.startX+padding, this.startY+config.blockSize-padding);
			context.lineTo(this.startX+config.blockSize-padding, this.startY+padding);
			if (this.hideable) {

				dot = [this.startX+(config.blockSize*.35), this.startY+(config.blockSize*.35)]
			}
			break;

		case 2:
			context.moveTo(this.startX+padding, this.startY+padding);
			context.lineTo(this.startX+padding, this.startY+config.blockSize-padding);
			context.lineTo(this.startX+config.blockSize-padding, this.startY+config.blockSize-padding);
			if (this.hideable) {

				dot = [this.startX+(config.blockSize*.35), this.startY+(config.blockSize*.55)]
			}
			break;

		case 3:
			context.moveTo(this.startX+padding, this.startY+config.blockSize-padding);
			context.lineTo(this.startX+config.blockSize-padding, this.startY+config.blockSize-padding);
			context.lineTo(this.startX+config.blockSize-padding, this.startY+padding);
			if (this.hideable) {

				dot = [this.startX+(config.blockSize*.55), this.startY+(config.blockSize*.55)]
			}
			break;

		case 4:
			context.moveTo(this.startX+config.blockSize-padding, this.startY+config.blockSize-padding);
			context.lineTo(this.startX+config.blockSize-padding, this.startY+padding);
			context.lineTo(this.startX+padding, this.startY+padding);
			if (this.hideable) {

				dot = [this.startX+(config.blockSize*.55), this.startY+(config.blockSize*.35)]
			}
			break;
	}
	context.closePath();
	context.fill();
	context.stroke();
	if (dot) {

		context.fillStyle = context.strokeStyle;
		context.moveTo(this.startX+config.blockSize, this.startY+config.blockSize);
		context.fillRect(dot[0], dot[1], config.lineWidth, config.lineWidth);
	}
}

Reflector.prototype.collidesWithLine = function(line) {

	var middleX = this.startX+(config.blockSize/2); 
	var middleY = this.startY+(config.blockSize/2); 
	var endX = this.startX+config.blockSize; 
	var endY = this.startY+config.blockSize; 
	return (
	(!this.hidden) && 
		(
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
			)
		)
	);
}

Reflector.prototype.rotateLeft = function() {

	this.type = (this.type < 4) ? this.type+1 : 1; 
}

Reflector.prototype.rotateRight = function() {

	this.type = (this.type > 1) ? this.type-1 : 4; 
}