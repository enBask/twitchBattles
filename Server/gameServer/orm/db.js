var Sequelize = require('sequelize');
var hat = require('hat');
var bcrypt = require('bcrypt');

var Database = (function () {

  // Constructor
  function Database() {
        var sql = new Sequelize('', '', '', {
            dialect: 'sqlite',
            storage: './twitchBattle.sqlite'
        });
        this.databaseDriver = sql;
        this.User = sql.define('user', {
            service: {
                type: Sequelize.STRING
            },
            username: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false
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
        this.Sessions = sql.define('Sessions', { 
          sid: 
            { 
              type: Sequelize.STRING, 
              primaryKey: true 
            }, 
          data: Sequelize.TEXT 
        });

        this.Sessions.sync();
  };

  // Checks if a user already exists. 
  Database.prototype.UserExists = function (service, username, done) {
      this.User.find({
          where: {
              service: service,
              username: username,
              active: true
          }
      }).then(function (user) {
         done( user );
      });
  };

  // Clears pending user account(s) (Active: false)
  Database.prototype.ClearPendingUser = function (service, username, done) {      
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
          
          done();
      });
  };

  // Creates a user account if it does not already exist.
  // Returns the user to the done callback or null if user already exists
  Database.prototype.CreateUser = function (service, username, password, ip, done) {
      
      var self = this;
       
      this.UserExists(service, username, function(result) {         
          if (result)
              done(null);
          else {             
              self.ClearPendingUser(service, username, function(){
                var user = self.User.build({
                    service: service,
                    username: username,
                    authip: ip,
                    authcode: self.GenerateAuthCode(),
                    password: self.CreatePasswordHash(password)
                });

                user.save();          

                done(user);
              });
          }
      });
  };

  // Activates a pending user account.
  Database.prototype.ActivateUser = function (service, username, hash, done) {
      this.User.find({
          where: {
              service: service,
              username: username,
              authcode: hash,
              active: false
          }
      }).then(function (user) {
          if (user !== null)
          {
            user.active = true;
            user.save();                   
            done(true);
          }
          
          done(false);
     });
  };

  // Generates an auth code for a new user.
  Database.prototype.GenerateAuthCode = function () {
      var id = hat();
      return id.toString();
  };
  
  Database.prototype.CreatePasswordHash = function(password) {
      
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      return hash;
  };
  
  Database.prototype.ValidatePassword = function(password, hash) {
      
      return bcrypt.compareSync(password, hash);
  };
  
  return Database;
})();

module.exports = Database;