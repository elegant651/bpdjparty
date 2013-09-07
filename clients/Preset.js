var Preset = function(){this.init();};

var _ = Preset.prototype;

_.__defineGetter__('assetIds', function(){ return this._assetIds; });
_.__defineSetter__('assetIds', function(value){
	this._assetIds = value;
});

_.__defineGetter__('assetCount', function(){ return this._assetIds.length; });


_.init = function(){
	this.assetIds = [0,1,2,3];
}

_.setAssetIdx = function(type, index){
	this.assetIds[type] = index;
}

_.assetFinishedLoading = function(asset){
	if(asset.buffer){
		console.log("isFullyLoaded : "+asset.index);
	}
}


