"use strict";

var express = require('express'),
	http = require('http');
var app = express();
var User = require('./User');

var PORT_NUMBER = 8888;

var server = http.createServer(app);
app.use(app.router);
server.listen(PORT_NUMBER);

var io = require('socket.io').listen(server);
io.configure(function(){
	io.set('log level', 1);
	io.set('transports', ['websocket']);
});

io.sockets.on('connection', function(socket){
	
	var u = User.create(socket);	
	console.log("connection");
});

app.get('/', function(req, res){
	res.redirect('http://bpsound.com/apps/bpdjparty');
});

console.log("express server on port "+PORT_NUMBER);

