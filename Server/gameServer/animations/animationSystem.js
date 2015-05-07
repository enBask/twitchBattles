
var global_animation_file = "gameServer/classes/global_animations.json";

var AnimationList = rekuire("gameServer/animations/animationList.js");

function animationSystem() {
	
	
}

animationSystem.prototype.Load = function() {
	
		var a = rekuire(global_animation_file);
		var animations = a.Animations;
		
		this.GlobalAnimations = {};
		this.PluginAnimations = {};
		var self = this;
		animations.forEach(function(animation) {
			
			var animObj = new AnimationList(animation);
			var name = animObj.getName();
			self.GlobalAnimations[name] = animObj;
		});				
};

animationSystem.prototype.getAnimation = function(name) {
	
	var anim = this.GlobalAnimations[name];
	if (anim === undefined) return null;
	
	return anim;
};

animationSystem.prototype.getPluginAnimation = function(plugin, name) {
	
	var list = this.PluginAnimations[plugin];
	if (list === undefined) return null;
	
	var anim = list[name];
	if (anim === undefined) return null;
	
	return anim;
};

animationSystem.prototype.hasAnimation = function(name) {
	
	return (this.GlobalAnimations[name] !== undefined);		
};

animationSystem.prototype.createAnimation = function(plugin, data) {
	
	if (data === undefined || data == null) return;
	if (plugin == undefined || plugin == null) return;
	
	var animList = null;
	if (data.global) {
		animList = this.getAnimation(data.name);				
	}
	else {
		animList = new AnimationList(data);			
	}
		
	var pluginList = this.PluginAnimations[plugin];
	if (pluginList === undefined) {
		pluginList = {};
		this.PluginAnimations[plugin] = pluginList;
	}	
	pluginList[animList.getName()] = animList;
};

module.exports = animationSystem;