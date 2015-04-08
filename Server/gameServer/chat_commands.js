var GlobalCommands = require("./commands/global_commands.js");

var ChatCommands = {
 
  bind: function(obj) {
  
    // Binds a chat command to the callback.
    obj.prototype.BindChatCommand = function (cmd, callback) {
        this.ChatCommands[cmd] = callback;
    };
    
    // Processes a chat command.    
    obj.prototype.ProcessChatCommand = function(who, command, src) {
        
        //convert all users to lowercase.
        who = who.toLowerCase();
        
        // If command empty, stop.
        if (command === "") 
          return; 

        // Get all commands.
        var parts = command.split(" ");
        
        // Check that commands were entered, and not blank.
        if (parts.length < 1) 
          return;
            
        // Command is first part
        var cmd = parts[0].toLowerCase();

        // Arguments, anything after the command.
        var args = [];

        // If arguements exist, set args.
        if (parts.length > 1) {
          parts.shift();
          args = parts;
         }
        
        // Get the callback for the command and execute if exists.
        var callback = this.ChatCommands[cmd];

        if (callback !== undefined) {
           callback.call(this, who, src, args);
        }
        else {

            //convert who into a player object.
            var self = this;
            this.GetUser(src, who, function(user){

                if (user !== null) {

                    var player = self.GetPlayer(user);  

                    if (!GlobalCommands.TryProcessCommand(self, player, cmd, args))
                    {
                        //TODO: check players class commnads.
                    }
                } 
            });

            
        }
    };

    // Register chat command
    obj.prototype.RegisterChatCommand = function(who, src, args) {
        if (args.length !== 1) 
          return;

        var self = this;
        this.ActivateUser(src, who, args[0], function(result) {
            if (result)
            {
                self.TwitchBot.say_message(who + " is now registered for battle!");
            }
        });
    };
    
    obj.prototype.CheckinChatCommand = function(who, src, args) {
        
        if (this.isRoundActive()) return;
        
        var self = this;
        this.GetUser(src, who, function(user){
           
            if (user === null) return;
            
            if (self.CheckinForRound(user))
            {
                var player = self.GetPlayer(user);                
                self.GameMap.addPlayer(player);
                
                self.TwitchBot.say_message(who + " is checked in for the next battle!");                        
            }
        });
    };

    // Binds all chat commands.
    obj.prototype.BindChatCommands = function() {

        this.ChatCommands = {};

        // Bind all chat commands.
        this.BindChatCommand("register", this.RegisterChatCommand);
        this.BindChatCommand("checkin", this.CheckinChatCommand);
    };
  }
};

module.exports = ChatCommands;