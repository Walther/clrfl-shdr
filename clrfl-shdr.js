// Demo by Walther
// Help w/ audio by Xard

var t0 = (new Date()).getTime();
var t = 1;

var gl;
var trianglePosBuffer;
var shaderProgram;
var vertexPos = [-1.0, -1.0, 1.0, -1.0, -1.0,  1.0, -1.0,  1.0, 1.0, -1.0, 1.0,  1.0 ];

// pseudo-random number vomiter
var seed = 2015;
prng = function(max, min) {
    max = max || 1;
    min = min || -1;
 
    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280;
 
    return min + rnd * (max - min);
}

var c = document.createElement('canvas');
document.body.appendChild(c);

gl = c.getContext("experimental-webgl");

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var ctx = new AudioContext();

/* Awesome tracker. Or maybe not that much. */

var kick = function(audiotime, frequency, volume){
  var o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.exponentialRampToValueAtTime(50.0, audiotime + 1);
  o.frequency.setValueAtTime(frequency, audiotime);

  var gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, audiotime);
  gain.gain.exponentialRampToValueAtTime(0.001, audiotime + 0.5);
  
  o.connect(gain);
  gain.connect(ctx.destination);

  return o;
};

var kicknotes = [
  {'f':'100.0','l':1,'v':1.0}
];

var snare = function(audiotime, frequency, volume){
  var o = ctx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.exponentialRampToValueAtTime(100.0, audiotime + 1);
  o.frequency.setValueAtTime(frequency, audiotime);

  var gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, audiotime);
  gain.gain.exponentialRampToValueAtTime(0.001, audiotime + 0.5);
  
  o.connect(gain);
  gain.connect(ctx.destination);

  return o;
}

var snarenotes = [
  {'f':'0.1','l':40,'v':0.1},

  {'f':'0.1','l':0.5,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},

  {'f':'0.1','l':0.5,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},

  {'f':'0.1','l':0.5,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},

  {'f':'0.1','l':0.5,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},

  {'f':'0.1','l':0.5,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1},
  {'f':'150.0','l':0.1,'v':0.2},
  {'f':'0.1','l':0.9,'v':0.1}
];

var sine1 = function(audiotime, frequency, volume){
  var o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.exponentialRampToValueAtTime(frequency, audiotime + 1);
  o.frequency.setValueAtTime(frequency*0.8, audiotime);

  var gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, audiotime);
  gain.gain.exponentialRampToValueAtTime(0.001, audiotime + 0.5);
  
  o.connect(gain);
  gain.connect(ctx.destination);

  return o;
}

var sine2 = function(audiotime, frequency, volume){
  var o = ctx.createOscillator();
  o.type = 'sine';
  o.frequency.exponentialRampToValueAtTime(frequency, audiotime + 1);
  o.frequency.setValueAtTime(frequency*1.2, audiotime);

  var gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, audiotime);
  gain.gain.exponentialRampToValueAtTime(0.5, audiotime + 4);
  
  o.connect(gain);
  gain.connect(ctx.destination);

  return o;
}

var noise = function(audiotime, frequency, volume){

  var bufferSize = 2 * ctx.sampleRate,
      noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate),
      output = noiseBuffer.getChannelData(0);
  for (var i = 0; i < bufferSize; i++) {
      output[i] = prng() * 2 - 1;
  }

  var whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;


  return whiteNoise;
}

var synth1notes = [
  {'f':'0.1','l':8,'v':0.1},
  {'f':'440.0','l':1,'v':0.5},
  {'f':'330.0','l':1,'v':0.5},
  {'f':'220.0','l':1,'v':0.5},
  {'f':'220.0','l':1,'v':0.5},
  {'f':'440.0','l':1,'v':0.5},
  {'f':'330.0','l':1,'v':0.5},
  {'f':'220.0','l':1,'v':0.5},
  {'f':'220.0','l':1,'v':0.5},
  {'f':'440.0','l':1,'v':0.5},
  {'f':'330.0','l':1,'v':0.5},
  {'f':'220.0','l':1,'v':0.5},
  {'f':'220.0','l':1,'v':0.5}
]

var synth2notes = [
  {'f':'0.1','l':16,'v':0.1},
  {'f':'660.0','l':1,'v':0.5},
  {'f':'495.0','l':1,'v':0.5},
  {'f':'330.0','l':1,'v':0.5},

  {'f':'660.0','l':0.5,'v':0.25},
  {'f':'660.0','l':0.5,'v':0.25},
  {'f':'495.0','l':0.5,'v':0.25},
  {'f':'495.0','l':0.5,'v':0.25},
  {'f':'330.0','l':0.5,'v':0.25},
  {'f':'330.0','l':0.5,'v':0.25},
  {'f':'660.0','l':0.5,'v':0.25},
  {'f':'660.0','l':0.5,'v':0.25},
  {'f':'495.0','l':0.5,'v':0.25},
  {'f':'495.0','l':0.5,'v':0.25},
]

var synth3notes = [
  {'f':'0.1','l':24,'v':0.4},
  {'f':'110.0','l':4,'v':0.4},
  {'f':'55.0','l':4,'v':0.4},
  {'f':'110.0','l':4,'v':0.4},
  {'f':'55.0','l':4,'v':0.4},

]

var noisenotes = [
  {'f':'220','l':4,'v':0.4},
]

function playAll(instrument, notes) {
    var o, audiotime=t, arrayLength = notes.length, playlength = 0, bpm = 120;

    while(true){
      if (audiotime >= 55) {break;}
      for (var i = 0; i < arrayLength; i++) {
          playlength = 1/(bpm/60) * notes[i].l;
          var o = instrument(audiotime, notes[i].f, notes[i].v);
          o.start(audiotime);
          o.stop(audiotime + playlength);
          audiotime += playlength;
      }
    }

};

playAll(kick, kicknotes);
playAll(snare, snarenotes);
playAll(sine1, synth1notes);
playAll(sine1, synth2notes);
playAll(sine2, synth3notes);
playAll(noise, noisenotes);

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