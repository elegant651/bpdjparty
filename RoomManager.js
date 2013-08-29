var sys = require('util');
var Room = require('./Room');
var proxy = require('./utils/Proxy');

var MAX_USERS = 5;

var rooms = [];
var roomHash = {};
var userHash = {};

var RoomManager = function() {};

var _ = RoomManager.prototype;

//assigns the user to a random room
_.assignRoom = function(user){
	var activeRoom;

	//sort listed with emptiest first
	rooms.sort(this.sortRooms);
	
	var firstRoom = rooms[0];
	var minCount = firstRoom!=null?firstRoom.userCount:null;	

	if(minCount != null && minCount != MAX_USERS){
		var emptyRooms = [];
		for(var i=0; i<rooms.length; i++){
			var r = rooms[i];
			if(r.userCount < MAX_USERS){
				emptyRooms.push(r);
			}else{
				break;
			}
		}
		//pick a random room from the empty ones
		activeRoom = emptyRooms[emptyRooms.length*Math.random()|0];
	}else{
		activeRoom = this.createRoom();
		
		roomHash[activeRoom.id] = activeRoom;
		rooms.push(activeRoom);
	}

	console.log("activeUser:"+user.id+" // activeRoom:"+activeRoom.id);
}

_.createRoom = function(){
	var room = Room.create();
	room.on(CommandTypes.USER_LEFT_ROOM, proxy.create(this, this.handleUserLeftRoom));
	return room;
};

_.handleUserLeftRoom = function(room, user){

}

//singletone
var roomManager;
exports.getInstance = function(){
	if(roomManager == null){
		roomManager = new RoomManager();
	}

	return roomManager;
}

