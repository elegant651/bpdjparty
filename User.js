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

_.__defineGetter__('color', function() { return this._data.color; });
_.__defineSetter__('color', function(value){
	this._data.color = value;
});

_.__defineGetter__('joinTime', function() { return this._data.joinTime; });
_.__defineSetter__('joinTime', function(value){
	this._data.joinTime = value;
});

_.__defineGetter__('socket', function() { return this._socket; });
_.__defineSetter__('socket', function(value){
	this._socket = value;
});

_.__defineGetter__('values', function() { return this._data.values; });
_.__defineSetter__('values', function(value){
	this._data.values = value;
});

_.__defineGetter__('assetvalues', function() { return this._data.assetvalues; });
_.__defineSetter__('assetvalues', function(value){
	this._data.assetvalues = value;
});

_.__defineGetter__('instType', function() { return this._data.instType; });
_.__defineSetter__('instType', function(value){
	this._data.instType = value;
});

_.__defineGetter__('assetIdx', function() { return this._data.assetIdx; });
_.__defineSetter__('assetIdx', function(value){
	this._data.assetIdx = value;
});


_.init = function(socket){
	this._data = {};
	this.values = [];

	this.assetvalues = [];

	this.socket = socket;
	this.id = uuid();

	this.joinTime = new Date();

	this.socket.on('disconnect', proxy.create(this, this.handleDisconnect));		
	this.socket.on(CommandTypes.SET_VALUE, proxy.create(this, this.handleSetValue));
	this.socket.on(CommandTypes.CHANGE_ASSET, proxy.create(this, this.handleChangeAsset));
};

_.handleSetValue = function(index, data){
	this.values.push({index:index, data:data});
	this.emit(CommandTypes.CHANGE_VALUE, index, data, this);
};

_.handleChangeAsset = function(index, data){
	//this.assetvalues.push({index:index, data:data});
	this.emit(CommandTypes.CHANGE_ASSET, index, data, this);
};

_.send = function(type, data){
	this.socket.emit(type, data);
};

_.handleDisconnect = function(values){
	this.emit('disconnect', this, values);
};

_.error = function(type, message){
	this.send(CommandTypes.ERROR, {message:message, type:type});
};

exports.create = function(socket){
	return new User(socket);
};
