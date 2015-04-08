
function Player(ormUser) {
    
    this.MapLocation = undefined;
    this.CommandQueue = [];
    this.username = ormUser.username;
    this.service = ormUser.service;
    this.checkedIn = false;
    this.color = {
               r : Math.random(),
               g : Math.random(),
               b : Math.random()
            };
}

Player.prototype.QueueCommand = function(cmd) {

    if (!this.checkedIn) return;

	//TODO: move this magic length number to the config file.
	if (this.CommandQueue.length >= 3)
	{
		return;
	}

	this.CommandQueue.push(cmd);
	return;
};

Player.prototype.ClearQueue = function() {

    this.CommandQueue = [];
};

Player.prototype.ExecuteQueue = function(gameServer) {
    
    var self = this;
    this.CommandQueue.forEach( function(cmd) {
        cmd.Execute(self, gameServer);
    });

    this.ClearQueue();

}

module.exports = Player;

