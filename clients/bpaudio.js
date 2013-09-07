var bpaudio = {};
(function(){
	const FADE_TIME = 1;

	var assetInfoList = [
		{"type": 0, "name":"bass1", "url":"../audio/drums/Djembe.wav"},
		{"type": 1, "name":"drum1", "url":"../audio/drums/conga-rhythm.wav"},
		{"type": 1, "name":"drum2", "url":"../audio/drums/breakbeat.wav"},
		{"type": 2, "name":"chords1", "url":"../audio/tones/Sin440.wav"}
	];

	var assetFileList = []; 
	
	var context = 0;
	var source = 0;
	var gainNode = 0;
	var preset;

	this.init = function(){
		context = new webkitAudioContext();
		source = context.createBufferSource();
		gainNode = context.createGainNode();
		gainNode.gain.value = 0.8;

		source.connect(gainNode);
		gainNode.connect(context.destination);
		preset = new Preset();

		source.loop = true;
	}

	function initAssets(){
		assetFileList = new Array();
	
		for(var i=0; i < assetInfoList.length; i++){
			var assetInfo = assetInfoList[i];
			assetFileList[i] = new Asset(context, i, assetInfo);
			assetFileList[i].load();
		}
	}

	function changeAsset(type, changeAssetIdx){
		var assetIds = preset.assetIds;
		var assetIdx = assetIds[type];
		var bufferNow = assetFileList[assetIdx].buffer;
		
		var bufferLater = assetFileList[changeAssetIdx].buffer;

		playHelper(bufferNow, bufferLater);
	}

	function createSource(buffer){
		var source = context.createBufferSource();
		var gainNode = context.createGainNode();
		source.buffer = buffer;
		source.connect(gainNode);
		gainNode.connect(context.destination);

		return {
			source: source,
			gainNode: gainNode
		};
	}	

	function playHelper(bufferNow, bufferLater){
		var playNow = createSource(bufferNow);
		var source = playNow.source;
		
		if(bufferLater != 0){	
			source.loop = false;
		}
		context.source = source;

		var gainNode = playNow.gainNode;
		var duration = bufferNow.duration;
		var currTime = context.currentTime;

		//fade in
		gainNode.gain.linearRampToValueAtTime(0, currTime);
		gainNode.gain.linearRampToValueAtTime(1, currTime + FADE_TIME);
		
		source.noteOn(0);
	
		if(bufferLater != 0){	
			//fade out
			gainNode.gain.linearRampToValueAtTime(1, currTime + duration - FADE_TIME);
			gainNode.gain.linearRampToValueAtTime(0, currTime + duration);

			var recurse = arguments.callee;
			context.timer = setTimeout(function(){
				recurse(bufferLater, 0);
			}, (duration - FADE_TIME) * 1000);
		}
	}

	function play(){
		for(var i=0; i<preset.assetCount; i++){

//			var source = context.createBufferSource();
			var assetIdx = preset.assetIds[i];
			var asset = assetFileList[assetIdx];

			playHelper(asset.buffer, 0);
/*
			source.buffer = asset.buffer;			
			source.connect(context.destination);
			source.start(0);
*/
		}	
	}

}).apply(bpaudio);
