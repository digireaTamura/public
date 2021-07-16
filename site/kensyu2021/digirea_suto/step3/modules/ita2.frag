precision mediump float;

uniform vec4 uColor;
uniform float timer;
varying vec2 vTexCoord;
// varying vec4 diagonal;

void main(){
  vec4 color = uColor;
  // diagonal = vTexCoord.x + vTexCoord.y;
  color.x = sin(vTexCoord.y * 3.14 * 2.0) * 0.5 + 0.5;
  color.y = sin(vTexCoord.y * 3.14 * 2.0 + 2.0) * 0.5 + 0.5;
  color.z = sin(vTexCoord.y * 3.14 * 2.0 + 4.0) * 0.5 + 0.5;

  gl_FragColor = vec4( color );
}
