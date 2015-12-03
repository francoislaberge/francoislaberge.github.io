// 
// Vector 3
//
var inVec3Constructor = false;
function Vec3(x,y,z){
  if(inVec3Constructor==true){
    this.x = x||0;this.y=y||0;this.z=z||0;
  }
  else{
    inVec3Constructor=true;
    var v = new Vec3(x,y,z);
    inVec3Constructor=false; 
    return v;
  }
}

Vec3.prototype.dot = function(v){
  var d = this.x*v.x+this.y*v.y+this.z*v.z;
  return d;
}

Vec3.prototype.crossSelf = function (v){
  this.x = (this.y * v.z) - (this.z * v.y);
  this.y = (this.z * v.x) - (this.x * v.z);
  this.z = (this.x * v.y) - (this.y * v.x);
}

Vec3.prototype.cross = function(v){
  return Vec3((this.y * v.z) - (this.z * v.y),
              (this.z * v.x) - (this.x * v.z),
              (this.x * v.y) - (this.y * v.x));
}

Vec3.prototype.addSelf = function (v){
  this.x += v.x; this.y += v.y; this.z += v.z;
  return this;
}
Vec3.prototype.add = function(v){
  var result = Vec3(this.x+v.x,this.y+v.y,this.z+v.z);
  return result;
}

Vec3.prototype.subSelf = function (v){
  this.x -= v.x; this.y -= v.y; this.z -= v.z;
  return this;
}
Vec3.prototype.sub = function(v){
  return Vec3(this.x-v.x,this.y-v.y,this.z-v.z);
}

Vec3.prototype.subSelf = function(v){
  this.x -= v.x; this.y -= v.y; this.z -= v.z;
  return this;
}
Vec3.prototype.sub = function(v){
  return Vec3(this.x-v.x,this.y-v.y,this.z-v.z);
}
Vec3.prototype.scaleSelf = function(s){
  this.x *= s; this.y *= s; this.z *= s;
  return this;
}
Vec3.prototype.scale = function(s){
  return Vec3(this.x*s,this.y*s,this.z*s);
}

Vec3.prototype.length = function(){
  return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)     
}

Vec3.prototype.normalizeSelf = function (){
  var len = this.length(), invLen = 1/(len?len:0.0001);
  this.x *= invLen; this.y *= invLen; this.z *= invLen;
  return this;
}

Vec3.prototype.normalize = function(){
  return Vec3(this.x,this.y,this.z).normalizeSelf();
}

var inVec2Constructor = false;
function Vec2(x,y,z){
  if(inVec2Constructor==true){
    this.x = x;this.y=y;
  }
  else{
    inVec2Constructor=true;
    var v = new Vec2(x,y);
    inVec2Constructor=false; 
    return v;
  }
}

Vec2.prototype.dotSelf = function (v){
  this.x = this.x*v.x; this.y = this.y*v.y;
  return this;
}

Vec2.prototype.dot = function(v){
  return Vec2(this.x*v.x, this.y*v.y);
}

Vec2.prototype.addSelf = function (v){
  this.x += v.x; this.y += v.y;
  return this;
}
Vec2.prototype.add = function(v){
  return Vec2(this.x+v.x,this.y+v.y);
}

Vec2.prototype.subSelf = function (v){
  this.x -= v.x; this.y -= v.y;
  return this;
}
Vec2.prototype.sub = function(v){
  return Vec2(this.x-v.x,this.y-v.y);
}

Vec2.prototype.subSelf = function(v){
  this.x -= v.x; this.y -= v.y;
  return this;
}
Vec2.prototype.sub = function(v){
  return Vec2(this.x-v.x,this.y-v.y);
}
Vec2.prototype.scaleSelf = function(s){
  this.x *= s; this.y *= s;
  return this;
}
Vec2.prototype.scale = function(s){
  return Vec2(this.x*s,this.y*s);
}

Vec2.prototype.length = function(){
  return Math.sqrt(this.x*this.x+this.y*this.y);
}

Vec2.prototype.normalizeSelf = function (){
  var len = this.length(), invLen = 1/(len?len:0.0001);
  this.x *= invLen; this.y *= invLen;
  return this;
}

Vec2.prototype.normalize = function(){
  return Vec2(this.x,this.y).normalizeSelf();
}

