function MovementCommand(x, y) {

	this.CommandType = "MovementCommand";
	this.x = x;
	this.y = y;
}

MovementCommand.prototype.Execute = function(player, gameServer) {

	gameServer.GameMap.movePlayer(player, this.x, this.y);        
}

MovementCommand.Process = function(player, args) {

	if (args.length == 0) return;
    if (!this.isRoundActive()) return;

	var mapLocation = this.GameMap.getPosition(player);
	if (mapLocation === undefined) return false;

	var x = mapLocation.x;
	var y = mapLocation.y;

    for(var i =0; i < args.length; ++i)
    {
    	var dir = args[i].toLowerCase();

		if (dir !== "up" &&
		dir !== "down" &&
		dir !== "left" &&
		dir !== "right"	)
		{
			continue;
		}
		
		if (dir === "up")
		{
		    y--;
		}
		else if (dir ==="down")
		{
		    y++;
		}
		else if (dir === "left")
		{
		    x--;
		}
		else if (dir === "right")
		{
		    x++;
		}

		var move_cmd = new MovementCommand(x, y);
		player.QueueCommand(move_cmd);
	}
         
	return true;
};

module.exports = MovementCommand;