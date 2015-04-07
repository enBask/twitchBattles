function Player(ormUser) {
    
    this.MapLocation = undefined;
    this.username = ormUser.username;
    this.service = ormUser.service;
    this.checkedIn = false;
    this.color = {
               r : Math.random(),
               g : Math.random(),
               b : Math.random()
            };
}

module.exports = Player;

