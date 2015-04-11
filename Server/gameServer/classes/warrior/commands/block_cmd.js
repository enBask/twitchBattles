var LocationHelper = rekuire('gameServer/commands/location.js');


function AttackCommand(player) {

	this.attackee = player;
}

function map_distance(a, b) {
	var diffX = Math.abs(b.x - a.x);
	var diffY = Math.abs(b.y - a.y);
	var diff = diffX + diffY;
	return diff;
}

AttackCommand.prototype.Execute = function(player, gameServer) {

	var mapLocation = gameServer.GameMap.getPosition(player);
	var targetLocation = gameServer.GameMap.getPosition(this.attackee);

	var distance = map_distance(mapLocation, targetLocation);
	if (distance <= 1)
	{
		this.attackee.Hit(1, player);
		gameServer.AddLog(player.username + " attacked " + this.attackee.username + " for 1 HP");
		player.AddLog("attacked " + this.attackee.username + " for 1 HP");
	}
	else
	{
		gameServer.AddLog(player.username + " tried to attack " + this.attackee.username + " and missed");	
		player.AddLog("tried to attack " + this.attackee.username + " and missed");
	}

}

AttackCommand.Process = function(player, args, callback) {

	if (args.length == 0) return;
    if (!this.isRoundActive()) return;

    var attacking = args[0].toLowerCase();

    attacking = this.ResolvePlayer(attacking);

    var self = this;
    this.GetUserIndirect(attacking, function(user){
           
	    if (user === null) return;

	    var attacked_player = self.GetPlayer(user, false);
	    if (attacked_player === null) return;

	    var attack_cmd = new AttackCommand(attacked_player);
	    player.QueueCommand(attack_cmd, false);
	    callback(attack_cmd);
	               
    });         
	return true;
};

module.exports = AttackCommand;