varying vec2 vTexCoord;

uniform float timer;

varying vec4 vColor;

void main() {
    vColor = vec4(uv,0.5,1.0);

    vTexCoord = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //gl_Position = vec4(position * 2.0,1.0) * vec4(1.0);
}
