import* as THREE from './../three.module.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const size = 10;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size,divisions);
scene.add(gridHelper);

const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
const cube = new THREE.Mesh(geometry,material);
scene.add(cube);

camera.position.z = -10;
camera.position.y =5;
camera.lookAt(new THREE.Vector3(0,0,0));//yoko takasa okuiki


renderer.setClearColor(0xffffff,1);

const geometry2 = new THREE.TorusGeometry(3,1,64,100);
const material2 = new THREE.MeshStandardMaterial({color: 0x00ff00,roughness:0.5});
const tours = new THREE.Mesh(geometry2,material2);
scene.add(tours);

const directionalLight = new THREE.DirectionalLight(0xffffff,0.5);
directionalLight.position.set(-10,10,10);
scene.add(directionalLight);


const geometry3 = new THREE.TextGeometry("Hello, World!",10);
const material3 = new THREE.MeshBasicMaterial({color: 0xff0000});
const text = new THREE.Mesh(geometry3,material3);
scene.add(text);

const animate = function (){

    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene,camera);

};

animate();