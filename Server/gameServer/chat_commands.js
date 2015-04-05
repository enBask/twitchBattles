var ChatCommands = {
 
  bind: function(obj) {
  
    // Binds a chat command to the callback.
    obj.prototype.BindChatCommand = function (cmd, callback) {
        this.ChatCommands[cmd] = callback;
    };
    
    // Processes a chat command.    
    obj.prototype.ProcessChatCommand = function(who, command) {
        
        // If command empty, stop.
        if (command === "") 
          return; 

        // Get all commands.
        var parts = command.split(" ");
        
        // Check that commands were entered, and not blank.
        if (parts.length < 1) 
          return;
            
        // Command is first part
        var cmd = parts[0];

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
          callback(who, args);
        }
    };

    // Test chat command
    obj.prototype.TestChatCommand = function (who, args) {
        console.log("TEST command: " + who + " | " + args.toString());
    };

    // Register chat command
    obj.prototype.RegisterChatCommand = function(who, args) {
        if (args.length !== 1) 
          return;

        console.log("RegisterChatCommand who: " + who + " args: " + args);

        // TODO: This causes an undefined error.
        this.RegisterUser(who, args);
    };

    // Binds all chat commands.
    obj.prototype.BindChatCommands = function() {

        this.ChatCommands = {};

        // Bind all chat commands.
        this.BindChatCommand("test", this.TestChatCommand);
        this.BindChatCommand("register", this.RegisterChatCommand);
    };
  }
};

module.exports = ChatCommands;