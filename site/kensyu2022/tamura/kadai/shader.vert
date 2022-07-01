varying vec2 vUv;
varying vec3 vNormal;
varying float vColor;
uniform vec3 lightDirection;

void main() {
    // float c = dot(lightDirection, normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //座標変換
    vUv = uv;
    // vNormal = normal;
    // vColor = c;
}