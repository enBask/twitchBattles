var Sequelize = require('sequelize');
var hat = require('hat');


function gen_code() {
    var id = hat();
    return id.toString();
}

function DataBase(){
   
   var seq = new Sequelize('', '', '', {
      
       dialect: 'sqlite',
       storage: './twitchBattle.sqlite'
   });
   
   this.db_driver = seq;
   
   this.User = seq.define('user', {
   service : {
       type: Sequelize.STRING
   },
   username : {
       type: Sequelize.STRING
   },
   authcode : {
       type: Sequelize.STRING
   },
   authip : {
       type: Sequelize.STRING
   },
   active : {
       type: Sequelize.BOOLEAN,
       defaultValue: false
   }
  
   });
   
   this.User.sync();
}

DataBase.prototype.is_user_valid = function (service, username) {
 
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

DataBase.prototype.clear_pending_user = function (service, username) {
 
    var UserRecord = this.User;
    this.User.findAll({
       where: {
           service: service,
           username: username,
           active: false
       } 
    }).then(function (data) {  
        if (data)
        {
            if (Array.isArray(data))
            {
                data.forEach(function(item){
                   item.destroy(); 
                });
            }
            else 
                data.destroy();
        }
    });
    
};

DataBase.prototype.create_user = function(service, username,ip){
 
    if (this.is_user_valid(service, username)) return null;
    
    this.clear_pending_user(service, username);
    
    var user = this.User.build({
       service: service,
       username: username,
       authip: ip,
       authcode: gen_code()
    });    
    
    user.save();
    
    console.log(user.authcode);
    return user;
};

DataBase.prototype.validate_user = function (service, username, ip, authcode) {
    
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


module.exports = DataBase;