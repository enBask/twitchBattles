module.exports = {
bind: function(obj) {
    
obj.prototype.register_user = function(who, code){
    
};

obj.prototype.create_user = function (service, username, ip) {
    var user = this.db.create_user(service, username, ip);
    return user;
};

}};