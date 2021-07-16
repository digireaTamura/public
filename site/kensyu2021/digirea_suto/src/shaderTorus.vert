// fragmentへ引き渡したい変数
varying vec4 vColor;

void main() {
    // 光源
    vec3 invLight = vec3(0.0, 0.0, 1.0);

    // 法線計算
    float diffuse = clamp(dot(normal, invLight), 0.1, 1.0);

    // ベクトル位置補正(アルファチャンネル追加)
    vColor = vec4(vec3(diffuse), 1.0);

    // アフィン変換
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); //座標変換
}