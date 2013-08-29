
(function(){
	
	CommandTypes = {};
	var c = CommandTypes;

	// notify the room when a user has joined.
	c.USER_JOINED_ROOM = 1;	

	// message back to the user who just joined.
	c.JOIN = 2;

	// notify the room a user has left.
	c.USER_LEFT_ROOM = 3;

	// notify the room a user has changed a value.
	c.USER_CHANGE = 4;

	if(typeof exports == 'undefined'){
		exports = window;
	}
	exports.CommandTypes = CommandTypes;

}());
