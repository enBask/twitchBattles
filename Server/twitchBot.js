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
           debug: false,
           secure: false,
           floodProtection: false,
           channels: [this.channel]
    });
    
    this.bot.client.owner = this;
            
    this.bot.client.addListener('message', this.get_message);   
    
    this.say_throttle_func = function(message) {
        this.bot.client.say(this.channel, message);
        };    
    this.say = this.say_throttle(this.say_throttle_func, 2000, this);
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
        
        this.owner.gameServer.ProcessChatCommand(from, args, "twitch");
    }    
};

twitchBot.prototype.say_message = function(message) {
    this.say(message);
};


twitchBot.prototype.say_throttle = function (func, t, ctx) {
	var timeout = false
	  , queue = []
	  , qf = function() {
		  var q = queue.shift();
		  if(q) { 
                      q.func(q.msg); timeout = setTimeout(qf, t); 
                  } 
                  else { 
                      timeout = false; 
                  }
	  };
	
	var f = function() {
		var message = arguments[0]
		  , iFunc = function(data) {
			func.call(ctx, data);
		};
		if(timeout && timeout._idleNext) {
                    
                    var addToQueue = true;
                    if (queue.length > 0)
                    {
                        for(var i = 0; i < queue.length; i++)
                        {
                            var item = queue[i];
                            var msg = item.msg;
                            if (msg.length + message.length <= 500)
                            {                                 
                                item.msg += " , " + message;
                                addToQueue = false;
                                break;
                            }                                                                
                        }
                    }

                    if (addToQueue)
                    {
                        queue.push({
                            msg: message,
                            func: iFunc
                        });
                    }
                    
		} else {
    		        queue.push({
                            msg: message,
                            func: iFunc
                        });
			timeout = setTimeout(qf, t);
		}
		return timeout;
	};

	return f;
}

module.exports = twitchBot;

