exports.create = function(scope, func){
	proxy = function(){
		return func.apply(scope, arguments);
	};

	return proxy;
};
