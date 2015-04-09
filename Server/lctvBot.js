var LCTVBot = require("./lctv/bot.js");

function lctvBot(twitch_user, twitch_pass, username, channel, command, gameServer) {

	var self = this;
	self.command = command;
	self.owner = gameServer;
	this.bot = new LCTVBot(twitch_user, twitch_pass, username, channel);

	console.log("LCTV Bot activated.");

	this.bot.on('error', function (err) {
		console.log("LCTV Bot error : " + err);
	});

	this.bot.on('offline', function (reason) {
		console.log("LCTV Bot is offline : " + reason);
	});

	this.bot.on('online', function () {
		console.log("LCTV Bot is online.");
	});

	this.bot.on('message', function (from, message) {

		var command = self.command.toString();
    	if (message.indexOf(command) === 0) {

        var args = message.substr(command.length, message.length);
        args = args.trim();
        
        self.owner.ProcessChatCommand(from, args, "lctv");
    }    
	});

	this.bot.connect();
}

lctvBot.prototype.say_message = function(message) {
    this.bot.send(message);
};



module.exports = lctvBot;
