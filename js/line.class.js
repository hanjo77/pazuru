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

	var shades = [
		// "#ffffff",
		"#cccccc",
		"#999999",
		"#666666",
		"#333333"
	];
	var len = ((config.blockSize)/shades.length);
	for (var i = 0; i < shades.length; i++) {

		if (
			((i*len) <= Math.abs(this.endX - this.startX))
			|| ((i*len) <= Math.abs(this.endY - this.startY))
			) {
			
			context.strokeStyle = shades[i];
			context.lineWidth = config.lineWidth*1.5;
			context.beginPath();
			context.moveTo(this.startX+(i*len*motion[0]), this.startY+(i*len*motion[1]));
			context.lineTo(this.startX+((i+1)*len*motion[0]), this.startY+((i+1)*len*motion[1]));
			context.stroke();				
		}
	}

	if (this.startSkidmark && this.endSkidmark) {

		var dist = [
			Math.ceil(this.endSkidmark[0]-this.startSkidmark[0]), 
			Math.ceil(this.endSkidmark[1]-this.startSkidmark[1])
		];
		var type;
		if (dist[0] != 0) {

			type = 1;
		}
		else if (dist[1] != 0) {

			type = 2;
		} 

		dist = dist[(type+1)%2]/config.blockSize;

		if (!this.skidmark) {

			this.skidmark = Util.addWall(pazuru.content,
				type, 
				(this.startSkidmark[1]/config.blockSize)-config.padding, 
				(this.startSkidmark[0]/config.blockSize)-config.padding, 
				dist,
				true);
		}
		else {

			this.skidmark.size = dist;
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