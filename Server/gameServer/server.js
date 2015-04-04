
function GameServer(){
    this.headless_token = "token"; //generate random token
}

GameServer._instance = null;
GameServer.Instance = function(){
    if (GameServer._instance === null)
        GameServer._instance = new GameServer();
    
    return GameServer._instance;
};

GameServer.prototype.get_token = function(password){
    
    if (password === "password")
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
