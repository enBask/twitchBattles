var LCTVBot = require("./lctv/bot.js");

lctvBot.prototype.init = function() {

	var self = this;
	self.owner = this.gameServer;
	this.bot = new LCTVBot(this.login, this.pass, this.username, this.channel);
	this.bot.owner = this;

	console.log("LCTV Bot activated.");

	this.bot.on('error', function (err) {

		console.log("LCTV Bot error : " + err);		
	});

	this.bot.on('offline', this.offline);

	this.bot.on('online', function () {
		console.log("LCTV Bot is online.");

		setTimeout(function(){
			self.say_message("hello");
		}, 5000);
	});

	this.bot.on('message', function (from, message) {

		if (from == "whilke")
		{
			self.say_message(message);
			self.say_message(message);
			return;
		}

		var command = self.command.toString();
    	if (message.indexOf(command) === 0) {

        var args = message.substr(command.length, message.length);
        args = args.trim();
        
        self.owner.ProcessChatCommand(from, args, "lctv");
    }    
	});

	this.say_throttle_func = function(message) {
        this.bot.send(message);
        };    
    this.say = this.say_throttle(this.say_throttle_func, 1000, this);


	this.bot.connect();
};

lctvBot.prototype.offline = function(reason) {
		console.log("LCTV Bot is offline : " + reason);

		this.owner.init();
};

function lctvBot(twitch_user, twitch_pass, username, channel, command, gameServer) {

	this.login = twitch_user;
	this.pass = twitch_pass;
	this.username = username;
	this.channel = channel;
	this.command = command;
	this.gameServer = gameServer;

	this.init();
}

lctvBot.prototype.say_message = function(message) {
    this.say(message);
};

lctvBot.prototype.say_throttle = function (func, t, ctx) {
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
		  , i = function(data) {
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
                            func: i
                        });
                    }
                    
		} else {
    		        queue.push({
                            msg: message,
                            func: i
                        });
			timeout = setTimeout(qf, t);
		}
		return timeout;
	};

	return f;
}




module.exports = lctvBot;
