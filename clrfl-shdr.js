var t0 = (new Date()).getTime();
var t = 1;

var gl;
var trianglePosBuffer;
var shaderProgram;
var vertexPos = [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0 ];

var c = document.createElement('canvas');
document.body.appendChild(c);

gl = c.getContext("experimental-webgl");

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

var arrNotes = [
  {'f':'50.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'100.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'100.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'0.0','l':4.},/* pause*/
  {'f':'50.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'100.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'100.0','l':.125},/**/
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'50.0','l':.125},
  {'f':'0.0','l':.125},
  {'f':'0.0','l':1.},/**/
];

// Add a translator to get notes from A3 to 440.00 etc

function playAll(e) {
    var o, t=ctx.currentTime, arrayLength = arrNotes.length, playlength = 0, bpm = 120;

    for (var i = 0; i < arrayLength; i++) {
        o = ctx.createOscillator();
        // 1 second divided by number of beats per second times number of beats (length of a note)
        playlength = 1/(bpm/60) * arrNotes[i].l;
        o.type = 'square';
        o.frequency.value = arrNotes[i].f;
        o.start(t);
        o.stop(t + playlength);
        t += playlength;
        o.connect(ctx.destination);
    }
}

playAll();

/*end music test*/

function main()
{
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
trianglePosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPos), gl.STATIC_DRAW);
trianglePosBuffer.itemSize = 2;
trianglePosBuffer.numItems = 6;
var minifiedFrag = "precision highp float;uniform float t;uniform vec2 res;mat3 n(float v){return mat3(1,0,0,0,cos(v),-sin(v),0,sin(v),cos(v));}mat3 s(float v){return mat3(cos(v),0,sin(v),0,1,0,-sin(v),0,cos(v));}mat3 x(float v){return mat3(cos(v),-sin(v),0,sin(v),cos(v),0,0,0,1);}float n(vec3 v,vec3 m){vec3 s=abs(v)-m;return min(max(s.r,max(s.g,s.b)),0.)+length(max(s,0.));}float s(in vec3 v,in vec3 s){vec2 m=vec2(length(v.rb),v.g),r=vec2(s.b*s.g/s.r,-s.b),g=r-m,c=vec2(dot(r,r),r.r*r.r),i=vec2(dot(r,g),r.r*g.r),d=max(i,0.)*i/c;return sqrt(dot(g,g)-max(d.r,d.g))*sign(max(m.g*r.r-m.r*r.g,g.g));}float x(vec3 v,vec3 s){return length(v)-s.r;}float f(vec3 v,vec3 s){vec2 m=vec2(length(v.rb)-s.r,v.g);return length(m)-s.g;}float f(in vec3 v){float m;if(t<10.)m=n(v,vec3(2.+1.6*sin(t/3.)));else if(t<20.)m=x(2.*v,vec3(5.+1.6*sin(t/3.)));else if(t<25.)m=n(2.*v,vec3(5.+sin(t)*2.+.1*sin(t/3.)));else if(t<30.)m=x(2.*v,vec3(5.+1.6*sin(t/3.)));else if(t<58.)m=s(.2*v,vec3(4.+sin(t/3.)));else;float r=1.;for(int f=0;f<3;f++){vec3 i=mod(v*r,2.)-1.;r*=3.;vec3 d;if(t<30.||t>58.)d=abs(sin(t)+abs(i));else d=abs(1.-3.*abs(i));float g=max(d.r,d.g),c=max(d.g,d.b),b=max(d.b,d.r),e=(min(g,min(c,b))-1.)/r;m=max(m,e);}return m;}vec3 v(vec3 v,float s){vec3 m=mod(v,s)-.5*s;return m;}float v(vec3 m){return f(v(m,13.+2.*cos(t))*s(.5*sin(t)+gl_FragCoord.r/res.r));}float m(vec3 m){return v(m*n(.1*sin(.5*t))*s(sin(.05*t))*x(.05*t));}vec3 m(vec3 v,vec3 s){vec3 r;float f=0.;for(int i=0;i<64;++i){r=v+f*s;float d=m(r);f+=d;if(d<.0001)return vec3(1.-float(i)/64.,gl_FragCoord.r/res.r+sin(t),gl_FragCoord.g/res.g+cos(.2*t))/(.5*sqrt(f+1.));}return vec3(0.);}void main(){float v=1.;vec3 r=vec3(0,0,v);float i=res.r/res.g;vec2 s=(2.*gl_FragCoord.rg/res.rg-1.)*vec2(i,1.);vec3 g=normalize(vec3(s,t)),c=m(r,g);gl_FragColor=vec4(.1+.9*c,1.);}";
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

if (t<58000){ t = (new Date()).getTime() - t0; }
gl.uniform1f(gl.getUniformLocation(shaderProgram, 't'), t*0.001);

gl.viewportWidth = c.width;
gl.viewportHeight = c.height;
gl.uniform2f(gl.getUniformLocation(shaderProgram, 'res'), gl.viewportWidth, gl.viewportHeight);

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