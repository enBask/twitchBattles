var chat_commands = require("./chat_commands.js");
var auth_commands = require("./auth.js");

var DataBase = require("./orm/db.js");
var twitchBot = require("../twitchBot.js");
var nconf = require('nconf');

chat_commands.bind(GameServer);
auth_commands.bind(GameServer);


function GameServer(){
    this.headless_token = "token"; //generate random token

    this.twitch_bot = new twitchBot(nconf.get("twitch_name"),
                    nconf.get("twitch_auth"),
                    nconf.get("twitch_channel"),
                    nconf.get("twitch_command"),
                    this);
                    
    this.db = new DataBase();
                    
    this.twitch_bot.enable();        
    this.bind_chat_commands();
}

GameServer._instance = null;
GameServer.Instance = function(){
    if (GameServer._instance === null)
        GameServer._instance = new GameServer();
    
    return GameServer._instance;
};

GameServer.prototype.get_token = function(password){
    
    if (password === nconf.get("game_server_password"))
    {
        return this.headless_token;
    }
    else
    {
        return "";
    }
};

GameServer.prototype.is_token_valid = function(token) {
    return (token === this.headless_token)
};

GameServer.prototype.get_world_state = function() {

    var date = new Date();
    var world = {
        status: "ok",
        time: date.getSeconds()
    };
    
    return world; 
};



module.exports = GameServer;
