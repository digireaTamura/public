import * as THREE from './../three.module.js'

// シーン定義
const scene = new THREE.Scene();
// カメラ定義(視野角を指定)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// レンダラー
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// Canvasをhtmlに追加
document.body.appendChild(renderer.domElement);

const size = 10;
const divisions = 10;
const GridHelper = new THREE.GridHelper(size, divisions);
scene.add(GridHelper);

// グラフィック定義
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// カメラ位置指定
camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// 背景色指定
renderer.setClearColor(0xffffff, 1);

// トーラス形状
const geometry2 = new THREE.TorusGeometry(3, 1, 64, 100);
const material2 = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5});
const torus = new THREE.Mesh(geometry2, material2);
scene.add(torus);

// 光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, 10, 10);
scene.add(directionalLight);

// アニメーション
const animate = function () {
    // 自動的に繰り返し
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

animate();