uniform sampler2D uTex;
uniform float uTime;
varying vec2 vTexCoord;


void main() {
    vec4 tex = texture2D(uTex,vTexCoord);
    // vec4 color_tmp = vec4(1.0);
    // vec4 color = mix(vec4(0,0,0,1), tex *  color_tmp,  step(vTexCoord.y,(uTimer-9.43)*0.1 ));

    //枠を作る
    vec4 waku_col = vec4(0.3,0.3,0.3,1.0);

    //stepで第二引数が閾値（第一引数）未満なら0、以上なら1になる。名前はフラグにすべきよね  
    float flag_waku = step(0.0,0.02-vTexCoord.x);
    float flag_waku2= step(0.98,vTexCoord.x);

    float flag_waku3 = step(0.0,0.02-vTexCoord.y);
    float flag_waku4 = step(0.98,vTexCoord.y);

    //mixは第3引数の値のバランスで第一引数と第二引数を合わせるもの。
    //第3引数が0ならcolorだけになり、waku_colは無視される。
    tex = mix(tex, waku_col,step(0.1,flag_waku));
    tex = mix(tex, waku_col,step(0.1,flag_waku2));
    tex = mix(tex, waku_col,step(0.1,flag_waku3));
    tex = mix(tex, waku_col,step(0.1,flag_waku4));

    gl_FragColor = tex;
}