var Database = require("./orm/db.js");
var TwitchBot = require("../twitchBot.js");
var nconf = require('nconf');

var Player = require("./player.js")
var GameMap = require("./map.js");


var ChatCommands = require("./chat_commands.js");
var AuthCommands = require("./auth.js");
AuthCommands.bind(GameServer);
ChatCommands.bind(GameServer);

// Constructor - Do not use externally - can't make this private unfortunately.
function GameServer() {
    // Generate Token
    this.Token = this.GenerateToken();
    // Setup Twitch Bot Instance.
    this.TwitchBot = new TwitchBot(
        nconf.get("twitch_name"),
        nconf.get("twitch_auth"),
        nconf.get("twitch_channel"),
        nconf.get("twitch_command"),
        this);
    this.TwitchBot.enable();

    console.log("TwitchBot running.");

    // Bind chat commands.
    this.BindChatCommands();
    // Setup Database Instance.
    this.Database = new Database();
       
    this.round_active = false;
    this.players = [];
    this.GameMap = new GameMap();    
}

// Gets the current instance of the GameServer - Use this instead of the constructor above.
GameServer.Instance = function () {
    if (GameServer._instance === null) {
        return GameServer._instance = new GameServer();
    }
    return GameServer._instance;
};

// Generates a new token.
GameServer.prototype.GenerateToken = function () {
    return "token";
};

// Gets the token if the password is valid.
GameServer.prototype.GetToken = function (password) {
    if (password === "password") {
        return this.Token;
    }
    return "";
};

// Validates a token.
GameServer.prototype.ValidateToken = function (token) {
    return (token === this.Token);
};

// Gets the current world state.
GameServer.prototype.GetWorldState = function () {
       
    var world = {
        status: "OK",
        players: this.players,
        round_active: this.round_active
    };
    return world;
};

GameServer.prototype.GetPlayer = function(ormUser) {
    
    for(i = 0; i < this.players.length; ++i )
    {
        var chk = this.players[i];
        if (chk.username === ormUser.username)
        {
            return chk;
        }              
    }
    
    var chk = new Player(ormUser);
    this.players.push(chk);
    return chk;
};

GameServer.prototype.CheckinForRound = function (user) {
    
    var player = this.GetPlayer(user);
    
    if (player.checkedIn) return false;
    
    player.checkedIn = true;
    return true;
};

GameServer.prototype.isRoundActive = function() {
    return this.round_active;
};

GameServer.prototype.setRoundActive = function(flag) {
    this.round_active = flag;
};

GameServer.prototype.startRound = function(){

    //TODO move timeouts to config file.

    var self = GameServer.Instance();
    self.setRoundActive(true);
    self.TwitchBot.say_message("Round is now active for 60 seconds! input commands.");
    setTimeout( function(){
        
        self.setRoundActive(false);
        self.TwitchBot.say_message("Round is now closed, free to !battle checkin");
        self.executeRound();
        setTimeout(self.startRound, 10000);
        
    },10000);
      
};

GameServer.prototype.executeRound = function(){
    
    for(i = 0; i < this.players.length; ++i )
    {
        var player = this.players[i];
        if (player.checkedIn)
        {
            player.ExecuteQueue(this);
        }
    }
};

// Holds the instance of the GameServer
GameServer._instance = null;


module.exports = GameServer;
