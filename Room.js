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


exports.create = function(){
	return new Room();
};
