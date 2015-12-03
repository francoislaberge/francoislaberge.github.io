var canvas, ctx;
var particles = [];
var NUM_PARTICLES = 30;
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
var	peakdata_max_height = 20.0;

// waveform data
var waveformData = new Array(256);
var wave_width = 4.0;

// equalizer data
var eqData = new Array(256);







function getColorFromRadius(){
	
}

function Particle() {
	this.x = Math.random() * canvas.width;
	this.y = Math.random() * canvas.height;
	this.prevx = this.x;
	this.prevy = this.y;

	this.xvel = Math.random() * speed - speed/2.0;
	this.yvel = Math.random() * speed - speed/2.0;
}

Particle.prototype.update = function() {
	this.prevx = this.x;
	this.prevy = this.y;
	this.x += this.xvel;
	this.y += this.yvel;

	this.yvel += 0.1;

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
		canvas_clear(canvas_rgba(0,0,0,0.25));
		
		// Draw modifier stream
			// Clear background each time
		//canvas_rect(0,canvas.height-stream_max_height*4.0,radius_peakdata_averager.length*stream_width,canvas.height,canvas_rgba(0,0,0,255));	
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
							y = canvas.height/2.0+(waveformData[i])*10.0*peakdata_max_height;
						return {x:x,y:y};
					}
				
					//var width = waveformData.stream_width/2.0;
					for(var i = 0; i<waveformData.length; i++){
						if(waveformData[i]!=undefined){
							var p = getWavePoint(i);
							
							// Draw a line between this point and the next(except on the last point)
							if(i<(waveformData.length-1)){
								var n = getWavePoint(i+1);
								canvas_line(p,n,color);
							}
						}
					}
				}
			break;
			case 2:
				if(eqData.length!=0){
				
					var width = canvas.width/eqData.length;
				
					function getEQPoint(i){
						var x = i*width,
							y = canvas.height-(1.0+eqData[i]/2.0)*1.0*peakdata_max_height;
						return {x:x,y:y};
					}
				
					var width = stream_width/2.0;
					for(var i = 0; i<eqData.length; i++){
						if(eqData[i]!=undefined){
							var p = getEQPoint(i);
							
							// Draw a line between this point and the next(except on the last point)
							if(i<(eqData.length-1)){
								var n = getEQPoint(i+1);
								canvas_line(p,n,color);
							}
						}
					}
				}
			break;
		}
		
		var radius = canvas_get_average_peakdata()*radius_max;
		
		ctx.save();
		ctx.lineWidth = 2;
		
		var doit = false;
		for(var i = 0; i < NUM_PARTICLES; i++) {
			particles[i].update();

			// offset position 
				particles[i].x += canvas_rand_range_int(-radius,radius);
				particles[i].y += canvas_rand_range_int(-radius,radius);

			if(doit){
				canvas_line(	{x: particles[i].x, y: particles[i].y},
							{x: particles[i].x - particles[i].xvel*tailLengthMultiplier, y: particles[i].y - particles[i].yvel*tailLengthMultiplier},
							color);
				canvas_circle(	{x: particles[i].x, y: particles[i].y},
						radius,
						color);
			}
			else{
				
				
				canvas_line(	{x: particles[i].x, y: particles[i].y},
							{x: particles[i].prevx, y: particles[i].prevy},
							color);
			}		
		}
		ctx.restore();
		
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
	return radius_peakdata_averager[radius_peakdata_averager.length-1]*10.0;
}

	// Draw Line
function canvas_line(p0,p1,c){
	//ctx.lineWidth = "2";
	ctx.strokeStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
	
	ctx.beginPath();
	ctx.moveTo(p0.x, p0.y);
	ctx.lineTo(p1.x, p1.y);
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
	return {r:r,g:g,b:b,a:a}
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
		canvas_clear(canvas_rgba(0,0,0,1));
	}
}

// Initialize things here.
function canvas_init() {
	// Store the canvas element for easier/more-efficient access later
	canvas = document.getElementById("theCanvas");
	// Same for the drawing context of the canvas element
	ctx = canvas.getContext("2d");
	
	canvas_resize();
	
	canvas_clear(canvas_rgba(0,0,0,1.0));
	
	radius_peakdata_averager = new Array(averager_count);
	for(var i = 0; i < radius_peakdata_averager.length; i++){
		radius_peakdata_averager[i] = 0.0;
	}
	
	// Create some particles
	for(var i = 0; i < NUM_PARTICLES; i++) {
		particles[i] = new Particle();
	}

	// Run the canvas_loop
	canvas_loop();
}