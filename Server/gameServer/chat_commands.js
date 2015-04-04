module.exports = {
bind: function(obj) {
    
obj.prototype.bind_chat_command = function (cmd, callback)
{
    this.chat_commands[cmd] = callback;
};
    
obj.prototype.process_chat_command = function(who, what) {
    
    if (what === "") return; 
    var parts = what.split(" ");
    if (parts.length < 1) return;
        
    var cmd = parts[0];
    var args = [];
    if  (parts.length > 1)
    {
       parts.shift();
       args = parts;
   }
   
   var callback = this.chat_commands[cmd];
   if (callback !== undefined)
   {
       callback(who, args);
   }
};

obj.prototype.chat_cmd_test = function (who, args) {
    console.log("TEST command: " + who + " | " + args.toString());
};

obj.prototype.chat_cmd_register = function(who, args) {
    
    if (args.length !== 1) return;
    this.register_user(who, args[0]);
};


obj.prototype.bind_chat_commands = function() {
    
    this.chat_commands = {};
    
     //bind all chat commands.
    this.bind_chat_command("test", this.chat_cmd_test);
    this.bind_chat_command("register", this.chat_cmd_register);
};

}};