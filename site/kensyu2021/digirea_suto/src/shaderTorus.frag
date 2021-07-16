// vertexから受け取った変数
varying vec4 vColor;

void main() {
    // 色指定
    vec4 color = vec4(1.0, 0.0, 0.0, 1.0);

    // flagment出力情報
    gl_FragColor = vColor * color;
}