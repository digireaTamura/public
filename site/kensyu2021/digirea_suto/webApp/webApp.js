// import * as THREE from './../three.module.js'
// import { Image } from './modules/image.js'

// const main = async() => {
//     // カメラ設定
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.z = 5;
//     camera.lookAt(new THREE.Vector3(0, 0, 0));

//     // レンダリング設定
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);
//     renderer.setClearColor(0x000033, 1);

//     // 画像
//     const image = new Image();

//     image.create().then((ref)=>{
//         scene.add(ref);
//     });

//     // レンダリング
//     renderer.render(scene, camera);
// }

// window.addEventListener("load",async()=>{
//     main();
// });

import * as THREE from './../three.module.js'

class Reader extends THREE.Object3D {
    load (uploadImgSrc) {     
    
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // カメラ設定
        camera.position.z = 5;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        // レンダリング設定
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        renderer.setClearColor(0xffffff, 1);
        
        // ジオメトリ設定
        const geometry = new THREE.BufferGeometry();
        
        // 頂点設定(座標を逆時計回りに指定)
        const vertices = new Float32Array([
            -1, 1, 0,
            -1, -1, 0,
            1, 1, 0,
        
            -1, -1, 0,
            1, -1, 0,
            1, 1, 0
        ]);
        
        // UV座標設定
        const uvs = new Float32Array([
            0, 1,
            0, 0,
            1, 1,
        
            0, 0,
            1, 0,
            1, 1,
        ]);
        
        // シェーダー読込関数
        const loadShader = async() => {
            const res_vert = await fetch("./src/shader.vert");
            const vert = await res_vert.text();
        
            const res_frag = await fetch("./src/shader.frag");
            const frag = await res_frag.text();
            
            const loader = new THREE.TextureLoader();
            const texture = uploadImgSrc;
        
            console.log(texture);
        
            // マテリアル設定
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: {value: 0.0},
                    uTex: {value: texture}
                },
                vertexShader: vert,
                fragmentShader: frag
            });
        
            return material;
        }
        
        // シェーダー読込
        const materialShader = await loadShader();
        
        geometry.setAttribute('position', new THREE.Int8BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        
        // テクスチャ設定
        const loader = new THREE.TextureLoader();
        const material = uploadImgSrc;
        const plane = new THREE.Mesh(geometry, materialShader);
        scene.add(plane);
        
        // アニメーション関数
        let time = 0;
        const animate = function () {
            time++;
            plane.material.uniforms.uTime.value = time;
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        
        // アニメーション
        animate();
    }
}