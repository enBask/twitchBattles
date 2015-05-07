function Animation(data) {
	
	this.Image = data.image;
	this.Frames = data.frames;
	this.Duration = data.duration;
	this.StartPoint = data.start_point;
	this.EndPoint = data.end_point;
	this.Moves = data.moves;
}


module.exports = Animation;