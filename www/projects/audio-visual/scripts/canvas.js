var canvas, ctx;
var particles = [];
var NUM_PARTICLES = 50;
var tailLengthMultiplier = 1.0;
var radius_max = 5.0;
var radius_peakdata_averager = [];
var averager_count = 100;
var speed = 20.0;
var fps = 60.0;
var paused = true;

// data streams
var whichMode = 1;	// 0=peakData, 1=waveformData, 2=Equalizer?

// peak data
var stream_width = 10.0;
var	peakdata_max_height = 30.0;

// waveform data
var waveformData = new Array(256);
var wave_width = 4.0;

// equalizer data
var eqData = new Array(256);

var tuner = 1.0;





function getColorFromRadius(){
	
}

function Particle(faster) {
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.prevx = this.x;
	this.prevy = this.y;

//	this.xvel = Math.random() * speed - speed/2.0;
//	this.yvel = Math.random() * speed - speed/2.0;
	this.angle = Math.random()*360/Math.PI;
	this.angleSpeed = 0.1*tuner;
	if(faster){
		this.distanceSpeed = 0.01*tuner;//Math.random()*10;
	} else {
		this.distanceSpeed = 0.055*tuner;
	}
	
	this.distance = Math.random()*Math.min(canvas.width,canvas.height);
}

Particle.prototype.update = function(volume) {
	
	this.prevx = this.x;
	this.prevy = this.y;
	this.x = Math.sin(this.angle)*this.distance+canvas.width/2;
	this.y = Math.cos(this.angle)*this.distance+canvas.height/2;


	this.distance-=Math.max(this.distance*this.distanceSpeed,4);
	if(Math.random()>0.8){
		var offset = (volume-radius_max/2)*Math.random()*100*tuner;
		this.distance+=offset;
		this.prevx = this.x;
		this.prevy = this.y;
		this.x = Math.sin(this.angle)*this.distance+canvas.width/2;
		this.y = Math.cos(this.angle)*this.distance+canvas.height/2;
	}
	this.angle += this.angleSpeed;
	
	
	if(this.distance<3){
		this.distance = Math.random()*Math.min(canvas.width,canvas.height);
		return false;
	} else {
		return true;
	}

	
	//this.x += this.xvel;
	//this.y += this.yvel;

	//this.yvel += 0.1;

	/*

	if (this.x > canvas.width){
		this.x = canvas.width-1;
		this.xvel = -this.xvel;
	}	
	if (this.x < 0){
		this.x = 1;
		this.xvel = -this.xvel;
	}
	
	if (this.y > canvas.height){
		this.y = canvas.height-1;
		this.yvel = -this.yvel;
	}	
	if (this.y < 0){
		this.y = 1;
		this.yvel = -this.yvel;
	}
	*/
}

function canvas_rand_range_int(min,max){
	return Math.floor((Math.random()*(max-min))+min);
}

function canvas_get_random_color(){
	return canvas_rgba(canvas_rand_range_int(0.0,255),canvas_rand_range_int(0.0,255),canvas_rand_range_int(0.0,255),255);
}

function canvas_loop() {
	
	var color = canvas_rgba(255,255,255,1);//;//canvas_get_random_color();
	
	
	
	if(!paused){
		var volume = canvas_get_average_peakdata(),
		size = volume*radius_max;
		
		canvas_clear(canvas_rgba(255,204,51,(volume*0.35)+0.25));
		
		// Draw modifier stream
			// Clear background each time
		//canvas_rect(0,canvas.height-stream_max_height*4.0,radius_peakdata_averager.length*stream_width,canvas.height,canvas_rgba(0,0,0,255));	
		
		ctx.save();
		ctx.lineWidth = 2;
		
		var maxDistance = Math.min(canvas.width/2,canvas.height/2)
		
		var doit = true;
		for(var i = 0; i < NUM_PARTICLES; i++) {
			particles[i].update(volume);

			

			if(doit){
				canvas_line(	{x: particles[i].x, y: particles[i].y},
							{x: particles[i].x - (particles[i].x-particles[i].prevx)*tailLengthMultiplier, y: particles[i].y - (particles[i].y-particles[i].prevy)*tailLengthMultiplier},
							canvas_rgba(255,0,255,1),size*25+3);
				canvas_circle(	{x: particles[i].x, y: particles[i].y},
						size*25+3.0,
						canvas_rgba(255,0,255,1));
			}
			else{
				
				// offset position 
				var dx = particles[i].x + canvas_rand_range_int(-radius,size);
				var dy = particles[i].y + canvas_rand_range_int(-radius,size);
				
				
				
				canvas_line(	{x: particles[i].prevx, y: particles[i].prevy},
							{x: dx, y: dy},
							canvas_rgba(0,0,0,1));
							
				
				
				//particles[i].prevx = dx;
				//particles[i].prevy = dy;
			}		
		}
		ctx.restore();

		
		switch(whichMode){
			case 0:
				function getPeakPoint(i){
					var x = i*stream_width,
						y = canvas.height-radius_peakdata_averager[i]*10.0*peakdata_max_height;
					return {x:x,y:y};
				}
			
				ctx.save();
				ctx.lineWidth = stream_width/2;
				ctx.lineCap = "round";
				for(var i = 0; i < radius_peakdata_averager.length; i++){
					var p = getPeakPoint(i);
					
					// Draw a line between this point and the next(except on the last point)
					if(i<(radius_peakdata_averager.length-1)){
						var n = getPeakPoint(i+1);
						canvas_line(p,n,color);
					}

					//canvas_rect(x,y,x+stream_width,canvas.height,color);
					/*canvas_circle(	{x: p.x+stream_width/2.0, y: p.y},
							stream_width/2.0,
							color);*/
					
				}
				ctx.restore();
			break;
			case 1:
				if(waveformData.length!=0){
					var width = canvas.width/waveformData.length;
					
					function getWavePoint(i){
						var x = i*width,
							y = canvas.height/2.0+(waveformData[i])*15.0*peakdata_max_height;
						return {x:x,y:y};
					}
				
					//var width = waveformData.stream_width/2.0;
					var polyLine = [];
					for(var i = 0; i<waveformData.length; i++){
						if(waveformData[i]!=undefined){
							var p = getWavePoint(i);
							polyLine[i] = [p.x,p.y]
						}
					}
					if(polyLine.length>2){
						canvas_polyline(polyLine,canvas_rgba(0,0,255,1),5.0+volume*35);
					}
				}
			break;
			case 2:
				if(eqData.length!=0){
				
					var width = canvas.width/eqData.length;
				
					function getEQPoint(i){
						var x = i*width,
							y = canvas.height-(1.0+eqData[i]/2.0)*1.0*peakdata_max_height*10;
						return {x:x,y:y};
					}
				
					var width = stream_width/2.0;
					for(var i = 0; i<eqData.length; i++){
						if(eqData[i]!=undefined){
							var p = getEQPoint(i);
							
							// Draw a line between this point and the next(except on the last point)
							if(i<(eqData.length-1)){
								var n = getEQPoint(i+1);
								canvas_line(p,n,canvas_rgba(0,0,0,1));
							}
						}
					}
				}
			break;
		}
		

		
				
	}
	setTimeout(canvas_loop, 1000.0/fps	);
}

