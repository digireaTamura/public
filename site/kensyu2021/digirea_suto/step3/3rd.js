import * as THREE from './../three.module.js'
import { Ita } from './modules/plane.js'

const main = async()=>{

    // カメラ設定
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    
    // レンダリング設定
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x000033, 1);
    
    // カード
    const ita1 = new Ita();
    
    ita1.create().then((ref)=>{
        scene.add(ref);
    });

    // メッシュ設定
    const materialRings = new THREE.MeshBasicMaterial({color: 0xaaccff});

    // トールス作成関数
    const createShape = function () {
        const geometry = new THREE.TorusGeometry(4, 0.06, 16, 100);
        const torus = new THREE.Mesh( geometry, materialRings );
        torus.position.set(0, 0, 0);
        torus.rotation.x = Math.PI * 0.6;

        return torus;
    }

    // トールス作成(3つ)
    const shape = [];
    shape.push(createShape());
    shape.push(createShape());
    shape.push(createShape());

    for (let i=0; i<shape.length; i++) {
        shape[i].position.set(0, i*1.2-0.7, 2);
        scene.add(shape[i]);
    }
    
    // アニメーション
    const animate = function () {
        ita1.update();  // 板の位置・回転更新
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();

}

window.addEventListener("load",async()=>{
    main();
});
