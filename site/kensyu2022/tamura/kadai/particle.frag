varying vec4 vColor;
uniform float uTime;
varying float vSize;
uniform float uDoParticle;

void main() {
    vec2 p = gl_PointCoord.xy * 2. - 1.;
    vec4 color = (vColor + 0.1/ length(gl_PointCoord.xy))* (1.-smoothstep(0.9, 1.1, length(p) ));
    // vec4 color = vec4(((vColor + 0.1/ length(gl_PointCoord.xy))* (1.-smoothstep(0.9, 1.1, length(p) ))).xyz, pow(1.1-length(p/3.),5.));
    // float orb = 2.*pow(1.0-length(p/2.),5.);
    // orb = orb * step(0.1, orb);
    // vec4 color = vColor * orb* (1.-smoothstep(0.9, 1.1, length(p) ));
    // gl_FragColor = vColor;
    if (uDoParticle > 0.) {
        gl_FragColor = color;
    }
    else {
        discard;
    }
}