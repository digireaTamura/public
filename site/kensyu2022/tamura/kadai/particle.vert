attribute vec4 color;
varying vec4 vColor;
varying float vSize;
uniform float uSize;
uniform vec3 uCameraPosition;
uniform float uTime;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // float c = dot(lightDirection, normal);
    vec3 pos = position + vec3 (0.,0., 0.10*sin(2.*6.28*(uTime/300.+position.x*position.y/2.+0.1*rand(position.xy))));
    // vec3 pos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0); //座標変換
    gl_PointSize = uSize * (100.0 / length(uCameraPosition-pos));
    vSize = uSize * (100.0 / length(uCameraPosition));
    vColor = color;

}