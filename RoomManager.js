var sys = require('util');
var Room = require('./Room');
var proxy = require('./utils/Proxy');

var MAX_USERS = 5;


var RoomManager = function() {};

var _ = RoomManager.prototype;



//singletone
var roomManager;
exports.getInstance = function(){
	if(roomManager == null){
		roomManager = new RoomManager();
	}

	return roomManager;
}