Utils = {};
Utils.degreeToRadian = function(d){
  return d/360*Math.PI*2;
}
Utils.radianToDegree = function(r){
  return r/(Math.PI*2)*360;
}

Utils.kmPerHourToMetersPerSecond = function(kmHr){
  var mSec = kmHr*1000/60/60;
  return mSec;
}

/*  Utils.cloneShallow = function(obj){
  var clone = {};
}*/

// 
// Matrix 4x3
//
var inMatrix43Constructor = false;
function Matrix43(m){
  if(inMatrix43Constructor==true){
    // If a Matrix was provided to the constructor clone it
    if(m!==undefined){
      this.m00 = m.m00; this.m10 = m.m10; this.m20 = m.m20; this.m30 = m.m30;
      this.m01 = m.m01; this.m11 = m.m11; this.m21 = m.m21; this.m31 = m.m31;
      this.m02 = m.m02; this.m12 = m.m12; this.m22 = m.m22; this.m32 = m.m32;
    }
    // Initialize to an Identity Matrix
    else{
      this.m00 = 1; this.m10 = 0; this.m20 = 0; this.m30 = 0;
      this.m01 = 0; this.m11 = 1; this.m21 = 0; this.m31 = 0;
      this.m02 = 0; this.m12 = 0; this.m22 = 1; this.m32 = 0;
    }
  }
  else{
    inMatrix43Constructor=true;
    var m = new Matrix43(m);
    inMatrix43Constructor=false; 
    return m;
  }
}

Matrix43.prototype.resetSelf = function (){
  this.m00 = 1; this.m10 = 0; this.m20 = 0; this.m30 = 0;
  this.m01 = 0; this.m11 = 1; this.m21 = 0; this.m31 = 0;
  this.m02 = 0; this.m12 = 0; this.m22 = 1; this.m32 = 0;
}

Matrix43.prototype.concat = function (m){
  
}

Matrix43.prototype.inverseTransform = function (v){
  // Translate
  var output = Vec3(v.x-this.m30,v.y-this.m31,v.z-this.m32);
  // Rotate
  var newP = Vec3(this.m00,this.m01,this.m02).scale(output.x).add(
             Vec3(this.m10,this.m11,this.m12).scale(output.y).add(
             Vec3(this.m20,this.m21,this.m22).scale(output.z)));
  return Vec3(newP.x,newP.y,newP.z);
}

Matrix43.prototype.transform = function (v){
  // Rotate
  var newP = Vec3(this.m00,this.m10,this.m20).scale(v.x).add(
             Vec3(this.m01,this.m11,this.m21).scale(v.y).add(
             Vec3(this.m02,this.m12,this.m22).scale(v.z)));
  // Translate
  var newNewP = newP.add(Vec3(this.m30,this.m31,this.m32));
  return newNewP;
}

Matrix43.prototype.setTranslation = function (t){
  this.m30 = t.x;
  this.m31 = t.y;
  this.m32 = t.z;
}

Matrix43.prototype.getTranslation = function (){
  var t = Vec3(this.m30,this.m31,this.m32);
  return t;
}

Matrix43.prototype.getRotation = function (v){
  var m = Matrix43();
  m.m00 = this.m00; m.m10 = this.m10; m.m20 = this.m20;
  m.m01 = this.m01; m.m11 = this.m11; m.m21 = this.m21;
  m.m02 = this.m02; m.m12 = this.m12; m.m22 = this.m22;
  return m;
}

Matrix43.prototype.getXAxis = function (){
  var t = Vec3(this.m00,this.m10,this.m20);
  return t;
}

Matrix43.prototype.getYAxis = function (){
  var t = Vec3(this.m01,this.m11,this.m21);
  return t;
}

Matrix43.prototype.getZAxis = function (){
  var t = Vec3(this.m02,this.m12,this.m22);
  return t;
}

Matrix43.prototype.lookAtSelf = function (p){
  var zAxis = p.sub(this.getTranslation()).normalize(),
      xAxis = Vec3(0,1,0).cross(zAxis).normalize(),
      yAxis = zAxis.cross(xAxis).normalize();
  this.m00 = xAxis.x; this.m10 = xAxis.y; this.m20 = xAxis.z;
  this.m01 = yAxis.x; this.m11 = yAxis.y; this.m21 = yAxis.z;
  this.m02 = zAxis.x; this.m12 = zAxis.y; this.m22 = zAxis.z;
}

