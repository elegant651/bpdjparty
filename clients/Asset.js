var Asset = function(context, index, assetInfo){ this.init(context, index, assetInfo); };

var _ = Asset.prototype;

_.init = function(context, index, assetInfo){
	this.context = context;
	this.index = index;
	this.type = assetInfo.type;
	this.name = assetInfo.name;
	this.url = assetInfo.url;	

	this.startedLoading = false;
	this.loaded = false;
	this.buffer = 0;
	this.preset = 0;
	this.request = 0;
};

_.load = function(){
	if(this.loaded){
		return;
	}	
	
	if(this.startedLoading){
		return;
	}
	this.startedLoading = true;

	var request = new XMLHttpRequest();
	request.open("GET", this.url, true);
	request.responseType = "arraybuffer";
	this.request = request;

	var asset = this;
	var context = this.context;
	var index = this.index;
	request.onload = function(){
		asset.buffer = context.createBuffer(request.response, false);
		asset.loaded = true;
		
		console.log("isFullyLoadedAsset : "+index);
	}
	request.send();	
}
