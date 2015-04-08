var AuthCommands = {
bind: function(obj) {

        obj.prototype.ActivateUser = function(service, username, ip, authcode, done) {
            // Try and activate the account.
            this.Database.ActivateUser(service, username.toLowerCase(), ip, authcode, done);
        };

        obj.prototype.CreateUser = function (service, username, password, ip, done) {
            this.Database.CreateUser(service, username.toLowerCase(), password, ip, done);
        };
        
        obj.prototype.GetUser = function (service, username, done) {
            this.Database.UserExists(service, username.toLowerCase(), done);
        };

        obj.prototype.Login = function (service, username, password, done) {

            this.GetUser(service, username, function(user) {
                
                var loginInfo = {
                    status: "FAILED",
                    user: null
                };

                // If a user is returned and password is correct.
                if (user !== null && this.Database.ValidatePassword(password, user.password)) {
                    loginInfo.user = { id: user.dataValues.id, username: user.dataValues.username, service: user.dataValues.service };
                    loginInfo.status = "OK";
                }

                done(loginInfo);

            }.bind(this));
        };
}};

module.exports = AuthCommands;