var BattleServer = rekuire('gameServer/server.js');
var BattleAPI = rekuire('gameServer/battleApi.js');
var LocationHelper = rekuire('gameServer/commands/location.js');



function BlockCommand() {
}

BlockCommand.prototype.OnHitCallback = function (attacker, attacked) {
	
	var gameServer = BattleServer.Instance();
	gameServer.AddLog(attacked.username + " blocked attack from " + attacker.username);	
	BattleAPI.CancelAction();		
};


BlockCommand.prototype.Execute = function(player, gameServer) {	

	BattleAPI.RegisterOnce( "hit", this.OnHitCallback, this, player );
	
	gameServer.AddLog(player.username + 
		" is blocking for 2 rounds");

	BattleAPI.SetTimeout(2, function() {

		gameServer.AddLog(player.username + 
			" block timed out");
			
		BattleAPI.Unregister("hit", this.OnHitCallback, player);
	});
}

BlockCommand.Process = function(player, args, callback) {

    if (!this.isRoundActive()) return;

	var block_cmd = new BlockCommand();
	player.QueueCommand(block_cmd, false);
	callback(block_cmd);

	return true;
};

module.exports = BlockCommand;