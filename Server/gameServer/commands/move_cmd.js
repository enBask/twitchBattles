var LocationHelper = require('./location.js');


function MovementCommand(x, y) {

	this.CommandType = "MovementCommand";
	this.x = x;
	this.y = y;
}



MovementCommand.prototype.Execute = function(player, gameServer) {

	var mapLocation = gameServer.GameMap.getPosition(player);

	var diffX = Math.abs(mapLocation.x - this.x);
	var diffY = Math.abs(mapLocation.y - this.y);

	var diff = Math.abs(diffX - diffY);
	if (diff <= player.move_speed)
	{
		gameServer.GameMap.movePlayer(player, this.x, this.y);        
	}
}

MovementCommand.Process = function(player, args) {

	if (args.length == 0) return;
    if (!this.isRoundActive()) return;

	var mapLocation = this.GameMap.getPosition(player);
	if (mapLocation === undefined) return false;

	var new_location = {x:mapLocation.x, y:mapLocation.y};

    for(var i =0; i < args.length; ++i)
    {
    	new_location = LocationHelper.Lookup(new_location, args[i]);
		var move_cmd = new MovementCommand(new_location.x, new_location.y);
		player.QueueCommand(move_cmd);
	}
         
	return true;
};

module.exports = MovementCommand;