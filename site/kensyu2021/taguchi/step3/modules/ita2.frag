precision mediump float;

uniform vec4 uColor;
uniform float timer;
varying vec2 vTexCoord;

void main(){
  vec4 color = uColor;

  gl_FragColor = vec4( color );
}
