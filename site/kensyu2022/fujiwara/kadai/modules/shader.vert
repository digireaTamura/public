varying vec2 vUv;
varying vec3 vNormal;
varying float vDiffuse;

uniform vec3 lightDirection;

void main() {
    vUv = uv;
    // vNormal = normal;

    // float diffuse = dot(normal, lightDirection);
    // vDiffuse = diffuse;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //座標変換
}