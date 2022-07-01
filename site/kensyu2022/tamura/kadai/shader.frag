varying vec2 vUv;
varying vec3 vNormal;
varying float vColor;
uniform sampler2D uTex;
uniform float uTime;
uniform vec3 lightDirection;
uniform float uGrid;
uniform float uDistort;
uniform float uDoDot;

void main() {
    if (uDoDot > 0.) {
        // vec2 p = vUv * 2. - 1.;
        float grid = uGrid;
        float speed = uTime / 100.0 * 4.;
        // vec2 p = vUv;
        vec2 p = vUv + vec2(uDistort*sin(vUv.y*6.28*10.), uDistort* sin(vUv.x * 6.28 * 10.));
        // 行・列番号
        vec2 ip = floor(p*grid);
        float isOdd =2.*step(mod(ip.y,2.),0.5)-1.;
        vec2 pp = p + vec2(speed, 0.)/grid*isOdd;
        vec2 ipp = floor(pp*grid);
        vec2 fpp = fract(pp*grid);
        vec2 fcenter = vec2(0.5) - vec2(speed, 0.)*isOdd;
        
        vec2 pfpp = fpp * 2. - 1.;
        

        vec4 tex = texture2D(uTex, (ipp +fcenter)/grid);
        
        float threshold = 1.-exp(-4.*(1.0-length(tex.xyz)/sqrt(3.)));
        // vec4 color = tex * (1.-smoothstep(threshold-0.1, threshold-0.05, length(pfpp) ));
        vec4 color = (tex+(0.1/length(fpp))) * (1.-smoothstep(threshold-0.1, threshold-0.05, length(pfpp) ));
        gl_FragColor = color;
    }
    else {
        gl_FragColor = texture2D(uTex, vUv);
    }
}