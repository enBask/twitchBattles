var BattleAPI = rekuire('gameServer/battleApi.js');



function AttackCommand(player) {

	this.attackee = player;
}

AttackCommand.prototype.Execute = function(player, gameServer) {

	BattleAPI.AttackTarget(player, this.attackee, 3, 1, function(wasHit) {

		if (wasHit) {
			gameServer.AddLog(player.username + " attacked " 
				+ this.attackee.username + " for 3 HP");
			player.AddLog("attacked " + this.attackee.username + " for 3 HP");

		}
		else {

			gameServer.AddLog(player.username + " tried to attack " 
				+ this.attackee.username + " and missed");	
			player.AddLog("tried to attack " + this.attackee.username + " and missed");
		}
	});
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