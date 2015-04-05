var ircbot = require('ircbot');

function twitchBot(username, auth, channel, command, gameServer) {
    
    this.enabled = false;
    this.bot = null;
    this.username = username;
    this.auth = auth;
    this.channel = channel;
    this.command = command;
    this.gameServer = gameServer;
    
}

twitchBot.prototype.enable = function() {
    
    if (this.enabled) return;
    
    this.enabled = true;
    this.bot = new ircbot(
        'irc.twitch.tv', this.username, 
        {
           port: 6667,
           userName: this.username,
           realName: this.username,
           password: this.auth,
           autorejoin: true,
           pluginsPath: "./plugins/",
           debug: true,
           secure: false,
           floodProtection: false,
           channels: [this.channel]
    });
    
    this.bot.client.owner = this;
            
    this.bot.client.addListener('message', this.get_message);    
};

twitchBot.prototype.disable = function() {
    
    if (!this.enabled) return;
    
    this.enabled = false;
    this.bot.client.disconnect( function() {        
    });
    
    this.bot = null;
    
};

twitchBot.prototype.get_message = function(from, channel, message) {
    var command = this.owner.command.toString();
    if (message.indexOf(command) === 0) {
        var args = message.substr(command.length, message.length);
        args = args.trim();
        
        this.owner.gameServer.ProcessChatCommand(from, args);
    }    
};

twitchBot.prototype.say_message = function(message) {
    
};

module.exports = twitchBot;

