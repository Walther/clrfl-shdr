var gl;
var trianglePosBuffer;
var shaderProgram;
var vertexPos = [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0 ];

var t0 = (new Date()).getTime();
var t;

var body = document.getElementsByTagName('body')[0];
document.body.style="background-color:#111;margin:0;padding:0;overflow:hidden;"
var c = document.createElement('canvas');
c.style="margin:0;padding:0;float:left;display:block;position:absolute;top:0;";
document.getElementById('c').style="display:none;";
document.body.appendChild(c);

gl = c.getContext("experimental-webgl");

function main()
{
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
trianglePosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
trianglePosBuffer.itemSize = 2;
trianglePosBuffer.numItems = 6;
var minifiedFrag = "precision highp float; uniform float t; uniform vec2 resolution; mat3 rX(float a){return mat3(1,0,0,0,cos(a),-sin(a),0,sin(a),cos(a));} mat3 rY(float a){return mat3(cos(a),0,sin(a),0,1,0,-sin(a),0,cos(a));} mat3 rZ(float a){return mat3(cos(a),-sin(a),0,sin(a),cos(a),0,0,0,1);} float cube( vec3 p, vec3 b ){vec3 d = abs(p) - b; return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));} float map( in vec3 p ){float d = cube(p,vec3(2.0 + 1.6*sin(t/2.0))); float s = 1.0; for( int m=0; m<3; m++ ){vec3 a = mod( p*s, 2.0 )-1.0; s *= 3.0; vec3 r = abs(1.0 - 3.0*abs(a)); float da = max(r.x,r.y); float db = max(r.y,r.z); float dc = max(r.z,r.x); float c = (min(da,min(db,dc))-1.0)/s; d = max(d,c); } return d; } vec3 rep(vec3 pos, float repeat) {vec3 rep = mod(pos, repeat) - 0.5*repeat; return rep; } float cubeField(vec3 pos) {return map(rep(pos, 13.0 + 2.0*cos(t) /* distance between cubes*/) * rY(0.5*sin(t) /* twisting */  + (1.5+sin(t))*gl_FragCoord.x/resolution.x)); } float geometry( vec3 pos) {return cubeField(pos * rX(0.1*sin(0.5*t)) * rY(sin(0.05*t)) * rZ(0.05*t) ); } vec3 rayMarch( vec3 camera, vec3 dir ) {vec3 rayPos; float rayDist = 0.0; for (int i = 0; i < 64; ++i) {rayPos = camera + rayDist*dir; float curDist = geometry(rayPos); rayDist += curDist; if (curDist < 0.0001) {return vec3((1.0-(float(i)/64.0)), (gl_FragCoord.x/resolution.x + sin(t)), (gl_FragCoord.y/resolution.y + cos(0.2*t)) ) / (0.5*sqrt(rayDist +1.0)); } } return vec3(0.0); } void main(){float move = sin(t); vec3 camera = vec3(0,0,move); float aspect = resolution.x / resolution.y; vec2 uv = (2.0* gl_FragCoord.xy / resolution.xy -1.0) * vec2(aspect, 1.0); vec3 dir = normalize(vec3(uv, 5.0+-sin(t))); vec3 color = rayMarch(camera, dir); gl_FragColor = vec4(0.1 + 0.9*color, 1.0); }";
var minifiedVert = "attribute vec3 aVertexPosition; void main(void) {gl_Position = vec4(aVertexPosition, 1.0); }";

var fragmentShader = getShader(gl, minifiedFrag, "fragment");
var vertexShader = getShader(gl, minifiedVert, "vertex");

shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);

if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
alert("Could not initialise shaders");
}

gl.useProgram(shaderProgram); 

shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
tick();
}

function tick(){window.requestAnimationFrame(tick);
draw();
}

function draw()
{
gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

t = (new Date()).getTime() - t0;
gl.uniform1f(gl.getUniformLocation(shaderProgram, 't'), t*0.001);

gl.viewportWidth = c.width;
gl.viewportHeight = c.height;
gl.uniform2f(gl.getUniformLocation(shaderProgram, 'resolution'), gl.viewportWidth, gl.viewportHeight);

gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, trianglePosBuffer.itemSize, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function getShader(gl, id, type) {
var shader;
if (type == "fragment") {
shader = gl.createShader(gl.FRAGMENT_SHADER);
} else if (type == "vertex") {
shader = gl.createShader(gl.VERTEX_SHADER);
} else {
return null;
}

gl.shaderSource(shader, id);
gl.compileShader(shader);
return shader;
}

(function() { //borrowed from https://jsfiddle.net/jaredwilli/qFuDr/
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {c.width = window.innerWidth;
c.height = window.innerHeight;
drawStuff(); 
}
resizeCanvas();
function drawStuff() {main();
}
})();