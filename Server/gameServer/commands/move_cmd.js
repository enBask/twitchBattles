var LocationHelper = require('./location.js');


function MovementCommand(x, y) {

	this.CommandType = "MovementCommand";
	this.x = x;
	this.y = y;
}

MovementCommand.prototype.Execute = function(player, gameServer) {

	if (player.speed_points <= 0) return;

	var mapLocation = gameServer.GameMap.getPosition(player);

	var path = gameServer.GameMap.caluclatePath(mapLocation, this);
	if (path == null) return;

	var prev_node = [mapLocation.x, mapLocation.y];
	for(var i = 0; i < path.length; ++i) {
		var node = path[i];

		var diffX = Math.abs(prev_node[0] - node[0]);
		var diffY = Math.abs(prev_node[1] - node[1]);
		var diff = Math.abs(diffX - diffY);
		
		if (diff <= player.speed_points) {
			gameServer.GameMap.movePlayer(player, node[0], node[1]);
			player.speed_points -= diff;        
		}
		else {
			return;
		}

		prev_node = node;
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