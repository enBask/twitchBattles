var BattleAPI = rekuire('gameServer/battleApi.js');


function CleaveCommand(location) {

	this.location = location;
}

CleaveCommand.prototype.Execute = function(player, gameServer) {

	var self = this;
	BattleAPI.AttackLocation(player, this.location, 1, 1, function(wasHit) {

		var location_text = self.location.location();
		if (wasHit) {
			gameServer.AddLog(player.username + " cleave "
				+ location_text + " for 1 HP");
			player.AddLog("cleave " + location_text + " for 1 HP");

		}
		else {

			gameServer.AddLog(player.username + " tried to cleave " 
				+ location_text + " and missed");	
			player.AddLog("tried to cleave " + location_text + " and missed");
		}
	});
}

CleaveCommand.Process = function(player, args, callback) {

	if (args.length == 0) return;
    if (!this.isRoundActive()) return;

    var lookup = args[0].toLowerCase();

    var location = BattleAPI.ResolveLocation(player, lookup);

	var cleave_cmd = new CleaveCommand(location);
	player.QueueCommand(cleave_cmd, false);
	callback(cleave_cmd);
	return true;
};

module.exports = CleaveCommand;