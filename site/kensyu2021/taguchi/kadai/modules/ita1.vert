varying vec2 vTexCoord;

uniform float timer;

void main() {
    vTexCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //gl_Position = vec4(position, 1.0);
}
