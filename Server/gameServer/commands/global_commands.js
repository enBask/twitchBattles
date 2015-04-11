var move_cmd = require("./move_cmd.js");
function GlobalCommands() {

}

GlobalCommands.Commands = [];
GlobalCommands.Commands["move"] = move_cmd.Process;

GlobalCommands.TryProcessCommand = function(ctx, player, cmd, args) {

	if (!player.isActive()) return false;
	
	var callback = GlobalCommands.Commands[cmd];
	if (callback === undefined) return false;

	return callback.call(ctx, player, args);
};


module.exports = GlobalCommands;