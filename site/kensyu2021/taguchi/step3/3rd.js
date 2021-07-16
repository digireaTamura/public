import * as THREE from './../three.module.js'
import { Ita } from '../kadai/modules/plane.js'

const main = async()=>{

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x000033, 1);
    
    const ita1 = new Ita();
    
    ita1.create().then((ref)=>{
        scene.add(ref);
    });


    const geometry2 = new THREE.TorusGeometry(20,1,10,100);
    const geometry3 = new THREE.TorusGeometry(2,0.1,10,100);
    const material2 = new THREE.MeshBasicMaterial({color:0x00ffaa})
    const material3 = new THREE.MeshBasicMaterial({color:0xffaa00})

    const torus = new THREE.Mesh(geometry2,material2);
    const torus2 = new THREE.Mesh(geometry2,material2);
    const torus3 = new THREE.Mesh(geometry2,material2);
    const torus4 = new THREE.Mesh(geometry3,material3);

    scene.add(torus);
    scene.add(torus2);
    scene.add(torus3);
    scene.add(torus4);

    torus.rotation.x = 77 *Math.PI / 180;
    torus2.rotation.x = 80 * Math.PI / 180;
    torus3.rotation.x = 83 * Math.PI / 180;
    torus4.rotation.x = 70 * Math.PI / 180;

    torus.position.y = 9;
    torus.position.z = -3;

    torus2.position.y = 3;

    torus3.position.y = -3;

    torus4.position.y = -3.1;
    torus4.position.z = 0.1;



        
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
