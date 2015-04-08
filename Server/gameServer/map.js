function GameMap() {
    
    this.width = 30;
    this.height = 22;
    this.players = [];
    this.locations = new Array( this.width * this.height);
    
    for(var i = 0; i < this.locations.length; i++)
    {
        this.locations[i] = [];
    }
}

GameMap.prototype.lookupLocation = function(x, y) {
  
    return this.width * y + x;
};

GameMap.prototype.playerExists = function(player) {
    
    for(var i =0; i < this.players.length; i++)
    {
        if (this.players[i] === player) return true;
    }
    
    return false;
};

GameMap.prototype.unsetPlayer = function(player) {
  
   var mapLocation = player.MapLocation;
   if (mapLocation !== undefined)
   {
       var pos = mapLocation.index;
       var players = this.locations[pos];
       for(var i = 0; i < players.length; ++i)
       {
           if (players[i] === player)
           {
               player.MapLocation = undefined;
               players.splice(i, 1);
               return;
           }
       }
   }
};

GameMap.prototype.isLocationValid = function(x, y) {
    
    if (x >= this.width || x < 0) return false;
    if (y >= this.height || y < 0) return false;
    
    return true;
};


GameMap.prototype.addPlayer = function(player) {
    
    if (this.playerExists(player)) return;  
    this.players.push(player);
    
    var x = Math.floor(Math.random() * (this.width-1));
    var y = Math.floor(Math.random() * (this.height-1));
    
    this.movePlayer(player, x, y);
        
};

GameMap.prototype.movePlayer = function(player, x, y) {
    
    if (!this.playerExists(player)) return;

    if (!this.isLocationValid(x,y)) return;
        
    this.unsetPlayer(player);
    
    var pos = this.lookupLocation(x,y);
    if (pos === undefined)
        pos = 0;
    var players = this.locations[pos];
    players.push(player);
    
    player.MapLocation = {
        index : pos,
        x : x,
        y :y
    };
};

GameMap.prototype.getPosition = function(player) {    
    return player.MapLocation;    
};

module.exports = GameMap;

