var PF = require('pathfinding');

function GameMap() {
    
    this.width = 30;
    this.height = 22;
    this.players = [];
    this.path_grid = new PF.Grid(30, 22);
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

GameMap.prototype.getPlayers = function(x, y) {

   if (!this.isLocationValid(x,y)) return [];

   var pos = this.lookupLocation(x,y);
   if (pos === undefined)
        pos = 0;
   var players = this.locations[pos];

   return players.slice(0);
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
        y :y,
        location: function() {

          var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          var len = alphabet.length;
          var data = "";
          if (y >= len) {
            data = alphabet[y / len - 1] + alphabet[y % len];
          }
          else {
            data = alphabet[y];
          }

          return data + (x+1);
        }  
    };
};

GameMap.prototype.getPosition = function(player) {    
    return player.MapLocation;    
};

GameMap.prototype.caluclatePath = function(from, to) {

  if (!this.isLocationValid(from.x, from.y) || !this.isLocationValid(to.x, to.y))
    return null;

  var grid = this.path_grid.clone();
  var find = new PF.AStarFinder();

  var path = find.findPath(from.x, from.y, to.x, to.y, grid);
  path.shift();
  return path;
}

module.exports = GameMap;

