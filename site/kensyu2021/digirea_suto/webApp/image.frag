// uniform sampler2D uTex;
// varying vec2 vUv;

// void main() {
//     vec4 tex = texture2D(uTex, vUv);
//     vec4 color = vec4(1.0);
//     gl_FragColor = tex * color;
// }

uniform sampler2D uTex;
uniform float uTime;
varying vec2 vUv;

void main() {
    vec4 tex = texture2D(uTex, vUv);
    vec4 color = vec4(1.0);
    color.r = sin(uTime * 0.01);
    color.g = sin(uTime * 0.02);
    color.b = sin(uTime * 0.03);
    color.a = sin(uTime * 0.04);
    gl_FragColor = tex * color;
}