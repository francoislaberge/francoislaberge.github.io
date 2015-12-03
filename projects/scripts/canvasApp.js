function CanvasApp(settings){
	
	if(settings.seed)
		Math.random(settings.seed);
	
	
	// get canvas element
	var	canvas = document.getElementById(settings.element),
		ctx = canvas.getContext("2d"),
		thisApp = this,
		interval = null,
		loopCB = null;
		
	function loop(){
		loopCB(thisApp);
	}
	
	this.start  = function(newLoopCB){
		if(interval)
			return false;
		loopCB = newLoopCB;
		interval = setInterval(loop, 1);
		return true;
	}
	
	this.stop = function(){
		if(interval==NULL)
			return false; 
		loopCB = NULL;
		clearInterval(interval);
		interval=null;
		return true;
	}
	
	// Access
	
	// Get the canvas associated with this app
	this.canvas = function(){
		return canvas;
	}
	
	// Get the canvas associated with this app
	this.ctx = function(){
		return canvas;
	}
	
	// Get the width of the canvas
	this.width = function(){
		return canvas.width;
	}
	
	// Get the height of the canvas
	this.height = function(){
		return canvas.height;
	}
	
	// Randomness
	this.randomRange = function(min,max){
		var r = min+(max-min)*Math.random();
		r = Math.min(Math.max(r,min),max);
		return r;
	}
	this.randomRangeInt = function(min,max){
		min = Math.floor(min);
		max = Math.floor(max);
		var r = min+(max-min)*Math.random();
		r = Math.min(Math.max(r,min),max);
		r = Math.floor(r);
		return r;
	}
	this.randomColor = function(){
		var c = thisApp.rgba(
			thisApp.randomRangeInt(0,255),
			thisApp.randomRangeInt(0,255),
			thisApp.randomRangeInt(0,255),
			1.0
		);
		return c;
	}
	
	// Drawing functions
	
	// Draw Line
	this.line = function(x0,y0,x1,y1,c){
		ctx.lineWidth = "2";
		ctx.strokeStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
		
		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.stroke();
		ctx.closePath();
	}
	// Draw Circle
	this.circle = function (x,y,r,c){
		this.ellipse(x,y,r,r,c);
		
	}
	// Draw Rect
	this.rect = function(l,t,w,h,c){
		ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
		ctx.fillRect(Math.floor(l), Math.floor(t), Math.floor(w),Math.floor(h));
	}
	
	// Clear Canvas
	this.clear = function(c){
		ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	// Utility
	this.rgba = function(r,g,b,a){
		return {r:r,g:g,b:b,a:a};
	}
	
	this.poly = function(p,c){
		if(p.length==0)
			return;
		ctx.beginPath();  
		ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
		for(var i = 0; i<p.length; i++){
			if(i==0)
				ctx.moveTo(p[i][0],p[i][1]);  
			ctx.lineTo(p[i][0],p[i][1]);  
		}
		ctx.fill();
	}
			
	this.ellipse = function(x,y,width,height,c){
		
		ctx.fillStyle = "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
		x = x || 0;
		y = y || 0;
		
		if (width <= 0 && height <= 0) {
			return;
		}
		
		ctx.beginPath();
		
		width *= 2;	
		height *= 2;
		
	      var offsetStart = 0;
	
	      // Shortcut for drawing a circle
	   //   if (width === height) {
	  //      ctx.arc(x - offsetStart, y - offsetStart, width / 2, 0, Math.PI*2, false);
	    //  } else {
	        var w = width / 2,
	          h = height / 2,
	          C = 0.5522847498307933;
	        var c_x = C * w,
	          c_y = C * h;
	
	        // TODO: Audit
	        ctx.moveTo(x + w, y);
	        ctx.bezierCurveTo(x + w, y - c_y, x + c_x, y - h, x, y - h);
	        ctx.bezierCurveTo(x - c_x, y - h, x - w, y - c_y, x - w, y);
	        ctx.bezierCurveTo(x - w, y + c_y, x - c_x, y + h, x, y + h);
	        ctx.bezierCurveTo(x + c_x, y + h, x + w, y + c_y, x + w, y);
	    //  }
	
		var doFill = true;
	
	      if (doFill) {
	        ctx.fill();
	      }
	    //  if (doStroke) {
	     //   ctx.stroke();
	      //}
	
	      ctx.closePath();
	}
		
}