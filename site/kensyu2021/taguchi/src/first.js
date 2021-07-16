import *as THREE from './../three.module.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size,divisions);
scene.add(gridHelper);

//キューブ
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
const cube = new THREE.Mesh(geometry,material);
scene.add(cube);

camera.position.z = 5;
camera.position.y = 5;
camera.lookAt(new THREE.Vector3(0,0,0));

renderer.setClearColor(0xffffff,1);

//トーラス体
const geometry2 = new THREE.TorusGeometry(3,1,64,100);
const material2 = new THREE.MeshStandardMaterial({color:0x00ff00,roughness:0.5});
const torus = new THREE.Mesh(geometry2,material2);
scene.add(torus);

const geometry3 = new THREE.ConeGeometry(5,10,6);
const material3 = new THREE.MeshStandardMaterial({color:0xff0000,roughness:0});
const cone = new THREE.Mesh(geometry3,material3);
scene.add(cone);

//光源
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5);
directionalLight.position.set(10,10,10);
scene.add(directionalLight);

const animate = function(){
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene,camera);
};

animate();