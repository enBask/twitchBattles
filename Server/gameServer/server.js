var fs = require("fs"),
path = require("path");
var pq = require("priority_queue");

var BattleAPI = require("./battleApi.js");

var Database = require("./orm/db.js");
var TwitchBot = require("../twitchBot.js");
var nconf = require('nconf');

var AnimationSystem = require("./animations/animationSystem.js");
var Class = require("./classes/class.js");
var Player = require("./player/player.js")
var GameMap = require("./map.js");

var ChatCommands = require("./chat_commands.js");
var AuthCommands = require("./auth.js");

AuthCommands.bind(GameServer);
ChatCommands.bind(GameServer);

if (nconf.get("lctv_enabled") == true) {
    var lctv_bot = require("../lctvBot.js");
}



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

    if(lctv_bot) {

        this.LCTVBot = new lctv_bot(
            nconf.get("lctv_auth_name"),
            nconf.get("lctv_auth_pass"),
            nconf.get("lctv_username"),
            nconf.get("lctv_channel"),
            nconf.get("twitch_command"),
            this);

        console.log("LCTV Bot running.");
    }

    console.log("TwitchBot running.");
    

    // Bind chat commands.
    this.BindChatCommands();
    // Setup Database Instance.
    this.Database = new Database();

    this.game_active = false; 
    this.checkin_active = false;      
    this.round_active = false;
    this.round_timer = 0;
    this.round_timer_id = 0;
    this.round_length = nconf.get("round_length");
    this.between_round_length = nconf.get("between_round_length");
    this.players = [];
    this.RoundLog = [];
    this.GameMap = new GameMap();    
    this.AnimationSystem = new AnimationSystem();
    this.RoundAnimations = [];
}

GameServer.prototype.say_message = function(message) {
    this.TwitchBot.say_message(message);
    if (this.LCTVBot) {
        this.LCTVBot.say_message(message);
    }
};


