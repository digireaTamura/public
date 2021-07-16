import* as THREE from './../three.module.js'

const loadshader = async()=>{
    const res_vert = await fetch("./src/shader2.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./src/shader2.frag");
    const frag = await res_frag.text();

    const loader =new THREE.TextureLoader();
    const texture = await loader.load("./src/tex.jpg");

    const material = new THREE.ShaderMaterial({
        uniforms:{
            uTime:{value:0.0},
            uTex:{value:texture}
        },
        vertexShader:vert,
        fragmentShader:frag
    });

    return material;

}

const materialShader = await loadshader();
console.log(materialShader);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0,0,0));

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff,1);

const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array([
    -1,1,0,
    -1,-1,0,
    1,1,0,

    -1,-1,0,
    1,-1,0,
    1,1,0
]);

const uvs = new Float32Array([
    0,1,
    0,0,
    1,1,

    0,0,
    1,0,
    1,1
]);


geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));


//const loader = new THREE.TextureLoader();
//const material = new THREE.MeshBasicMaterial({map:loader.load('./src/tex.jpg')});

//const plane = new THREE.Mesh(geometry,materialShader);
//scene.add(plane);

const geometry2 = new THREE.TorusGeometry(3,1,10,100);
const torus = new THREE.Mesh(geometry2,materialShader);
scene.add(torus);

let time = 0;
const animate = function(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

animate();



