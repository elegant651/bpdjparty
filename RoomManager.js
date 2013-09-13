var sys = require('util');
var Room = require('./Room');
var proxy = require('./utils/Proxy');

var MAX_USERS = 11;

var rooms = [];
var roomHash = {};
var userHash = {};

var RoomManager = function() {};

var _ = RoomManager.prototype;

_.removeUserListeners = function(user){
	user.removeAllListeners(CommandTypes.JOIN_ROOM);
};

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
	this.addUserToRoom(user, activeRoom);	
}

_.createRoom = function(){
	var room = Room.create();
	room.on(CommandTypes.USER_LEFT_ROOM, proxy.create(this, this.handleUserLeftRoom));
	return room;
};

_.addUserToRoom = function(user, room){
	room.addUser(user);
	this.removeUserListeners(user);	
	userHash[user.id] = room;
};

_.handleUserLeftRoom = function(room, user){
	delete userHash[user.id];

	this.removeUserListeners(user);
	
	if(room.userCount == 0){
		this.handleRoomEmpty(room);	
	}	
};

_.handleRoomEmpty = function(room){
	var wasRemoved = false;

	if(roomHash[room.id]){
		delete roomHash[room.id];
		for(var i=0; i<rooms.length; i++){
			if(rooms[i].id == room.id){
				wasRemoved = true;
				rooms.splice(i,1);
				break;
			}
		}
	}

	if(wasRemoved){
		room.removeAllListeners(CommandTypes.USER_LEFT_ROOM);
	}
}

_.sortRooms = function(a, b){
	if(a.userCount < b.userCount){
		return -1;
	}else{
		return 1;
	}
};	 

//singletone
var roomManager;
exports.getInstance = function(){
	if(roomManager == null){
		roomManager = new RoomManager();
	}

	return roomManager;
}