// Static Functions
Matrix43.makeYRotation = function (a){
  var m = Matrix43(),
      rA = a;//Math.PI*2/8;
  m.m00 = Math.cos(rA); m.m10 = 0; m.m20 = -Math.sin(rA);
  m.m02 = Math.sin(rA); m.m12 = 0; m.m22 = Math.cos(rA);
  return m;
}

// 
// Mesh
//
var inMeshConstructor = false;
function Mesh(data){
  if(inMeshConstructor==true){
    this.points = data.points;
    this.normals = data.normals;
    this.indexes = data.indexes;
    this.faces = data.faces;
  }
  else{
    inMeshConstructor=true;
    var c = new Mesh(data);
    inMeshConstructor=false; 
    return c;
  }
}

// Transform mesh and return a mesh instance
  
// 
// Mesh Instance
//
var inMeshInstanceConstructor = false;
function MeshInstance(mesh){
  if(inMeshInstanceConstructor==true){
    this.mesh = mesh;
    this.matrix43 = Matrix43();
    this.initialized = false;
  }
  else{
    inMeshInstanceConstructor=true;
    var c = new MeshInstance(mesh);
    inMeshInstanceConstructor=false; 
    return c;
  }
}

MeshInstance.prototype.transform = function(camera){
  var meshPoints = this.mesh.points,
      meshPointsLen = meshPoints.length,
      instance3DPoints,
      instance2DPoints,
      meshNormals = this.mesh.normals,
      meshNormalsLen = meshNormals.length,
      instanceNormals,
      normalsRotateMatrix43 = camera.matrix43.getRotation();
      
  // Transform points
    // Create Points array if it hasn't been created
  if(this.initialized==false){
    this.points3D = [];
    this.points2D = [];
  }
  instance3DPoints = this.points3D;
  instance2DPoints = this.points2D;
  for(var p=0; p<meshPointsLen; p++){
    var worldSpace = this.matrix43.transform(meshPoints[p]);
    instance3DPoints[p] = camera.matrix43.inverseTransform(worldSpace);
    instance2DPoints[p] = camera.project(instance3DPoints[p]);
  }
  // Transform normals
    // Create Points array if it hasn't been created
  if(this.initialized==false){
    this.normals = [];
  }
  instanceNormals = this.normals;
  for(var n=0; n<meshNormalsLen; n++){
    var worldSpaceRotation = this.matrix43.getRotation().transform(meshNormals[n]);
        newP = normalsRotateMatrix43.inverseTransform(worldSpaceRotation);
    instanceNormals[n] = newP;
  }
  
  this.initialized = true;
}

// 
// Camera
//
var inCameraConstructor = false;
function Camera(){
  if(inCameraConstructor==true){
    this.matrix43 = Matrix43();
    // Size Render Canvas
    this.width = 0; this.height = 0;
    this.projectionScale = 0;
  }
  else{
    inCameraConstructor=true;
    var c = new Camera();
    inCameraConstructor=false; 
    return c;
  }
}

Camera.prototype.setScreenSize = function (width,height){
  this.width = width; this.height = height;
  
  this.projectionScale = Math.max(this.width/2,this.height/2);
}

Camera.prototype.project = function (p){
  var inverseZ = 1/(p.z==0.0?0.0001:p.z);
  
  // We flip the Y during projection to have the Y axis grow in the upwards screen dimension
  // TODO: Is this right to do, or should I be manipulated the Camera Matrix to get this result?
  return Vec2(p.x*inverseZ*this.projectionScale+this.width/2,-p.y*inverseZ*this.projectionScale+this.height/2);
}

Camera.prototype.setPos = function (v){
  return this.matrix43.setTranslation(v);
}
Camera.prototype.getPos = function (v){
  return this.matrix43.getTranslation();
}

Camera.prototype.lookAtSelf = function(p){
  this.matrix43.lookAtSelf(p);
}
Camera.prototype.projectRadius = function(p,r){
  var p = this.matrix43.inverseTransform(p);
	return Math.floor(r/p.z*this.projectionScale);
}
Camera.prototype.setMatrix = function(m){
  this.matrix43 = m;
}


