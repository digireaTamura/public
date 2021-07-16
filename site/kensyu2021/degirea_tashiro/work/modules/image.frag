uniform sampler2D uTex;
uniform vec4 uColor;
uniform float uAlpha;
uniform float uMono;
uniform float uLight;
uniform float uRainbow;
varying vec2 vTexCoord;

void main(){
  vec4 tex = texture2D(uTex, vTexCoord); 
  vec4 color = mix(vec4(0,0,0,0), tex * uColor, uAlpha);
  color.r += uLight;
  color.g += uLight;
  color.b += uLight;
  float c = color.r*0.3 + color.g*0.59 + color.b*0.11;
  vec4 mono = vec4(c, c, c, 1.0);
  color = mix(color, mono, uMono);

  vec4 rainbow = vec4(sin(2.0 * 3.14 * vTexCoord.x + uRainbow) / 2.0 + 0.5,
                    sin(-3.14 / 2.0 + 2.0 * 3.14 * vTexCoord.x + uRainbow) / 2.0 + 0.5,
                    sin(3.14 / 2.0 + 2.0 * 3.14 * vTexCoord.x + uRainbow) / 2.0 + 0.5,
                    1.0);
  color = mix(color, rainbow, 0.5*step(0.1, uRainbow));
 
  gl_FragColor = vec4( color );
  //gl_FragColor = tex * color;
}
