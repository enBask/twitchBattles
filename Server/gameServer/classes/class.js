

function Class(class_name, class_data) {

	this.class_name = class_name;
	this.data = class_data;
	this.commands = [];
	this.LoadCommands();
}

Class.prototype.LoadCommands = function() {

	var abilities = this.data.abilities;
	var self = this;
	abilities.forEach(function(ability) {

		var file = self.data.folder_path + "/commands/" + ability.script +".js";
		var ability_plugin = require(file);

		if (ability.speed < 0)
			ability.speed = 0;
		if (ability.speed > 10)
			ability.speed = 10;

		ability_plugin.Speed = ability.speed;
		self.commands[ability.command] = ability_plugin;
	});
};

Class.prototype.apply_attributes = function(attribs) {

	var self = this;
	Object.keys(this.data.attributes).forEach(function(element, key){
		var value = self.data.attributes[element];

		var attrib_value = attribs[element];
		attrib_value *= value;
		attribs[element] = attrib_value;
	});

};

Class.prototype.TryProcessCommand = function(ctx, player, cmd, args) {

	if (!player.isActive()) return false;
	
	var callback = this.commands[cmd].Process;
	var speed = this.commands[cmd].Speed;
	if (callback === undefined) return false;

	return callback.call(ctx, player, args, function(cmd_object) {

		cmd_object.speed = speed;
	});
};


module.exports = Class;