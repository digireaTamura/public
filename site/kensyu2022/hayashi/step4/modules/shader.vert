varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //gl_Position = vec4(position * 2.0,1.0) * vec4(1.0);
}
