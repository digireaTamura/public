precision mediump float;

uniform sampler2D uTex;
uniform sampler2D uTex2;
uniform vec4 uColor;
uniform float uTimer;
varying vec2 vTexCoord;


#define PI 3.14159265359;

void main(){
  vec4 disp = texture2D(uTex2,fract(vTexCoord + uTimer)) * uColor;

  vec2 newUv = vTexCoord + vec2(disp.r,disp.g)* 0.1;

  vec4 dest = texture2D(uTex, newUv);

  vec4 color = dest * vec4(sin((vTexCoord.y + vTexCoord.x)* fract(uTimer) * 3.14 * 2.0)*0.5 + 0.5,
                            sin((vTexCoord.y + vTexCoord.x) * fract(uTimer) * 3.14 * 2.0 + 2.0)*0.5 + 0.5,
                            sin((vTexCoord.y + vTexCoord.x) * fract(uTimer) * 3.14 * 2.0 + 4.0)*0.5 + 0.5, 
                            1.0) 
                            * uColor;

  gl_FragColor = vec4( color );
}
