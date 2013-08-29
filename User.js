var proxy = require('./utils/Proxy');
var sys = require('util');
var uuid = require('node-uuid');
var EventEmitter = require('events').EventEmitter;
var CommandTypes = require('./shared/CommandTypes').CommandTypes;

var User = function(socket){
	EventEmitter.call(this);
	this.init(socket);
};

sys.inherits(User, EventEmitter);

var _ = User.prototype;

_.__defineGetter__('publicData', function(){
	return this._data;
});

_.__defineGetter__('id', function() { return this._data.id; });
_.__defineSetter__('id', function(value){
	this._data.id = value;
});

_.__defineGetter__('socket', function() { return this._socket; });
_.__defineSetter__('socket', function(value){
	this._socket = value;
});

_.__defineGetter__('values', function() { return this._data.values; });
_.__defineSetter__('values', function(value){
	this._data.values = value;
});

_.init = function(socket){
	this._data = {};
	this.values = [];
	this.socket = socket;
	this.id = uuid();
console.log(this.id);

	this.joinTime = new Date();

	this.socket.on('disconnect', proxy.create(this, this.handleDisconnect));		
};

_.handleDisconnect = function(values){
	this.emit('disconnect', this, values);
};

exports.create = function(socket){
	return new User(socket);
};
