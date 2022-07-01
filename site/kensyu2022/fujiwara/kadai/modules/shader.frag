#define R_LUMINANCE 0.298912
#define G_LUMINANCE 0.586611
#define B_LUMINANCE 0.114478
uniform sampler2D uTex;
varying vec2 vUv;
uniform float uTime;
const vec3 monochromeScale = vec3(R_LUMINANCE, G_LUMINANCE, B_LUMINANCE);
uniform float monochrome;
uniform float negapoji;
uniform float sepia;
uniform vec2 vScreenSize;
uniform float fMosaicScale;
uniform float mosaic;


void main() {
    vec4 color = texture2D(uTex, vUv);
    if(monochrome > 0.5){
        float grayColor = dot(color.rgb,monochromeScale);
        color = vec4(vec3(grayColor),1.0);
        // gl_FragColor = vec4(color);
    }
    if(negapoji > 0.5){
        color = vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
        // gl_FragColor = vec4(1.0 - color.x, 1.0 - color.y, 1.0 - color.z, 1.0);
    }
    if(sepia > 0.5){
        float v = color.x * R_LUMINANCE + color.y * G_LUMINANCE + color.z * B_LUMINANCE;
        color.x = v * 0.9;
        color.y = v * 0.7;
        color.z = v * 0.4;
        // gl_FragColor = vec4(color);
    }
   
    
   
    gl_FragColor = vec4(color);
}    