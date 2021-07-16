varying vec2 vUv;
uniform vec3 uRight;

varying vec4 vCol;

void main() {
    vUv = uv;
    float diffuse = clamp(dot(normal,uRight),0.1,1.0);
    vCol = vec4(vec3(diffuse),1.0);
    // diffuse = vec4(dot(normal,uRight));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //座標変換
}