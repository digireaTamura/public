precision mediump float;

uniform vec4 uColor;
uniform float timer;
varying vec2 vTexCoord;

varying vec4 vColor;

uniform float uRotate;

void main(){
  vec4 color = uColor;
  // color.r =sin(uRotate + 0.2) + 1.0;
  // color.g =sin(uRotate + 0.1) + 1.0;
  float vTexCoord_xy = vTexCoord.x + vTexCoord.y;

  color.r =sin(vTexCoord_xy * 3.14 * 2.0) * 0.5 + 0.5;
  color.g =sin(vTexCoord_xy * 3.14 * 2.0 + 2.0) * 0.5 + 0.5;
  color.b =sin(vTexCoord_xy * 3.14 * 2.0 + 4.0) * 0.5 + 0.5;

  gl_FragColor = color;
}
