var BattleAPI = rekuire('gameServer/battleApi.js');
var LocationHelper = rekuire('gameServer/commands/location.js');



function BlockCommand() {
}

BlockCommand.prototype.Execute = function(player, gameServer) {	

	//BattleAPI.SetFlag(player, "ignore");
	gameServer.AddLog(player.username + 
		" is blocking for 2 rounds");

	BattleAPI.SetTimeout(2, function() {

		gameServer.AddLog(player.username + 
			" block timed out");

		//BattleAPI.UnsetFlag(player, "ignore");
	});
}

BlockCommand.Process = function(player, args, callback) {

    if (!this.isRoundActive()) return;

    var self = this;

	var block_cmd = new BlockCommand();
	player.QueueCommand(block_cmd, false);
	callback(block_cmd);

	return true;
};

module.exports = BlockCommand;