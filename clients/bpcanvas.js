var bpcanvas = {};
(function(){

	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var width = canvas.width;
	var height = canvas.height;

//background
	var backgroundGradient = context.createRadialGradient(width/2, height/2, 0, width/2, height/2, height/1.1);
	backgroundGradient.addColorStop(0, '#333');
	backgroundGradient.addColorStop(1, '#111');

	var circles = [];
//circle colors
	/*
	var green = 'rgba(50,255,0,1)';
	var lightGreen = 'rgba(150,255,0,1)';
	var lighterGreen = 'rgba(200,255,0,1)';
	var yellow = 'rgba(255,255,0,1)';
	var orange = 'rgba(255,200,0,1)';
	var red = 'rgba(255,0,0,1)';
	*/
	var circlecolor = 'rgba(50,255,0,1)';

	var drawBackground = function(){
		context.globalAlpha = 1.0;
		context.fillStyle = backgroundGradient;
		context.fillRect(0, 0, width, height);
	}	

	
	var drawCircles = function(){

		for(var i=0; i<circles.length; i++){
			/////paint background circles
			var r,g,b,a;

			var ex = circles[i].x, ey = circles[i].y;
			var gradblur = context.createRadialGradient(ex, ey, 0, ex, ey, circles[i].radius+10);
			context.beginPath();

			r = Math.random()*255*1.8;
			g = Math.random()*255*1.8;
			b = Math.random()*255*1.8;

			r = r >> 0;
			g = g >> 0;
			b = b >> 0;
			a = circles[i].alpha;

			var edgecolor3 = "rgba("+r+","+g+","+b+",0.15)";
			var edgecolor4 = "rgba("+r+","+g+","+b+",0)";

			gradblur.addColorStop(0, circles[i].color);
			gradblur.addColorStop(0.9,edgecolor3);
			gradblur.addColorStop(1,edgecolor4);

			context.fillStyle = gradblur;
			context.globalAlpha = circles[i].alpha;
			context.arc(ex, ey, circles[i].radius+10, 0, Math.PI*2, false);
			context.closePath();		
			context.fill();
		
			circles[i].alpha -= 0.01;
			circles[i].radius += 0.5;			
	
			if(circles[i].alpha < 0){
				//circles.splice(i, 1);
		
				//initialize circle param
				circles[i].alpha = 1;
				circles[i].radius = 1;
			}
			
		}
	}

	var play = function(){
		drawBackground();
		drawCircles();
	}

	var rand = function(min, max){
		return Math.random() * (max-min) + min;
	}

	var scale = function(x, a1, a2, b1, b2){
		return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
	}

	var addCircle = function(x,y, userIdx, color){
		var circle = {};
		circle.userIdx = userIdx;
		circle.x = x;
		circle.y = y;
		circle.radius = 1;

		circlecolor = 'rgba('+hexToRgb(color)+', 1)';
console.log("color:"+circlecolor);
		circle.color = circlecolor;		
		circle.alpha = 1.0;

		return circle;
	}

	function hexToRgb(hex) {
    	var bigint = parseInt(hex, 16);
    	var r = (bigint >> 16) & 255;
    	var g = (bigint >> 8) & 255;
   		var b = bigint & 255;

    	return r + "," + g + "," + b;
	}	

	this.changeWaveType = function(arrcolors){
		
		var uniqidx = arrcolors[0].t;
		var uniqcolor = arrcolors[0].c;
		var r,g,b;
		for(c in arrcolors){
			if(arrcolors[c].t==1){
				r = arrcolors[c].c;
			}else if(arrcolors[c].t==2){
				g = arrcolors[c].c;
			}else if(arrcolors[c].t==3){
				b = arrcolors[c].c;
			}
		}
		circlecolor = 'rgba('+r+','+g+','+b+', 1)'; 
	}

	this.init = function(){
		var frameRate = 30;
		var intervalTime = 1000/frameRate;
		setInterval( play, intervalTime);
	}

	this.pushCircle = function(userIdx, color){
		var new_x = Math.random()*canvas.width;
		var new_y = Math.random()*canvas.height;
		var new_circle = addCircle(new_x, new_y, userIdx, color);
		circles.push(new_circle);
	}

	this.changeCircle = function(userIdx, data){
		for(var i=0; i<circles.length; i++){
			if(circles[i].userIdx == userIdx){
				r = 255*data;
				g = 255;
				b = 255*data;				

				r = r >> 0;
				b = b >> 0;

				circles[i].color = 'rgba('+r+','+g+','+b+', 1)';
				break;
			}
		}
	}	

	this.dropCircle = function(userIdx){
		for(var i=0; i<circles.length; i++){
			if(circles[i].userIdx == userIdx){
				circles.splice(i, 1);
				break;
			}		
		}
	}

}).apply(bpcanvas);

