var bpaudio = {};
(function(){
	const INTERVAL_TIME = 7000;
	const FADE_TIME = 1;

	//3 instruments in each types.
	var assetInfoList = [
		{"type": 0, "name":"bass0", "url":"../audio/bands/bass_0.mp3"},
		{"type": 0, "name":"bass1", "url":"../audio/bands/bass_1.mp3"},
		{"type": 0, "name":"bass2", "url":"../audio/bands/bass_2.mp3"},		
		{"type": 1, "name":"bass2_0", "url":"../audio/bands/bass2_0.mp3"},
		{"type": 1, "name":"bass2_1", "url":"../audio/bands/bass2_1.mp3"},
		{"type": 1, "name":"bass2_2", "url":"../audio/bands/bass2_2.mp3"},
		{"type": 2, "name":"beat0", "url":"../audio/bands/beat_0.mp3"},
		{"type": 2, "name":"beat1", "url":"../audio/bands/beat_1.mp3"},
		{"type": 2, "name":"beat2", "url":"../audio/bands/beat_2.mp3"},
		{"type": 3, "name":"drum0", "url":"../audio/bands/drum_0.mp3"},
		{"type": 3, "name":"drum1", "url":"../audio/bands/drum_1.mp3"},
		{"type": 3, "name":"drum2", "url":"../audio/bands/drum_2.mp3"},
		{"type": 4, "name":"exdrum0", "url":"../audio/bands/exdrum_0.mp3"},
		{"type": 4, "name":"exdrum1", "url":"../audio/bands/exdrum_1.mp3"},
		{"type": 4, "name":"exdrum2", "url":"../audio/bands/exdrum_2.mp3"},
		{"type": 5, "name":"synth0", "url":"../audio/bands/synth_0.mp3"},
		{"type": 5, "name":"synth1", "url":"../audio/bands/synth_1.mp3"},
		{"type": 5, "name":"synth2", "url":"../audio/bands/synth_2.mp3"},
		{"type": 6, "name":"pad0", "url":"../audio/bands/pad_0.mp3"},
		{"type": 6, "name":"pad1", "url":"../audio/bands/pad_1.mp3"},
		{"type": 6, "name":"pad2", "url":"../audio/bands/pad_2.mp3"},
		{"type": 7, "name":"pattern0", "url":"../audio/bands/pattern_0.mp3"},
		{"type": 7, "name":"pattern1", "url":"../audio/bands/pattern_1.mp3"},
		{"type": 7, "name":"pattern2", "url":"../audio/bands/pattern_2.mp3"},
		{"type": 8, "name":"piano0", "url":"../audio/bands/piano_0.mp3"},
		{"type": 8, "name":"piano1", "url":"../audio/bands/piano_1.mp3"},
		{"type": 8, "name":"piano2", "url":"../audio/bands/piano_2.mp3"},
		{"type": 9, "name":"vocal0", "url":"../audio/bands/vocal_0.wav"},
		{"type": 9, "name":"vocal1", "url":"../audio/bands/vocal_1.wav"},
		{"type": 9, "name":"vocal2", "url":"../audio/bands/vocal_2.wav"},	
		{"type": 10, "name":"other0", "url":"../audio/bands/other_0.mp3"},
		{"type": 10, "name":"other1", "url":"../audio/bands/other_1.mp3"},
		{"type": 10, "name":"other2", "url":"../audio/bands/other_2.mp3"}
	];

	var assetFileList = []; 
	
	var context = 0;
	var source = 0;
	var gainNode = 0;
	var preset;
	var tuna;
	var mChorus;
	var mPhaser;
	var mOverdrive;
	var mConvolver;
	var mFilter;
	var mTremolo;
	var mWahwah;	

	var btime = new Date();
	var playSources = [];

	this.init = function(){
		context = new webkitAudioContext();
		preset = new Preset();
		tuna = new Tuna(context);

		initAssets();
		initEffects();
		setInterval(checkTime, INTERVAL_TIME);
	}

	function checkTime(){
		btime = new Date();
	}

	function initAssets(){
		assetFileList = new Array();
	
		for(var i=0; i < assetInfoList.length; i++){
			var assetInfo = assetInfoList[i];
			assetFileList[i] = new Asset(context, i, assetInfo);
			assetFileList[i].load();
		}
	}

	function initEffects(){
		mChorus = new tuna.Chorus({
                 rate: 1.5,         //0.01 to 8+
                 feedback: 0.2,     //0 to 1+
                 delay: 0.0045,     //0 to 1
                 bypass: 0          //the value 1 starts the effect as bypassed, 0 or 1
    	});

		mPhaser = new tuna.Phaser({
                 rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
                 depth: 0.3,                    //0 to 1
                 feedback: 0.2,                 //0 to 1+
                 stereoPhase: 30,               //0 to 180
                 baseModulationFrequency: 700,  //500 to 1500
                 bypass: 0
        });

		mOverdrive = new tuna.Overdrive({
                    outputGain: 0.5,         //0 to 1+
                    drive: 0.7,              //0 to 1
                    curveAmount: 1,          //0 to 1
                    algorithmIndex: 3,       //0 to 5, selects one of our drive algorithms
                    bypass: 0
                });

		mConvolver = new tuna.Convolver({
                    highCut: 22050,                         //20 to 22050
                    lowCut: 20,                             //20 to 22050
                    dryLevel: 1,                            //0 to 1+
                    wetLevel: 1,                            //0 to 1+
                    level: 1,                               //0 to 1+, adjusts total output of both wet and dry
                    impulse: "../js/tuna/impulses/impulse_rev.wav",    //the path to your impulse response
                    bypass: 0
                });	

		mTremolo = new tuna.Tremolo({
                  intensity: 0.3,    //0 to 1
                  rate: 0.1,         //0.001 to 8
                  stereoPhase: 0,    //0 to 180
                  bypass: 0
              });
	}

	this.getPresetAssets = function(){
		return preset.assetIds;
	}

	this.setPresetAsset = function(type, assetIdx){
		preset.setAssetIdx(type, assetIdx);
	}

	this.setUserAsset = function(userId){
		var assetCount = preset.assetCount;
		var newAssetIdx = 1;
		preset.setAssetIdx(assetCount, newAssetIdx);

		var data = {type: assetCount, assetIdx: newAssetIdx};
		return data;
	}

	this.changeAsset = function(type, changeAssetIdx){
		var assetIds = preset.assetIds;
		var assetIdx = assetIds[type];
			
		if(assetIdx!=-1){
			var bufferNow = assetFileList[assetIdx].buffer;	
			var bufferLater = assetFileList[changeAssetIdx].buffer;
			preset.setAssetIdx(type, changeAssetIdx);
		
			changeHelper(bufferNow, bufferLater, type);
		}
	}

	this.playAsset = function(type, newAssetIdx){
		var bufferNow = assetFileList[newAssetIdx].buffer;
		playHelper(bufferNow, type, false);
	}

	this.changeValue = function(type, data){
		console.log(data);
		if(type==3 || type==5){
			mChorus.rate = data;
		}else if(type==1 || type==4){
			mPhaser.rate = data;
		}else if(type==6 || type==8){
			mConvolver.wetlevel = data;
		}else{
			mTremolo.rate = data;
		}	
	}

	var AudioBus = function(outputGain, type){
		this.input = context.createGainNode();
		var output = outputGain;
		output.gain.value = 0.2;
	
		//	delay = new tuna.Delay(),
		//	phaser = new tuna.Phaser();
		//this.input.connect(phaser.input);
		//phaser.connect(delay.input);
		//delay.connect(chorus.input);
		//chorus.connect(output);
		if(type==3 || type==5){
			this.input.connect(mChorus.input);
			mChorus.connect(output);
		}else if(type==1 || type==4){
			this.input.connect(mPhaser.input);
			mPhaser.connect(output);		
		}else if(type==6 || type==8){
			this.input.connect(mConvolver.input);
			mConvolver.connect(output);
		}else{
			this.input.connect(mTremolo.input);
			mTremolo.connect(output);
		}
	
		this.connect = function(target){
			output.connect(target);
		};
	};

	function createSource(buffer, type){
		var gainNode = context.createGainNode();
		var bus = new AudioBus(gainNode, type);
		
		var source = context.createBufferSource();
		source.buffer = buffer;
		//source.connect(gainNode);
		source.connect(bus.input);
		source.loop = true;
		source.loopEnd = 7;
		//gainNode.connect(context.destination);
		bus.connect(context.destination);

		return {
			source: source,
			gainNode: gainNode
		};
	}	

	function playHelper(bufferNow, type, isChanged){
		var playNow = createSource(bufferNow, type);		
		playSources[type] = playNow;

		var source = playNow.source;
		context.source = source;

		var gainNode = playNow.gainNode;
		var duration = bufferNow.duration;
		var currTime = context.currentTime;
	
		//fade in
		gainNode.gain.linearRampToValueAtTime(0, currTime);
		gainNode.gain.linearRampToValueAtTime(1, currTime + FADE_TIME);

		if(isChanged){
			source.start(0);
			
		}else{
			var this_time = new Date();
			var diff_time = this_time-btime;
console.log("diff:"+diff_time);
			setTimeout(function(){
				source.start(0);
			}, diff_time);	
		}
	}

	function changeHelper(bufferNow, bufferLater, type){
		var playNow = playSources[type];	
		var source = playNow.source;
		source.loop = false;
		
		context.source = source;

		var gainNode = playNow.gainNode;
		var duration = bufferNow.duration;
		var currTime = context.currentTime;
	
		//fade out
		gainNode.gain.linearRampToValueAtTime(1, currTime + duration - FADE_TIME);
		gainNode.gain.linearRampToValueAtTime(0, currTime + duration);

		context.timer = setTimeout(function(){
			playHelper(bufferLater, type, true);		
		}, (duration - FADE_TIME) * 1000);
	}

	this.changeVolume = function(type, value){
		var gainNode = playSources[type].gainNode; 
		gainNode.gain.value = value;
		console.log("vol:"+gainNode.gain.value);
	}

	this.stopSource = function(type){
		var source = playSources[type].source;
		source.stop(0);
	}

//////deprecated
	this.play = function(){
		for(var i=0; i<preset.assetCount; i++){

			var assetIdx = preset.assetIds[i];
		
			if(assetIdx!=-1){
				var asset = assetFileList[assetIdx];
				playHelper(asset.buffer, 0);
			}
		}	
	}

}).apply(bpaudio);
