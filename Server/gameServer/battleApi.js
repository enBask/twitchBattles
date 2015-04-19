var GameServer = require("./server.js");
var LocationHelper = require("./commands/location.js");

function BattleAPI() {
}

function map_distance(a, b) {
	var diffX = Math.abs(b.x - a.x);
	var diffY = Math.abs(b.y - a.y);
	var diff = diffX + diffY;
	return diff;
}

BattleAPI.Timeouts = [];
BattleAPI.SetTimeout = function(rounds, callback) {

	var timeoutObject = {
		rounds : rounds + 1, //add a round since we execute ticks first in the round.
		callback : callback
	};

	BattleAPI.Timeouts.push(timeoutObject);
};

BattleAPI.ResolveTimeouts = function() {
	var i = BattleAPI.Timeouts.length;
    while(i--)
    {
        var timeout = BattleAPI.Timeouts[i];

        timeout.rounds--;

        if (timeout.rounds <= 0) {
        	timeout.callback();
        	 BattleAPI.Timeouts.splice(i, 1);            
        }
    }
};

BattleAPI.Tick  = function() {
	BattleAPI.ResolveTimeouts();	
};

BattleAPI.ResolveLocation = function(player, location_data) {

	var gameServer = GameServer.Instance();
	var mapLocation = gameServer.GameMap.getPosition(player);
	var location = LocationHelper.Lookup(mapLocation, location_data);

	return location;
}

BattleAPI.AttackTarget = function(attacker, target, damage, range, callback) {

	var gameServer = GameServer.Instance();

	var mapLocation = gameServer.GameMap.getPosition(attacker);
	var targetLocation = gameServer.GameMap.getPosition(target);

	var distance = map_distance(mapLocation, targetLocation);

	if (distance <= range) {
		target.Hit(damage, attacker);
		callback(true);
	}
	else {
		callback(false);
	}
};

BattleAPI.AttackLocation = function(attacker, targetLocation, damage, range, callback) {	
	var gameServer = GameServer.Instance();
	var mapLocation = gameServer.GameMap.getPosition(attacker);
	
	var distance = map_distance(mapLocation, targetLocation);	
	if (distance <= range) {
		var players = gameServer.GameMap.getPlayers(targetLocation.x, targetLocation.y);

		players.forEach(function(target){
			if (target !== attacker){
				target.Hit(damage, attacker);
			}
		});
		callback(true);
	}
	else {
		callback(false);
	}
};

module.exports = BattleAPI;