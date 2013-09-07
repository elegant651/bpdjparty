var proxy = require('./utils/Proxy');

var lists = [];
var sounds = [];

var AudioManager = function() {};

var _ = AudioManager.prototype;

_.assignUser = function(user){

}

var audioManager;

exports.getInstance = function(){
	if (audioManager == null){
		audioManager = new AudioManager();
	}
	return audioManager;
}
