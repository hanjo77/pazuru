function Line(type, startX, startY, size, targetSize) {

	this.type = type;
	this.startX = startX;
	this.startY = startY;
	this.endX = startX;
	this.endY = startY;
	this.size = size;
	this.started = false;
	if (targetSize) {

		this.targetSize = targetSize;
	}
	else {

		this.targetSize = size;
	}
	switch (this.type) {

		case 1: // right;
			this.endX = this.startX + this.size;
			break;
		case 2: // down
			this.endY =  this.startY + this.size;
			break;
		case 3: // left
			this.endX = this.startX - this.size;
			break;
		case 4: // up
			this.endY = this.startY - this.size;
			break;
	}
}

Line.prototype.draw = function(context) {

	context.strokeStyle = '#000000';
	context.lineWidth = config.lineWidth*1.5;
	context.beginPath();
	if (this.targetSize > this.size) {

		this.size += config.speed;
		if (this.targetSize < this.size) {

			this.size = this.targetSize;
		}
	}
	else if (this.targetSize < this.size) {

		this.size -= config.speed;
		if (this.targetSize > this.size) {

			this.size = this.targetSize;
		}
	}
	var motion = [0, 0];
	switch (this.type) {

		case 1: // right
			this.endX = this.startX+this.size;
			this.endY = this.startY;
			motion[0] = 1;
			break;
		case 2: // down
			this.endX = this.startX;
			this.endY = this.startY+this.size;
			motion[1] = 1;
			break;
		case 3: // left
			this.endX = this.startX-this.size;
			this.endY = this.startY;
			motion[0] = -1;
			break;
		case 4: // up
			this.endX = this.startX;
			this.endY = this.startY-this.size;
			motion[1] = -1;
			break;
	}
	context.moveTo(this.startX, this.startY);
	context.lineTo(this.endX, this.endY);
	context.stroke();

	if (this.targetSize >= this.size) {

		var shades = [
			"#ffffff",
			"#cccccc",
			"#999999",
			"#666666",
			"#333333"
		];
		var len = ((this.size/2)/shades.length);
		for (var i = shades.length-1; i >= 0; i--) {

			if (i*len <= this.size) {

				context.strokeStyle = shades[i];
				context.lineWidth = config.lineWidth*1.5;
				context.beginPath();
				context.moveTo(this.startX, this.startY);
				context.lineTo(this.startX+(i*len*motion[0]), this.startY+(i*len*motion[1]));
				context.stroke();
			}
		}
	}
}

Line.prototype.move = function() {

	switch (this.type) {

		case 1: // right;
			this.endX += config.speed;
			if (this.targetSize > this.size) {

				this.size += config.speed;
			}
			else {

				this.startX += config.speed;
			}
			break;
		case 2: // down
			this.endY += config.speed;
			if (this.targetSize > this.size) {

				this.size += config.speed;
			}
			else {

				this.startY += config.speed;
			}
			break;
		case 3: // left
			this.endX -= config.speed;
			if (this.targetSize > this.size) {

				this.size += config.speed;
			}
			else {

				this.startX -= config.speed;
			}
			break;
		case 4: // up
			this.endY -= config.speed;
			if (this.targetSize > this.size) {

				this.size += config.speed;
			}
			else {

				this.startY -= config.speed;
			}
			break;
	}
}