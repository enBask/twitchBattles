var GameServer = require("./server.js");
var LocationHelper = require("./commands/location.js");
var EventEmitter = require('events').EventEmitter;


function BattleAPI() {
	
}

Array.prototype.has = function(object) {
	var i = this.length;
	
	while(i--) {
		if (this[i] == object) {
			return true;
		}
	}
	
	return false;
};

Array.prototype.remove = function(object) {
	
	var i = this.length;
	while(i--) {
		if (this[i] == object) {
			this.splice(i, 1);
			return;		
		}
	}
};

function ObjectHas(object, key) {
	var chk = object[key];
	return (chk != undefined);
};


function map_distance(a, b) {
	var diffX = Math.abs(b.x - a.x);
	var diffY = Math.abs(b.y - a.y);
	var diff = diffX + diffY;
	return diff;
}

BattleAPI.events  =  {};

BattleAPI.Register = function(signal, callback, ctx, target) {

	if (!ObjectHas(BattleAPI.events,signal)) {
		BattleAPI.events[signal] = {};
	}
	
	var signals = BattleAPI.events[signal];
	
	if (!ObjectHas(signals, target)) {		
		signals[target] = [];
	}
	
	signals[target].push({
		'once' : false,
		'callback' : callback,
		'ctx' : ctx
	});		
};

BattleAPI.Unregister = function(signal, callback,target) {
	
	if (!ObjectHas(BattleAPI.events,signal)) {
		BattleAPI.events[signal] = {};
	}
	
	var signals = BattleAPI.events[signal];
	
	if (!ObjectHas(signals, target)) {			
		signals[target] = [];
	}
	
	var callbacks = signals[target];
	
	var i = callbacks.length;
	while(i--) {
		var cbObject = callbacks[i];
		if (cbObject['callback'] == callback) {
			callbacks.remove(cbObject);
			return;
		}
	}
		
};

BattleAPI.RegisterOnce = function(signal, callback, ctx, target) {
	if (!ObjectHas(BattleAPI.events,signal)) {
		BattleAPI.events[signal] = {};
	}
	
	var signals = BattleAPI.events[signal];
	
	if (!ObjectHas(signals, target)) {		
		signals[target] = [];
	}
	
	signals[target].push({
		'once' : true,
		'callback' : callback,
		'ctx' : ctx
	});		
};

BattleAPI.Emit = function(signal, target) {
	
	BattleAPI.ResetAction();    
	var args = Array.prototype.slice.call(arguments, 2);
	
	if (!ObjectHas(BattleAPI.events,signal)) {
		return;
	}
	
	var signals = BattleAPI.events[signal];
	
	if (!ObjectHas(signals, target)) {		
		return;
	}
	
	var callbacks = signals[target];
	
	var i = callbacks.length;
	
	while(i--) {
		
		var callback = callbacks[i];
		callback['callback'].apply(callback['ctx'], args);	
		
		if (callback['once']) {
			callbacks.remove(callback);
		}
	}	
};

BattleAPI._actionCanceled = false;
BattleAPI.CancelAction = function() {
	BattleAPI._actionCanceled = true;
};

BattleAPI.ResetAction = function() {
	BattleAPI._actionCanceled = false;
};

BattleAPI.ActionCanceled = function() {
	return BattleAPI._actionCanceled;
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

    BattleAPI.Emit("attack", attacker, target, damage, range);    
    if (BattleAPI.ActionCanceled()) 
        return;

	var gameServer = GameServer.Instance();

	var mapLocation = gameServer.GameMap.getPosition(attacker);
	var targetLocation = gameServer.GameMap.getPosition(target);

	var distance = map_distance(mapLocation, targetLocation);

	var result = false;
	if (distance <= range) {
		result = target.Hit(damage, attacker);
	}
	
	if (!result) {
		 BattleAPI.Emit("miss", attacker);    
	    if (BattleAPI.ActionCanceled()) 
	        return;		
	}
	
	callback(result);
};

BattleAPI.AttackLocation = function(attacker, targetLocation, damage, range, callback) {	
	var gameServer = GameServer.Instance();
	var mapLocation = gameServer.GameMap.getPosition(attacker);
	
	var distance = map_distance(mapLocation, targetLocation);	
	if (distance <= range) {
		var players = gameServer.GameMap.getPlayers(targetLocation.x, targetLocation.y);

		players.forEach(function(target){
			if (target !== attacker){
				var r = target.Hit(damage, attacker);
				
				if (!r) {
					 BattleAPI.Emit("miss", attacker);    
				    if (BattleAPI.ActionCanceled()) 
				        return;
				}
			}
		});
		callback(true);
	}
	else {
		callback(false);
	}
};

module.exports = BattleAPI;