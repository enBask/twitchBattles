var Database = require("./orm/db.js");
var TwitchBot = require("../twitchBot.js");
var nconf = require('nconf');

var ChatCommands = require("./chat_commands.js");
var AuthCommands = require("./auth.js");

ChatCommands.bind(GameServer);
AuthCommands.bind(GameServer);

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
    this.BindChatCommands();
    // Setup Database Instance.
    this.Database = new Database();

    console.log(this);
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
    var date = new Date();
    var world = {
        status: "OK",
        time: date.getSeconds()
    };
    return world;
};

// Holds the instance of the GameServer
GameServer._instance = null;


module.exports = GameServer;
