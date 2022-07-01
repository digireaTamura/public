import * as THREE from './../three.module.js'
import { OrbitControls} from './../OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.x = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0)); 

const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x90d7ec, 1);


const uploadimage = document.getElementById("uploadfile")
const download = document.getElementById("saveimage")
const grayscale = document.getElementById("grayscale")
const negapoji = document.getElementById("negapoji")
const sepia = document.getElementById("sepia")
const ball = document.getElementById("ballgeometry")
const capsule = document.getElementById("capsulegeometry")
const image = new Image();

const createMaterial = async()=>{
    const res_frag = await fetch("./kadai/modules/shader.frag");
    const frag = await res_frag.text();

    const res_vert = await fetch("./kadai/modules/shader.vert");
    const vert = await res_vert.text();

    var texture = new THREE.Texture(image);//テクスチャ作成
    //画像ロード、テクスチャ更新
    image.onload = () =>{
        texture.needsUpdate = true;
    };

    const material = new THREE.ShaderMaterial({
        vertexShader:vert,
        fragmentShader:frag,
        uniforms:{
            monochrome:{value:0.0},
            negapoji:{value:0.0},
            mosaic:{value:0.0},
            sepia:{value:0.0},
            mosaic:{value:0.0},
            uTime:{value:1.0},
            uTex:{
                type:"t",
                value:texture
            }
        }
    })
    return material;
};

//画像ダウンロード
download.onclick=function(){
    var anchor;
    anchor = document.createElement("a");
    anchor.download = "image.png";
    anchor.href = renderer.domElement.toDataURL("image/png");
    console.log(anchor.href);
    document.body.appendChild(anchor);
    anchor.click();
};

//グレースケール
grayscale.addEventListener("click", async()=>{
    if(grayscale.checked){
        cube.material.uniforms.monochrome.value = 1.0;
    }else if(!grayscale.checked){
        cube.material.uniforms.monochrome.value = 0.0;
    }
});

//ネガポジ反転
negapoji.addEventListener("click", async()=>{
    if(negapoji.checked){
        cube.material.uniforms.negapoji.value = 1.0;
    }else if(!negapoji.checked){
        cube.material.uniforms.negapoji.value = 0.0;
    }
});

//セピア
sepia.addEventListener("click", async()=>{
    if(sepia.checked){
        cube.material.uniforms.sepia.value = 1.0;
    }else if(!sepia.checked){
        cube.material.uniforms.sepia.value = 0.0;
    }
});


//画像アップロード
function upload(){   
    var reader = new FileReader();
    reader.onload = (function(){
        image.src = reader.result;

    });
    reader.readAsDataURL(uploadimage.files[0]);
}

uploadimage.addEventListener("change",upload);


const geometry = new THREE.BoxGeometry(2,2,2);
const mat = await createMaterial();
const cube = new THREE.Mesh(geometry, mat);
scene.add(cube);

const ballgeometry = new THREE.SphereGeometry();
const sphere = new THREE.Mesh(ballgeometry, mat);

//球変更
ball.addEventListener("click", async()=>{
    if(ball.checked){
        scene.remove(hoipoi);
        scene.remove(cube);
        scene.add(sphere);
    }else if(!ball.checked){
        scene.remove(hoipoi);
        scene.remove(sphere);
        scene.add(cube);
    }
});

const capsulegeometry = new THREE.CapsuleGeometry();
const hoipoi = new THREE.Mesh(capsulegeometry, mat)

//カプセル変更
capsule.addEventListener("click", async()=>{
    if(capsule.checked){
        scene.remove(sphere);
        scene.remove(cube);
        scene.add(hoipoi);
    }else if(!capsule.checked){
        scene.remove(sphere);
        scene.remove(hoipoi);
        scene.add(cube);
    }
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let time;
const animate = function(){
    time++;
    cube.material.uniforms.uTime.value = time;
    requestAnimationFrame(animate);//1秒間に60回、自動的に繰り返し処理
    renderer.render(scene,camera);
};

animate();

