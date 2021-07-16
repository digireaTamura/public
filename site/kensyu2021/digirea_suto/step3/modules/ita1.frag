precision mediump float;

uniform sampler2D uTex;
uniform vec4 uColor;
uniform float uTimer;
varying vec2 vTexCoord;

void main(){
  vec4 dest = texture2D(uTex, vTexCoord); 

  // 線形補間
  vec4 color = mix(vec4(0,0,0,1), dest * uColor, step(vTexCoord.y, (uTimer - 9.43) * 0.1));

  vec4 frame = vec4(1.0, 1.0, 0.5, 1.0);

  // X方向
  float flagFrameX = step(0.0, 0.05 - vTexCoord.x);
  float flagFrameSideX = step(0.95, vTexCoord.x);
  color = mix(color, frame, step(0.1, flagFrameX));
  color = mix(color, frame, step(0.1, flagFrameSideX));

  // y方向
  float flagFrameY = step(0.0, 0.05 - vTexCoord.y);
  float flagFrameSideY = step(0.95, vTexCoord.y);
  color = mix(color, frame, step(0.1, flagFrameY));
  color = mix(color, frame, step(0.1, flagFrameSideY));

  gl_FragColor = vec4( color );
}