// Gets the current instance of the GameServer - Use this instead of the constructor above.
GameServer.Instance = function () {
    if (GameServer._instance === null) {
        GameServer._instance = new GameServer();
        GameServer._instance.AnimationSystem.Load();
        GameServer._instance.LoadClasses();
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

GameServer.prototype.AddLog = function(msg) {

    this.RoundLog.push(msg);
};

GameServer.prototype.AddAnimation = function(animation) {
    this.RoundAnimations.push(animation);
}

GameServer.prototype.ClearLog = function() {
    this.RoundLog = [];
    this.RoundAnimations = [];
};

GameServer.prototype.LoadClasses = function () {
    this.classMap = [];
    var self = this;

    var class_path = "./gameServer/classes";
    fs.readdir(class_path, function(err, files) {

        if (err) {
            throw err;
        }

        files.map(function (file) {
            return path.join(class_path, file);
        }).filter(function (file) {
            return fs.statSync(file).isDirectory();
        }).forEach(function (file) {

            var folder_path = file.replace("gameServer/", "./");
            file = folder_path + "/package.json";
            var classdata = require(file);
            classdata.folder_path = folder_path.replace("./classes/", "./");
            self.classMap[classdata.name] = classdata;
        });

    });
}

GameServer.prototype.ExtractPlayers = function () {

    var player_data = [];
    this.players.forEach(function(player, idx){

        player_data.push({
            username: player.username,
            number: idx+1,
            service: player.service,
            checkedin: player.checkedIn,
            active: player.active,
            color: player.color,
            attributes: player.attributes,
            x: player.MapLocation ? player.MapLocation.x : 0,
            y: player.MapLocation ? player.MapLocation.y : 0,
            location: player.MapLocation ? player.MapLocation.location() : "A1",
            round_log: player.RoundLog
        });
    });

    return player_data;
};

// Gets the current world state.
GameServer.prototype.GetWorldState = function () {
       
     var now = new Date().getTime();
     var round_timer = 0;
     if (this.round_timer > 0) {
         round_timer = (now - this.round_timer) / 1000;
     }

    var world = {
        status: "OK",
        players: this.ExtractPlayers(),
        game_active: this.game_active,
        round_active: this.round_active,
        checkin_active: this.checkin_active,
        round_timer: round_timer,
        between_round_length: this.between_round_length,
        round_length: this.round_length,
        round_log: this.RoundLog
    };
    return world;
};

GameServer.prototype.GetPlayer = function(ormUser, addToGame) {
    
    for(i = 0; i < this.players.length; ++i )
    {
        var chk = this.players[i];
        if (chk.username === ormUser.username)
        {
            return chk;
        }              
    }

    if (addToGame) {
        var chk = new Player(ormUser);

        var className = new Class("Warrior", this.classMap["Warrior"]);
        chk.SetClass(className);

        this.players.push(chk);
        return chk;
    }
    else {
        return null;
    }
    
};

GameServer.prototype.CheckinForRound = function (user) {
    
    var player = this.GetPlayer(user, true);
    
    if (player.checkedIn) return false;
    
    player.checkedIn = true;
    return true;
};

GameServer.prototype.canCheckIn = function() {
    return this.checkin_active;
}

GameServer.prototype.isRoundActive = function() {
    return this.round_active;
};

GameServer.prototype.setRoundActive = function(flag) {
    this.round_active = flag;
};

GameServer.prototype.createGame = function() {

    if (this.game_active) return;

    this.game_active = true;
    this.checkin_active = true;
    this.players = [];
    this.GameMap = new GameMap();  

    this.say_message("TwitchBattle game has been created !battle join to play.");

};

GameServer.prototype.startGame = function() {

    if (!this.game_active) return;

    this.checkin_active = false;

    this.startRound();
};

GameServer.prototype.endGame = function() {
    if (!this.game_active) return;
    
    this.game_active = false;
    this.round_active = false;
    this.checkin_active = false;

    this.round_timer = 0;
    clearTimeout(this.round_timer_id);

    this.say_message("TwitchBattle game has ended.");

}

GameServer.prototype.startRound = function(){

    var self = GameServer.Instance();

    //clear the player logs
    for(i = 0; i < self.players.length; ++i )
    {
        var player = self.players[i];
        player.ClearLog();
    }
    self.ClearLog();

    var round_length = self.round_length * 1000;
    var between_round_length = self.between_round_length * 1000;
    
    self.setRoundActive(true);
    self.round_timer = new Date().getTime();

    self.say_message("Round is now active for " + self.getFriendlyCountdownText(self.round_length) 
        + "! input commands.");
    self.round_timer_id = setTimeout( function(){
        
        self.setRoundActive(false);
        self.say_message("Round is now closed, updating world state. Next round starts in " 
            + self.getFriendlyCountdownText(self.between_round_length) + "!");
        self.executeRound();
        self.round_timer = new Date().getTime();
        self.round_timer_id = setTimeout(self.startRound, between_round_length);
        
    }, round_length );
      
};

GameServer.prototype.executeRound = function(){
    
    BattleAPI.Tick();
    
    var pQueue = new pq.PriorityQueue(function(a,b) {

        return a.speed - b.speed;

    });

    //execute everyone's actions before allowing anyone to move
    this.players.forEach(function(player) {

        if (player.checkedIn)
        {
            var q = player.GetAndClearQueue(false);
            q.forEach(function(command) {
                command.player = player;
                pQueue.push(command);
            });
        }
    });

    while(pQueue.length > 0) {

        var cmd = pQueue.shift();
        cmd.Execute(cmd.player, this);
    }



    //execute movement afterwords.
    for(i = 0; i < this.players.length; ++i )
    {
        var player = this.players[i];
        if (player.checkedIn)
        {
            player.ExecuteQueue(this, true);
        }
    }

    //check for deaths and remove!
    var i = this.players.length;
    while(i--)
    {
        var player = this.players[i];
        if (!player.isActive())
        {
            this.players.splice(i, 1);            
        }
    }
};

GameServer.prototype.ResolvePlayer = function(playerNumber){

    playerNumber--;
    if (playerNumber < 0 || playerNumber >= this.players.length)
        return "";
    else
        return this.players[Number(playerNumber)].username;
};

GameServer.prototype.getFriendlyCountdownText = function(seconds) {

        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds - (hours * 3600)) / 60);
        var secs = seconds - (hours * 3600) - (minutes * 60);


        var time = (hours > 0 ? hours + " hours " : "");
            time += (minutes > 0 ? minutes + " minutes " : "");
            time += (secs > 0 ? secs + " seconds" : "");

        return time.trim();

    };

// Holds the instance of the GameServer
GameServer._instance = null;


module.exports.Instance = GameServer.Instance;
