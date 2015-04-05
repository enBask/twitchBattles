var AuthCommands = {
bind: function(obj) {

        obj.prototype.ActivateUser = function(service, username, ip, authcode, done) {
            // Try and activate the account.
            this.Database.ActivateUser(service, username, ip, authcode, done);
        };

        obj.prototype.CreateUser = function (service, username, password, ip, done) {
            this.Database.CreateUser(service, username, password, ip, done);
        };
        
        obj.prototype.GetUser = function (service, username, done) {
            this.Database.UserExists(service, username, done);
        }
}};

module.exports = AuthCommands;