// Drawing functions
	// Set Modifier (Called by sound system to modify things by a value between [0.0,1.0], which should be based on music volume)
function canvas_set_peakdata(peakdata){
	// Shift all modifier values down the array stack, making room for new one, and pushing off the oldest one
	for(var i = 0; i < radius_peakdata_averager.length-1; i++){
		radius_peakdata_averager[i] = radius_peakdata_averager[i+1];
	}
	
	// Set last element as new modifier
	radius_peakdata_averager[radius_peakdata_averager.length-1]=peakdata;
	//console.log(peakdata);
}

function canvas_get_average_peakdata(){
	var total = 0.0;
	for(var i = 0; i < radius_peakdata_averager.length; i++){
		total += radius_peakdata_averager[i];
	}
	var volume = radius_peakdata_averager[radius_peakdata_averager.length-1];//*10.0;
	if(volume>1.1){
		var aa = 100;
	}
	return volume;
}

	// Draw Line
function canvas_line(p0,p1,c,lineWidth){
	//ctx.lineWidth = "2";
	ctx.strokeStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
	ctx.lineWidth = lineWidth;
	ctx.beginPath();
	ctx.moveTo(p0.x, p0.y);
	ctx.lineTo(p1.x, p1.y);
	ctx.stroke();
	ctx.closePath();
}
	// Draw Poly Line
function canvas_polyline(points,c,lineWidth){
	//ctx.lineWidth = "2";
	ctx.strokeStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
	ctx.lineWidth = lineWidth;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.beginPath();
	ctx.moveTo(points[0][0], points[0][1]);
	for(var i = 1; i<points.length;i++){
		ctx.lineTo(points[i][0], points[i][1]);
	}
	ctx.stroke();
	ctx.closePath();
}
	// Draw Rect
function canvas_rect(left,top,right,bottom,c){
	ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
	ctx.fillRect(left,top,right-left,bottom-top);
}

	// Draw Circle
function canvas_circle(p,r,c){
	
	// Circle of 0 radius cause an exception in Google Chrome?!
	if(r==0)
		return;
	ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
	
	//draw a canvas_circle
	ctx.beginPath();
	ctx.arc(p.x, p.y, r, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}
	// canvas_clear Canvas
function canvas_clear(c){
	canvas_rect(0, 0, canvas.width, canvas.height,c);
}
	// Utility
function canvas_rgba(r,g,b,a){
	return {r:Math.floor(r),g:Math.floor(g),b:Math.floor(b),a:a}
}

function canvas_resize(){
		
	// Do resize twice (Necessary when window shrinks, and scroll bars are included in window size)
	// 	First pass shrinks canvas to fit in parent window (the clientWidth/Height is actually smaller than this because of scroll bars)
	//	Second pass the canvas stretches to fit into the newly non-scroll-barred window
	//	TODO: Do this a better way
	for(var i = 0; i<2; i++){
		var w=document.documentElement.clientWidth;
		var h=document.documentElement.clientHeight;

		canvas.style.position='absolute';
		canvas.width=w;
		canvas.height=h;
		canvas_clear(canvas_rgba(255,204,51,1.0));
	}
}

// Initialize things here.
function canvas_init() {
	// Store the canvas element for easier/more-efficient access later
	canvas = document.getElementById("theCanvas");
	// Same for the drawing context of the canvas element
	ctx = canvas.getContext("2d");
	
	canvas_resize();
	
	canvas_clear(canvas_rgba(255,204,51,1.0));
	
	radius_peakdata_averager = new Array(averager_count);
	for(var i = 0; i < radius_peakdata_averager.length; i++){
		radius_peakdata_averager[i] = 0.0;
	}
	
	// Create some particles
	for(var i = 0; i < NUM_PARTICLES; i++) {
		particles[i] = new Particle(i<NUM_PARTICLES*0.40);
	}

	// Run the canvas_loop
	canvas_loop();
}