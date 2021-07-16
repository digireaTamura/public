import * as THREE from './../three.module.js'
import { Ita } from './modules/plane.js'

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

    //引数 ドーナツ自体の大きさ、太さ
    const geometry = new THREE.TorusGeometry(5,0.1,64,100);
    const material = new THREE.MeshBasicMaterial({color: 0x9999ff});
    const tours = new THREE.Mesh(geometry,material);
    tours.rotation.x= Math.PI/2; 
    tours.position.y= 1; 
    scene.add(tours);

    const geometry2 = new THREE.TorusGeometry(5,0.1,64,100);
    const material2 = new THREE.MeshBasicMaterial({color: 0x9999ff});
    const tours2 = new THREE.Mesh(geometry2,material2);
    tours2.rotation.x= Math.PI/2; 
    tours2.position.y= 0; 
    scene.add(tours2);

    const geometry3 = new THREE.TorusGeometry(5,0.1,64,100);
    const material3 = new THREE.MeshBasicMaterial({color: 0x9999ff});
    const tours3 = new THREE.Mesh(geometry3,material3);
    tours3.rotation.x= Math.PI/2; 
    tours3.position.y= -1; 
    scene.add(tours3);
        
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
