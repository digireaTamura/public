varying vec4 vColor;


void main() {

    vec3  invLight = vec3(0.5,0.5,-1);
    float diffuse  = clamp(dot(normal, invLight), 0.1, 1.0);
    vColor = vec4(vec3(diffuse), 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //座標変換
}