
function Player(ormUser) {
    
    this.MapLocation = undefined;
    this.CommandQueue = [];
    this.MovementQueue = [];
    this.username = ormUser.username;
    this.service = ormUser.service;
    this.checkedIn = false;
    this.active = true;

    this.color = {
               r : Math.random(),
               g : Math.random(),
               b : Math.random()
            };

    this.move_speed = 3;
    this.speed_points = this.move_speed;

    this.hitpoints = 10;
}

Player.prototype.Hit = function(damage, from) {
    this.hitpoints -= damage;
    if (this.hitpoints <=0) this.hitpoints =0;

    if (this.hitpoints == 0) {
        this.kill();
    }
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
            this.speed_points = this.move_speed;
        }
    }
    else {
        this.CommandQueue = [];
    }
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

