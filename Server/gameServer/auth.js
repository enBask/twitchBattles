var AuthCommands = {

	bind: function(obj) {

		obj.prototype.ActivateUser = function(service, username, ip, authcode) {
		    //Database.prototype.ActivateUser = function (service, username, ip, authcode)

	    	// If code empty, stop.
	        if (code === "") 
	          return;

	      	var parts = code.split(" ");

	      	// If no parts, stop here.
	      	if (parts.length < 1)
	      		return;

	      	// Assume that the first part is the auth code.
	      	var authCode = parts[0];

	      	// Try and activate the account.
	      	var activated = this.Database.ActivateUser(service, username, ip, authCode);

	      	return activated;
		};

		obj.prototype.CreateUser = function (service, username, ip) {
		    var user = this.Database.CreateUser(service, username, ip);
		    return user;
		};

		obj.prototype.RegisterUser = function (username, code) {
			// Register -> What's this code to be used for?
			console.log("username: " + username + " code " + code);
		};
	}
};

module.exports = AuthCommands;