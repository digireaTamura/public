precision mediump float;

uniform vec4 uColor;
uniform float timer;
varying vec2 vTexCoord;

void main(){

  float param = vTexCoord.x + vTexCoord.y ;
  
  vec4 color = vec4(sin(param * 3.14)*0.5 + 0.5, 
                    sin(param * 3.14 +1.5 )*0.5 + 0.5,  
                    cos(param * 3.14 +3.0 )*0.5 + 0.5,
                    1.0
                    );
  

  gl_FragColor = vec4( color );
}
