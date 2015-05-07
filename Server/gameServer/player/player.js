var extend = require('util')._extend;
var BattleAPI = rekuire('gameServer/battleApi.js');

function Player(ormUser) {
    
    this.ClassObject = null;
    this.MapLocation = undefined;
    this.CommandQueue = [];
    this.MovementQueue = [];
    this.username = ormUser.username;
    this.service = ormUser.service;
    this.checkedIn = false;
    this.active = true;
    this.RoundLog = [];
    

    this.color = {
               r : Math.random(),
               g : Math.random(),
               b : Math.random()
            };
}

Player.prototype.SetClass = function(classObject) {
    this.ClassObject = classObject;
    this.CreateAttributes(this.ClassObject);
}

Player.prototype.CreateAttributes = function(classObject) {
    
    this.starting_attributes = require('./default_attributes.json');
    this.attributes = extend({}, this.starting_attributes);
    classObject.apply_attributes(this.attributes);

    this.speed_points = this.attributes.move_speed;   
}

Player.prototype.AddLog = function(msg) {

    this.RoundLog.push(msg);
};

Player.prototype.ClearLog = function() {
    this.RoundLog = [];
};

Player.prototype.Hit = function(damage, from) {
    
    BattleAPI.Emit("hit", this, from, this);    
    if (BattleAPI.ActionCanceled()) 
        return false;
    
    
    this.attributes.hitpoints -= damage;
    if (this.attributes.hitpoints <=0) this.attributes.hitpoints =0;

    if (this.attributes.hitpoints == 0) {
        this.kill();
    }
    
    return true;
};

Player.prototype.kill = function() {
    this.active = false;
    this.checkedIn = false;
    this.hitpoints = 0;
};

Player.prototype.isActive = function() {
    return this.active;
};

Player.prototype.QueueCommand = function(cmd, isMovement) {

    if (!this.checkedIn) return;

    if (isMovement) {
        //TODO: move this magic length number to the config file.
        if (this.MovementQueue.length >= 3)
        {
            return;
        }

        this.MovementQueue.push(cmd);
    }
    else {
        //TODO: move this magic length number to the config file.
        if (this.CommandQueue.length >= 1)
        {
            return;
        }

        this.CommandQueue.push(cmd);       
    }

	return;
};

Player.prototype.ClearQueue = function(isMovement) {

    if (isMovement){
        this.MovementQueue = [];
        
        if (isMovement) {
            this.speed_points = this.attributes.move_speed;
        }
    }
    else {
        this.CommandQueue = [];
    }
};

Player.prototype.GetAndClearQueue = function(isMovement) {

    var queue = isMovement ? this.MovementQueue : this.CommandQueue;
    var ret_queue = queue.slice(0);
    this.ClearQueue(isMovement);   
    return ret_queue;   
};

Player.prototype.ExecuteQueue = function(gameServer, isMovement) {
    
    var queue = isMovement ? this.MovementQueue : this.CommandQueue;

    var self = this;
    queue.forEach( function(cmd) {
        cmd.Execute(self, gameServer);
    });

    this.ClearQueue(isMovement);  
    
};

module.exports = Player;