// 
// Renderer
//
var inRendererConstructor = false;
function Renderer(cvs){
  if(inRendererConstructor==true){
    this.cvs = cvs;
    this.ctx = cvs.getContext("2d");
    this.instances = [];
    this.renderList = [];
    this.particles = [];
  }
  else{
    inRendererConstructor=true;
    var r = new Renderer(cvs);
    inRendererConstructor=false; 
    return r;
  }
}

Renderer.prototype.drawFace = function (f,p3D,p2D,n,dot,camera){
  // Remove Faces with any points behind the camera
  for(var i = 0; i<f.points.length; i++){
    if(p3D[f.points[i]].z<0)
      return;
  }

  //  if(n[f.normal].z>0)
  //  return;
  
  var color = "rgba("+Math.floor(f.color[0]*dot)+","+Math.floor(f.color[1]*dot)+","+Math.floor(f.color[2]*dot)+",1)";//+Math.floor(-n[f.normal].z*255)+",1)";
  this.ctx.fillStyle=color;
  this.ctx.strokeStyle=color;
  this.ctx.lineWidth=1;

  // ba is fill path
	this.ctx.beginPath();  
	// Move to the start point of the face's poly
	this.ctx.moveTo(Math.floor(p2D[f.points[0]].x),Math.floor(p2D[f.points[0]].y));
	for(var i = 1; i<f.points.length; i++){
	 this.ctx.lineTo(Math.floor(p2D[f.points[i]].x),Math.floor(p2D[f.points[i]].y));
	}
	// f is fill
	if(1)
	 this.ctx.fill();
  this.ctx.stroke();
  
  // Draw Normals if flag is set
  
  if(0){
    var center,
        normalLength,
        endPoint,
        start,end;
    center = Vec3();
    function getFaceCenter(){
      for(var i = 0; i<f.points.length; i++){
        center.addSelf(p3D[f.points[i]].scale(1.0/f.points.length));
      }
    }
    getFaceCenter();
    
    normalLength = 0.5;
    endPoint = center.add(n[f.normal].scale(normalLength));
    start = camera.project(center);
    end = camera.project(endPoint);
    this.drawLine(start.x,start.y,end.x,end.y,2,'rgba(255,255,255,1)');
  }
}

