varying vec2 vUv;

uniform vec4 uColor;
uniform float uChroma;
uniform float uMosaic;
uniform float uTileSize;
uniform float uTime;
uniform float uMomove;
uniform bool uGlitch;
uniform sampler2D uTex;

float box(vec2 st, float size)
{
    size = 0.5 + size * 0.5;
    st = step(st, vec2(size)) * step(1.0 - st, vec2(size));
    return st.x * st.y;
}

vec4 mosaic() {
    vec2 tile_uv = vUv;

    float n = uMosaic;
    if(uMomove != 0.0){
        n = floor(sin(uTime * uMomove * 0.05) * uMosaic);
    }
    tile_uv = (floor(vUv * n) + 0.5) / n;
    float red = texture2D(uTex, tile_uv - uChroma).r;
    float gre = texture2D(uTex, tile_uv).g;
    float blu = texture2D(uTex, tile_uv + uChroma).b;

    float boxsize = box(fract(vUv * n), 0.8);
    vec4 mosaic = vec4(red, gre, blu, 1.0) * boxsize; 

    return mosaic; 
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

vec4 glitch() {
    float r = random(vec2(vUv.y * 0.00001, fract(uTime*0.1))); 

    vec2 u = vUv;
    vec4 gli = texture2D(uTex, u);
    if (r < 0.25 && fract(uTime * 0.01) > random(vec2(uTime))) {
        u.x = vUv.x + r * 0.1;
        float gli_r = texture2D(uTex, u - vec2(uChroma, 0)).r;
        float gli_g = texture2D(uTex, u - vec2(uChroma, 0)).g;
        float gli_b = texture2D(uTex, u).b;
        gli = vec4(gli_r, gli_g, gli_b, 1.0);
    }
    return gli;
}

void main(){
    vec4 dist = texture2D(uTex, vUv);

    if(uMosaic != 0.0){
        dist = mosaic();
    }

    if(uGlitch == true){
        dist = glitch();
    }

    vec4 color = dist * uColor;
    gl_FragColor = color; 
}
