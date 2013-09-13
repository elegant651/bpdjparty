var sys = require('util');
var proxy = require('./utils/Proxy');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;
var crypto = require('crypto');

require('./shared/CommandTypes');

var Room = function(){ this.init(); };
sys.inherits(Room, EventEmitter);

var _ = Room.prototype;

_.__defineGetter__('id', function() { return this._data.id; });
_.__defineSetter__('id', function(value){
	this._data.id = value;
});

_.__defineGetter__('users', function() { return this._users; });
_.__defineSetter__('users', function(value){
	this._users = value;
});

_.__defineGetter__('userCount', function() { return this._users.length; });

_.init = function(){
	EventEmitter.call(this);
	
	this._data = {};
	
	//create a UID for this room
	this.id = uuid();
	var shasum = crypto.createHash('md5');
	shasum.update(this.id);
	this.id = shasum.digest('hex');

	this.users = [];
	this.startTime = [];
};

_.addUser = function(user){
	user.on(CommandTypes.CHANGE_VALUE, proxy.create(this, this.handleChangeValue));	
	user.on(CommandTypes.CHANGE_ASSET, proxy.create(this, this.handleChangeAsset));
	user.on('disconnect', proxy.create(this, this.handleUserDisconnect));

	user.color = 0xffffff*Math.random()|0;
	user.send(CommandTypes.JOIN, {user:user.publicData, data:this.serialize()});
	this.users.push(user);	
	this.send(CommandTypes.USER_JOINED_ROOM, user.publicData);		
};

_.handleChangeValue = function(index, data, user){
	this.send(CommandTypes.CHANGE_VALUE, {index:index, values:data, userId:user.id}, user);
};

_.handleChangeAsset = function(index, data, user){
	this.send(CommandTypes.CHANGE_ASSET, {index:index, values:data, userId:user.id}, user);
};

_.serialize = function(){
	var packet = {users:[]};
	for(var n in this._data){
		packet[n] = this._data[n];
	}

	for(var i=0; i < this.users.length; i++){
		packet.users.push(this.users[i].publicData);
	}

	return packet;
}

_.handleUserDisconnect = function(user){
	this.removeUser(user);
};

_.removeUser = function(user){
	for(var i=0; i<this.users.length; i++){
		var u = this.users[i];
		if(u == user){
			this.users.splice(i, 1);
			break;
		}
	}

	user.removeAllListeners(CommandTypes.USER_CHANGE);	
	user.removeAllListeners('disconnect');
	
	this.send(CommandTypes.USER_LEFT_ROOM, user.id);
	///notify the RoomManager
	this.emit(CommandTypes.USER_LEFT_ROOM, this, user);
	user.send('disconnect');			
};

//sends a message to all the users in this room.
_.send = function(type, data, user){
	for(var i=0; i<this.userCount; i++){
		var u = this.users[i];
		//except own
		if(user && u.id == user.id) { continue; }
		u.send(type, data);
	}	
};

exports.create = function(){
	return new Room();
};
