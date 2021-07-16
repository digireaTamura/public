precision mediump float;

uniform sampler2D uTex;
uniform vec4 uColor;
uniform float uTimer;
varying vec2 vTexCoord;

void main(){
  vec4 dest = texture2D(uTex, vTexCoord); 
  vec4 color = mix(vec4(0,0,0,1), dest * uColor, step(vTexCoord.y,(uTimer-9.43)*0.1 ));

  //枠を作る
  vec4 waku_col = vec4(1.0,1.0,0.5,1.0);

  //stepで第二引数が閾値（第一引数）未満なら0、以上なら1になる。名前はフラグにすべきよね  
  float flag_waku = step(0.0,0.05-vTexCoord.x);
  float flag_waku2= step(0.95,vTexCoord.x);

  float flag_waku3 = step(0.0,0.05-vTexCoord.y);
  float flag_waku4 = step(0.95,vTexCoord.y);

  //mixは第3引数の値のバランスで第一引数と第二引数を合わせるもの。
  //第3引数が0ならcolorだけになり、waku_colは無視される。
  color = mix(color, waku_col,step(0.1,flag_waku));
  color = mix(color, waku_col,step(0.1,flag_waku2));
  color = mix(color, waku_col,step(0.1,flag_waku3));
  color = mix(color, waku_col,step(0.1,flag_waku4));
  

  // if ( vTexCoord.x < 0.1 ||  vTexCoord.x > 0.9 || vTexCoord.y < 0.1 ||  vTexCoord.y > 0.9) // ********** STAGE: DRAW SOME POINTS
	// {
  //     color.r =1.0;
  //     color.g =1.0;
  //     color.b =1.0;
  // }

  gl_FragColor = vec4( color );
}
