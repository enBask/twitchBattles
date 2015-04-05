var Sequelize = require('sequelize');
var hat = require('hat');

var Database = (function () {

  // Constructor
  function Database() {
        var sql = new Sequelize('', '', '', {
            dialect: 'sqlite',
            storage: '/twitchBattle.sqlite'
        });
        this.databaseDriver = sql;
        this.User = sql.define('user', {
            service: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING
            },
            authcode: {
                type: Sequelize.STRING
            },
            authip: {
                type: Sequelize.STRING
            },
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        });
        this.User.sync();
  };

  // Checks if a user already exists. 
  Database.prototype.UserExists = function (service, username) {
      this.User.find({
          where: {
              service: service,
              username: username,
              active: true
          }
      }).then(function (user) {
          return true;
      });
      return false;
  };

  // Clears pending user account(s) (Active: false)
  Database.prototype.ClearPendingUser = function (service, username) {      
      this.User.findAll({
          where: {
              service: service,
              username: username,
              active: false
          }
      }).then(function (data) {
          if (data) {
              if (Array.isArray(data)) {
                  data.forEach(function (item) {
                      item.destroy();
                  });
              }
              else {
                  data.destroy();
              }
          }
      });
  };

  // Creates a user account if it does not already exist.
  Database.prototype.CreateUser = function (service, username, ip) {
      if (this.UserExists(service, username)) {
          return null;
      };

      this.ClearPendingUser(service, username);
      var user = this.User.build({
          service: service,
          username: username,
          authip: ip,
          authcode: this.GenerateAuthCode()
      });

      user.save();
      
      return user;
  };

  // Activates a pending user account.
  Database.prototype.ActivateUser = function (service, username, ip, authcode) {
      this.User.find({
          where: {
              service: service,
              username: username,
              ip: ip,
              authcode: authcode
          }
      }).then(function (user) {
          user.active = true;
          user.save();
          return true;
      });
      return false;
  };

  // Generates an auth code for a new user.
  Database.prototype.GenerateAuthCode = function () {
      var id = hat();
      return id.toString();
  };

  return Database;
})();

module.exports = Database;