Renderer.prototype.drawScene = function (camera,clearColor){

  // Clear all previously drawn Faces
  for(var f = 0; f<this.renderList.length; f++){
    this.drawRect(this.renderList[f].screenRect,clearColor);//"rgba(0,255,0,1)");
  }
  this.renderList = [];
  
  var cameraPos = camera.getPos(),
      renderer = this,
      fatten = 2
  
  // Make sure our Renderer Context is setup right
  this.ctx.lineWidth=2;
  this.ctx.lineCap = this.ctx.lineJoin = "round";

  // Find the closest Points in each face
  function furthestPoint(f,p3D){
    var maxZ=-1;
    for(var p=0; p<f.points.length;p++){
      // Makes sure no points are behind the camera.
      // If one is return -1 to indicate it should not be drawn
      
      var z = p3D[f.points[p]].z;
      if(z<0)
        return -1;
      else if(z>maxZ){
        maxZ = z;
      }
    }
    return maxZ;
  }
  
  function calculateScreenRect(f,p2D){
    var r = {};
    for(var p = 0; p<f.points.length; p++){
      if(r.left===undefined||r.left<p2D[f.points[p]].x)
        r.left = p2D[f.points[p]].x;
      if(r.right===undefined||r.right>p2D[f.points[p]].x)
        r.right = p2D[f.points[p]].x;
      if(r.top===undefined||r.top<p2D[f.points[p]].y)
        r.top = p2D[f.points[p]].y;
      if(r.bottom===undefined||r.bottom>p2D[f.points[p]].y)
        r.bottom = p2D[f.points[p]].y; 
    }
    
    r.left+=fatten; r.right-=fatten, r.top+=fatten; r.bottom-=fatten;
    return r;
  }
  
  // Adds Faces to face list for back to front sorting before drawing
  for(var i = 0; i<this.instances.length; i++){
    var inst = this.instances[i];
    for(var f = 0; f<inst.mesh.faces.length; f++){
      var maxZ = furthestPoint(inst.mesh.faces[f],inst.points3D);
      if(maxZ==-1){
        continue;
      }
      (function(){
        // Back face Cull
        var dir = inst.points3D[inst.mesh.faces[f].points[0]].scale(-1).normalize(),
            dot = dir.dot(inst.normals[inst.mesh.faces[f].normal]);
        
        if(dot<0){
          return;
        }
        
        renderer.renderList.push({
          face:inst.mesh.faces[f],
          points3D: inst.points3D,
          points2D:inst.points2D,
          normals: inst.normals,
          maxZ:maxZ,
          dot:dot,
          screenRect:calculateScreenRect(inst.mesh.faces[f],inst.points2D)
        });
      })();
    }        
  }
  
  for(var i = 0; i<this.particles.length; i++){
    // Don't draw particles behind the camera
    if(this.particles[i].cameraPos.z<0||this.particles[i].doDraw==false)
      continue;
    var rect = {
        left: this.particles[i].screenPos.x-this.particles[i].radiusOut-fatten,
        right: this.particles[i].screenPos.x+this.particles[i].radiusOut+fatten,
        top: this.particles[i].screenPos.y-this.particles[i].radiusOut-fatten,
        bottom: this.particles[i].screenPos.y+this.particles[i].radiusOut+fatten
      };
    renderer.renderList.push({
      screenPos:this.particles[i].screenPos,
      maxZ:this.particles[i].cameraPos.z,
      radius:this.particles[i].radiusOut,
      color: "rgba("+this.particles[i].colorOut[0]+","+this.particles[i].colorOut[1]+","+this.particles[i].colorOut[2]+",1)",
      screenRect: rect
    });
  }
  
  // Sort Meshes back to front.
  this.renderList.sort(function(a,b){
    if(a.maxZ>b.maxZ)
      return -1;
    else
      return 1;
  });
  
  // Draw Faces/Particles
  for(var r = 0; r<this.renderList.length; r++){
    // Is it a face
    if('face' in this.renderList[r]){
      this.drawFace(this.renderList[r].face,this.renderList[r].points3D,this.renderList[r].points2D,this.renderList[r].normals,this.renderList[r].dot,camera);
    }
    else{
      this.drawCircle(
        this.renderList[r].screenPos.x,this.renderList[r].screenPos.y,
        this.renderList[r].radius,
        this.renderList[r].color
      );
    }

  }
}

Renderer.prototype.addMeshInstance = function(instance){
  this.instances.push(instance);
}

Renderer.prototype.addParticle = function(particle){
  this.particles.push(particle);
}

Renderer.prototype.drawText = function (str,x,y,size){
  this.ctx.save();
  this.ctx.fillStyle='rgba(255,255,255,1)';
  this.ctx.font = Math.floor(size)+"px sans-serif";
  this.ctx.fillText(str,x,y);
  this.ctx.restore();
}

Renderer.prototype.drawLine = function (x0,y0,x1,y1,width,color){
  this.ctx.strokeStyle=color;
  this.ctx.lineWidth=width;
  this.ctx.lineCap = this.ctx.lineJoin = "round";

	this.ctx.beginPath();  
	this.ctx.moveTo(Math.floor(x0),Math.floor(y0));
  this.ctx.lineTo(Math.floor(x1),Math.floor(y1));
  this.ctx.stroke();
}

Renderer.prototype.drawRect = function (r,color){
  this.ctx.fillStyle=color;
	this.ctx.beginPath();  
	this.ctx.moveTo(Math.floor(r.left),Math.floor(r.top));
  this.ctx.lineTo(Math.floor(r.right),Math.floor(r.top));
  this.ctx.lineTo(Math.floor(r.right),Math.floor(r.bottom));
  this.ctx.lineTo(Math.floor(r.left),Math.floor(r.bottom));
  this.ctx.fill();
}

Renderer.prototype.drawCircle = function (x,y,r,color){
  if(Math.floor(r)<0)
		return;
	this.ctx.fillStyle = color;
	
	//draw a canvas_circle
	this.ctx.beginPath();
	this.ctx.arc(Math.floor(x), Math.floor(y), Math.floor(r), 0, Math.PI*2, true);
	this.ctx.closePath();
	this.ctx.fill();
}