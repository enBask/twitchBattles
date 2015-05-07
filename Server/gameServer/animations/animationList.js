var Animation = rekuire("gameServer/animations/animation.js");
var GameServer = rekuire("gameServer/server.js");

function parseAnimation(data) {	
	
	var animations = [];
	
	data.forEach(function(anim_data) {
		
		if (anim_data.name !== undefined) {
			
			if (anim_data.global) {
				
				var gameServer = GameServer.Instance();
				var anim = gameServer.AnimationSystem.getAnimation(anim_data.name);
				if (anim != null) {
					animations.push(anim);
				}
			}
			else {
				var animList = new AnimationList(anim_data);
				animations.push(animList);
			}			
		}
		else {
			var animation = new Animation(anim_data);
			animations.push(animation);			
		}		
	});	
	
	return animations;
};

function AnimationList(data) {
	
	this.Name = data.name;
	this.Animations = parseAnimation(data.animations);	
}



AnimationList.prototype.getName = function() {
	return this.Name;	
};

module.exports = AnimationList;