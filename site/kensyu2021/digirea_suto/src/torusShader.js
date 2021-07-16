import * as THREE from './../three.module.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// レンダリング設定
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff, 1);

// ジオメトリ設定
const geometry = new THREE.TorusGeometry(3, 1, 64, 100);

const size = 10;
const divisions = 10;
const GridHelper = new THREE.GridHelper(size, divisions);
scene.add(GridHelper);

// カメラ設定
camera.position.y = 5;
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0));

// シェーダー読込関数
const loadShader = async() => {
    const res_vert = await fetch("./src/shaderTorus.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./src/shaderTorus.frag");
    const frag = await res_frag.text();

    // マテリアル設定
    const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag
    });

    return material;
}

// シェーダー読込
const materialShader = await loadShader();

// テクスチャ設定
const loader = new THREE.TextureLoader();
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5});
const torus = new THREE.Mesh(geometry, materialShader);
scene.add(torus);

// レンダリング
renderer.render(scene, camera);