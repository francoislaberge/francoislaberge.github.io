(function(){

 
var cvs = document.getElementById('output'),
    ctx = cvs.getContext("2d"),
    width, height,
    k = [],
    camera,
    maxSpeed = Utils.kmPerHourToMetersPerSecond(80),
    frictionSpeed = Utils.kmPerHourToMetersPerSecond(45),
    brakeSpeed = Utils.kmPerHourToMetersPerSecond(25),
    rotationSpeed = Utils.degreeToRadian(130),  // Per Second
    cubeMesh,
    cubeSize = 0.8,
    pillars,
    pillarCountX = 5,
    pillarCountZ = 5,
    pillarRange = cubeSize*pillarCountX*35,
    car,
    carMeshInstance,
    renderer,
    clearColor = "rgba(0,0,0,1)",
    lastUpdate = (new Date()).getTime()/1000,
    fps = Math.floor(1000/60),
    steeringAccel,
    carAngle = 0,
    turningRangeStart = 1.0,
    turningRangeEnd = 6.0,
    turningRotationSpeed = Utils.degreeToRadian(180),  // Per Second
    particles,
    particlesPerGridX=10,
    particlesPerGridZ=10,
    particleViewDistance = 15,
    particleViewFalloff = 10,
    particlesGridSize = particleViewDistance*2,
    particleRadius = 0.05,
    cameraAnglesTracked = 20.0,
    cameraAngles = [],
    cameraAngleLastTime,
    cameraAngleDelay = 300.0/cameraAnglesTracked, // milliseconds
    cameraDistance = 5.0,
    maxWindowWidth = 1000000,//1024,
    maxWindowHeight = 1000000,//768,
    pillarsLeft,pillarsRight,pillarsTop,pillarsBottom;

  //
  // Initialize
  //
  
  // Setup Renderer
  renderer = Renderer(cvs);
  
  // Setup Cube Mesh
  cubeMesh = Mesh({
    points: [
        // Top Points
        Vec3(-cubeSize/2,cubeSize,cubeSize),
        Vec3(cubeSize/2,cubeSize,cubeSize),
        Vec3(cubeSize/2,cubeSize,-cubeSize),
        Vec3(-cubeSize/2,cubeSize,-cubeSize),
        // Bottom Points
        Vec3(-cubeSize/2,0,cubeSize),
        Vec3(cubeSize/2,0,cubeSize),
        Vec3(cubeSize/2,0,-cubeSize),
        Vec3(-cubeSize/2,0,-cubeSize)
      ],
    normals: [
        Vec3(-1,0,0),  // left
        Vec3(1,0,0),   // right
        Vec3(0,1,0),   // top
        Vec3(0,-1,0),  // bottom  
        Vec3(0,0,1),  // front
        Vec3(0,0,-1)    // back  
      ],
    faces: [
      // left
      {
        points:[0,3,7,4],
        normal: 0,
        color:[255,0,0]
      },
      // right
      {
        points:[2,1,5,6],
        normal: 1,
        color:[255,0,0]
      },
      // top
      {
        points:[0,1,2,3],
        normal: 2,
        color:[255,0,0]
      },
      // bottom
      {
        points:[5,4,7,6],
        normal: 3,
        color:[255,0,0]
      },
      // front
      {
        points:[1,0,4,5],
        normal: 4,
        color:[255,0,0]
      },
      // back
      {
        points:[3,2,6,7],
        normal: 5,
        color:[255,0,0]
      },
    ]
  });
  // Create Car Instance of the Cube Mesh
  carMeshInstance = MeshInstance(cubeMesh);
  renderer.addMeshInstance(carMeshInstance);

  // Create a Car
  function Car(carMeshInstance){
    this.meshInstance = carMeshInstance;
    this.velocity = Vec3();
    this.dir = Vec3(0,0,1);
  }
  car = new Car(carMeshInstance);

  // Create Some Pillars so that there is something to move relative to
  pillars = [];
  for(var z = 0; z<pillarCountZ; z++){
    for(var x = 0; x<pillarCountX; x++){
      var i = z*pillarCountX+x;
      pillars[i] = {
        meshInstance: MeshInstance(cubeMesh)
      };
      pillars[i].meshInstance.matrix43.setTranslation(
        Vec3(
          x*pillarRange/pillarCountX+cubeSize/2.0-pillarRange/2.0,0,
          z*pillarRange/pillarCountZ+cubeSize/2.0-pillarRange/2.0)
      );
      renderer.addMeshInstance(pillars[i].meshInstance);
    }
  }
  pillarsLeft = cubeSize/2.0-pillarRange/2.0;
  pillarsRight = (pillarCountX-1)*pillarRange/pillarCountX+cubeSize/2.0-pillarRange/2.0;
  pillarsTop = cubeSize/2.0-pillarRange/2.0;
  pillarsBottom = (pillarCountZ-1)*pillarRange/pillarCountZ+cubeSize/2.0-pillarRange/2.0
  
  // Create Some Particles
  particles = [];
  var colors = [
    [0,255,0],
    [0,255,0],
    [0,255,0],
    [0,255,0]
  ];
  for(var z = 0; z<2; z++){
    for(var x = 0; x<2; x++){
      var grid;
      particles.push([]);
      grid = particles[particles.length-1];
      for(var pz = 0; pz<particlesPerGridZ; pz++){
        for(var px = 0; px<particlesPerGridX; px++){
          grid.push({
            worldPos: Vec3(px*particlesGridSize/particlesPerGridX,0,pz*particlesGridSize/particlesPerGridZ),//Vec3(particlesGridSize+Math.random()*particlesGridSize,0,particlesGridSize+Math.random()*particlesGridSize),
            cameraPos: Vec3(),
            screenPos: Vec3(),
            radiusIn: particleRadius,
            radiusOut: particleRadius,
            colorIn: colors[z*2+x],//[0,0,255],
            colorOut: colors[z*2+x],//[0,0,255],
            doDraw: true
          });
          renderer.addParticle(grid[grid.length-1]);
        }
      };
    }
  }

  // Setup Camera
  camera = Camera();
  
  function applyFriction(vec,frictionToApply,forcesBeingApplied){
    if(vec.length()>frictionToApply){
      // Fiction is applied in the opposite direction as the velocity at a fixed rate
      vec.addSelf(vec.normalize().scale(-frictionToApply));        
    }
    // Stop the car if it's nearly stopped anyway, otherwise you get the annoying slight 
    // movement forever.
    else if(forcesBeingApplied){
      vec = Vec3();
    }
  }
  

  // Calling Reset system also sets up the system
  resetSystem();
  
  function update(){
    var newTime = (new Date()).getTime()/1000.0,
        deltaSeconds = newTime-lastUpdate,
        appliedVelocity,
        appliedFriction = deltaSeconds*frictionSpeed,
        forcesBeingApplied = false;
    lastUpdate = newTime;

//      ctx.fillStyle=clearColor;
//    ctx.fillRect(0,0,width,height);
    
    
    forcesBeingApplied = k[38]||k[40];
    
    // Process Key Inputs
      // Up
    if(k[38]){
      // Apply Force to velocity
      car.velocity.addSelf(car.dir.normalize().scale(maxSpeed*deltaSeconds));
    }
      // Down
    if(k[40]){
      appliedFriction = frictionSpeed*2*deltaSeconds;
      applyFriction(car.velocity,appliedFriction,forcesBeingApplied);
    }
      // Left
    if(k[37]){
      // Rotate Dir Left
      carAngle -= rotationSpeed*deltaSeconds;
    }
      // Right
    if(k[39]){
      // Rotate Dir Right
      carAngle += rotationSpeed*deltaSeconds;
    }
    // Process Accelerometer Based steering
    if(steeringAccel){
        // Turn Left
      if(steeringAccel.y>turningRangeStart){
        // Clamp turnPercentage to 1.0 to max out steering past that point
          // Rotate Dir Left
        var turnPercentage = Math.min((steeringAccel.y-turningRangeStart)/(10.0-turningRangeStart),1.0);
        carAngle -= turnPercentage*turningRotationSpeed*deltaSeconds;
      }
        // Turn Right
      else if(steeringAccel.y<-turningRangeStart){
        // Clamp turnPercentage to 1.0 to max out steering past that point
          // Rotate Dir Left
        var turnPercentage = Math.min((steeringAccel.y+turningRangeStart)/(10.0-turningRangeStart),1.0);
        carAngle -= turnPercentage*turningRotationSpeed*deltaSeconds;
      }
    }
    
    // Calculate Car.dir based on carAngle
    car.dir = Matrix43.makeYRotation(carAngle).transform(Vec3(0,0,1));
    
    // Apply Velocity
    appliedVelocity = car.velocity.scale(deltaSeconds);
    car.meshInstance.matrix43.setTranslation(car.meshInstance.matrix43.getTranslation().add(appliedVelocity));
    // Cap Car speed at maxSpeed
    if(car.velocity.length()>maxSpeed){
      car.velocity = car.velocity.normalize().scale(maxSpeed);
    }
    
    
    // Apply Friction
    appliedFriction = frictionSpeed*deltaSeconds;
    applyFriction(car.velocity,appliedFriction,forcesBeingApplied);

    // Clip Car to stay in Pillar Range
    var pos = car.meshInstance.matrix43.getTranslation();
      // Left
    if(pos.x<pillarsLeft){
      pos.x = pillarsLeft;
      car.velocity = Vec3();
    }
      // Right
    if(pos.x>pillarsRight){
      pos.x = pillarsRight;
      car.velocity = Vec3();
    }
      // Top
    if(pos.z<pillarsTop){
      pos.z = pillarsTop;
      car.velocity = Vec3();
    }
      // Bottom
    if(pos.z>pillarsBottom){
      pos.z = pillarsBottom
      car.velocity = Vec3();
    }
    car.meshInstance.matrix43.setTranslation(pos);

    // The Car Should Now look the same way it's going
    // TODO: Do something more interesting than this
    // I'd love some fun powerslidey physics
    car.meshInstance.matrix43.lookAtSelf(car.meshInstance.matrix43.getTranslation().add(car.dir.normalize().scale(10)));
    
    function setDesiredCameraAngle(a){
      if(cameraAnglesTracked==1){
        return a;
      }
      
      var newTime = (new Date()).getTime(),
          diffTime = (newTime-cameraAngleLastTime)/cameraAngleDelay;
      
      // If this is the first time set it all up and skip the regular logic.
      if(cameraAngleLastTime===undefined){
        cameraAngleLastTime = newTime;
        for(var i = 0; i<cameraAnglesTracked;i++){
          cameraAngles.push(a);
        }
        //console.log('init');
        return a;
      }
      
      // Add a new Angle if enough time has passed
      if((diffTime)>1.0){
        cameraAngleLastTime = newTime;
        
        cameraAngles.shift();
        // Add new one, remove oldest one
        cameraAngles.push(a);
        
        diffTime-=1.0;
        //console.log('new='+diffTime+',count='+cameraAngles.length);
        
      }
      
      // Blend between two oldest points
      var prev = cameraAngles[0],
          next = cameraAngles[1];
          
      return prev*(1-diffTime)+next*diffTime;
    }
    
    var newCameraMatrix43 = Matrix43();
    
    // Calculate new Camera Position based on Car angle
    newCameraMatrix43 = Matrix43.makeYRotation(setDesiredCameraAngle(carAngle));
    newCameraMatrix43.setTranslation(
      newCameraMatrix43.getZAxis().scale(-cameraDistance).          //
      add(car.meshInstance.matrix43.getTranslation()).   // // Have camera 10 units back
      add(Vec3(0,2,0))
    );
    newCameraMatrix43.lookAtSelf(car.meshInstance.matrix43.getTranslation());
   /* newCameraMatrix43 = setDesiredCamera(newCameraMatrix43);
    newCameraMatrix43.setTranslation(newCameraMatrix43.getTranslation().add(Vec3(0,2,0.0)));
    newCameraMatrix43.lookAtSelf(car.meshInstance.matrix43.getTranslation());*/
    camera.setMatrix(newCameraMatrix43);

    // Transform Pillars
    for(var i = 0; i<pillars.length; i++){
      pillars[i].meshInstance.transform(camera);
    }
    
    // Transform Particles
    var pos = camera.getPos(),
        tileParticleX = particlesGridSize*Math.round((pos.x)/(particlesGridSize)),
  	    tileParticleZ = particlesGridSize*Math.round((pos.z)/(particlesGridSize));
    for(var g= 0; g<particles.length; g++){
      var grid = particles[g],
          offsets = [
            [tileParticleX-particlesGridSize,tileParticleZ],
            [tileParticleX,tileParticleZ],
            [tileParticleX-particlesGridSize,tileParticleZ-particlesGridSize],
            [tileParticleX,tileParticleZ-particlesGridSize]
          ];
      for(var p= 0; p<grid.length; p++){
        var fallOff,
            particle = grid[p],
            worldPos = particle.worldPos.add(Vec3(offsets[g][0],0,offsets[g][1]));
        
        particle.cameraPos = camera.matrix43.inverseTransform(worldPos),
        fallOff = 1.0-particle.cameraPos.z/particleViewDistance;
          
        // If it's beyond the view distance set the drawFlag to false and don't bother with color calc
        if(fallOff<0.0){
          particle.doDraw = false;
          continue;
        }
        
        // Make falloff brighter closer and then have a quick fade out near the far clipping plane
        if(fallOff<particleViewFalloff/particleViewDistance){
          fallOff = fallOff/((particleViewDistance-particleViewFalloff)/particleViewDistance);
        }
        else{
          fallOff = 1.0;
        }
        
        particle.doDraw = true;
        
        particle.screenPos = camera.project(particle.cameraPos);
        particle.colorOut = [Math.floor(particle.colorIn[0]*fallOff),Math.floor(particle.colorIn[1]*fallOff),Math.floor(particle.colorIn[2]*fallOff)];
        
        particle.radiusOut = camera.projectRadius(worldPos,particle.radiusIn);
      }
    }
    
    // Transform Car
    carMeshInstance.transform(camera);
    
    // Draw Scene
    renderer.drawScene(camera,clearColor);      
    
    if(0){
      // Print out the car's velocity
      renderer.drawRect({
        left: 20,
        right:20+800,
        top: height-70,
        bottom: height-40
      },"rgba(255,0,0,1)");
      renderer.drawText("position=("+(camera.matrix43.getTranslation().x)+","+(camera.matrix43.getTranslation().z)+")",20,height-50, 20);
      
      // Print out the tile X/Z
      renderer.drawRect({
        left: 20,
        right:20+800,
        top: height-110,
        bottom: height-80
      },"rgba(255,0,0,1)");
      
      renderer.drawText("tile=("+tileParticleX+","+tileParticleZ+")",20,height-90, 20);
    }
  }
  
  function resetSystem(){
    car.meshInstance.matrix43 = Matrix43();
    car.meshInstance.matrix43.setTranslation(Vec3(0,0,0));
    
    car.velocity = Vec3();
    car.dir = Vec3(0,0,1);
    camera.setPos(Vec3(0,10,-10));
    cameraPositions = [camera.getPos()];
    cameras = [];
    camera.lookAtSelf(car.meshInstance.matrix43.getTranslation());
    
  }
  
  function resize(){
 	  // Do resize twice (Necessary when window shrinks, and scroll bars are included in window size)
  	// 	First pass shrinks canvas to fit in parent window (the clientWidth/Height is actually smaller than this because of scroll bars)
  	//	Second pass the canvas stretches to fit into the newly non-scroll-barred window
  	//	TODO: Do this a better way
    for(var i = 0; i<2; i++){
  	  
      if(document.documentElement.clientWidth==0||document.documentElement.clientHeight==0)
        break;
     
      var fullWidth = document.documentElement.clientWidth,
          fullHeight = document.documentElement.clientHeight;
      
      width = Math.min(fullWidth,maxWindowWidth);
      height = Math.min(fullHeight,maxWindowHeight);
      
      camera.setScreenSize(width,height);
      
      cvs.style.position='absolute';
      cvs.style.marginLeft=Math.floor((fullWidth-width)/2)+'px';
      cvs.style.marginTop=Math.floor((fullHeight-height)/2)+'px';
      cvs.style.width = width+"px";
      cvs.style.height = height+"px";
      
      cvs.width=width;
      cvs.height=height;
      
      ctx.fillStyle="rgba(0,0,0,1)";
      ctx.fillRect(0,0,width,height);
  	}
 	}
 	resize();
 	
 	window.addEventListener('resize',function(e){
 	  resize();
 	},0);
  
  
  document.addEventListener('keypress',function(e){
    if(e.charCode==32)
      resetSystem();
  },0);
  
  document.addEventListener('keydown',function(e){
    k[e.keyCode]=true;
  },0);
  document.addEventListener('keyup',function(e){
    k[e.keyCode]=false;
  },0);
  
  document.addEventListener('touchstart',function(e){
    k[38]=true;
  },0);
  document.addEventListener('touchend',function(e){
    k[38]=false;
  },0);

  interval = setInterval(update,fps);
  
})();