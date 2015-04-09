var LocationHelper = require('./location.js');


function AttackCommand(player) {

	this.CommandType = "AttackCommand";
	this.attackee = player;
}

function map_distance(a, b) {
	var diffX = Math.abs(b.x - a.x);
	var diffY = Math.abs(b.y - a.y);
	var diff = Math.abs(diffX - diffY);
	return diff;
}

AttackCommand.prototype.Execute = function(player, gameServer) {

	var mapLocation = gameServer.GameMap.getPosition(player);
	var targetLocation = gameServer.GameMap.getPosition(this.attackee);

	var distance = map_distance(mapLocation, targetLocation);
	if (distance <= 1)
	{
		this.attackee.Hit(1, player);
	}

}

AttackCommand.Process = function(player, args) {

	if (args.length == 0) return;
    if (!this.isRoundActive()) return;

    var attacking = args[0].toLowerCase();
    var self = this;
    this.GetUserIndirect(attacking, function(user){
           
	    if (user === null) return;

	    var player = self.GetPlayer(user, false);
	    if (player === null) return;

	    var attack_cmd = new AttackCommand(player);
	    player.QueueCommand(attack_cmd, false);
	               
    });         
	return true;
};

module.exports = AttackCommand;