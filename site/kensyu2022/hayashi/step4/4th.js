import * as THREE from './../three.module.js'
import { OrbitControls } from './../OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 3;
camera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee, 1);
document.body.prepend(renderer.domElement);
renderer.domElement.setAttribute("id", "canvas");

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const img = new Image();

const mat = new THREE.MeshNormalMaterial({ color: 0x6699FF });

//平面
const geometry_plane = new THREE.PlaneGeometry(1.0, img.height / img.width, 1.0, 1.0);
const geometry_box = new THREE.BoxGeometry(); // geometry = 形状

// 表示するobj
// const plane = new THREE.Mesh(geometry_plane, mat);
const plane = new THREE.Mesh(geometry_box, mat);

scene.add(plane);

const CreateMaterial = async () => {
    const res_frag = await fetch("./step4/modules/shader.frag");
    const frag = await res_frag.text();

    const res_vert = await fetch("./step4/modules/shader.vert");
    const vert = await res_vert.text();

    const texture = new THREE.Texture(img);
    texture.needsUpdate = true;

    const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
            uTime: {
                value: 0.0
            },
            lightDirection: {
                value: new THREE.Vector3(1.0, 1.0, 1.0)
            },
            uTex: {
                type: "t",
                value: texture
            },
            uColor: {
                value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
            },
            uChroma: {
                value: 0.0
            },
            uMosaic: {
                value: 0.0
            },
            uTileSize: {
                value: 0.1
            },
            uMomove: {
                value: 0.0
            },
            uGlitch: {
                value: false
            }
        }
    });

    return material;
}

let frag_anime = false;

img.onload = async () => {
    //画像を表示
    console.log("画像を読み込んだ")
    scene.remove(plane);
    const mat1 = await CreateMaterial();
    // const geometry1 = new THREE.PlaneGeometry(1.0, img.height / img.width, 1.0, 1.0);
    const geometry1 = new THREE.BoxGeometry(1.0, 1.0, 1.0, 1.0);
    plane.geometry = geometry1;
    plane.material = mat1;
    init();
    scene.add(plane);

    if(frag_anime == false){
        animate();
        frag_anime = true;
    }
};

const upload = document.getElementById("upload");

upload.addEventListener('change', obj => {
    console.log("アップロード");
    var fileReader = new FileReader();
    fileReader.onload = (function () {
        img.src = fileReader.result;
        // document.getElementById("preview-image").src = fileReader.result;
        console.log(fileReader.result);
    });
    fileReader.readAsDataURL(obj.target.files[0]);
});

const download = document.getElementById("download");

download.addEventListener("click", async () => {

    renderer.domElement.getContext('webgl2', { antialias: true, preserveDrawingBuffer: true });
    renderer.render(scene, camera);
    renderer.domElement.toBlob(function (blob) {
        const BLOB_URL = URL.createObjectURL(blob);
        var downloadLink = document.getElementById('download_link');
        var filename = 'your-filename.png';
        downloadLink.download = filename;
        downloadLink.href = BLOB_URL;
        downloadLink.click();
        URL.revokeObjectURL(BLOB_URL);
    });
    renderer.domElement.getContext('webgl2', { antialias: true, preserveDrawingBuffer: false });

}, false);

// 
// 画像処理選択
// 

// document.getElementById("color_balance").

// 
//
// 

// 
// 色変更
// 

const red = document.getElementById("bar_red");
const gre = document.getElementById("bar_gre");
const blu = document.getElementById("bar_blu");

red.addEventListener("input", async () => {
    console.log("バーを動かした");
    plane.material.uniforms.uColor.value.x = red.value;
});

gre.addEventListener("input", async () => {
    console.log("バーを動かした");
    plane.material.uniforms.uColor.value.y = gre.value;
});

blu.addEventListener("input", async () => {
    console.log("バーを動かした");
    plane.material.uniforms.uColor.value.z = blu.value;
});

//
//
//

// 
// 色収差
//

const chromatism = document.getElementById("chromatism");

chromatism.addEventListener("input", async () => {
    console.log("バーを動かした");
    plane.material.uniforms.uChroma.value = chromatism.value;
});

// 
// 
//

// 
// モザイク
//
const isUsed_mosaic = document.getElementById("isUsed_mosaic");
const mosa_tile = document.getElementById("mosa_tile");
const mosa_move = document.getElementById("mosa_move");

isUsed_mosaic.addEventListener("click", async () => {
    if (isUsed_mosaic.checked) {
        if (mosa_tile.style.display == "none") {
            mosa_tile.style.display = "block";
            mosa_move.style.display = "block";
            console.log("値を代入");
            plane.material.uniforms.uMosaic.value = mosa_tile.value;
            plane.material.uniforms.uMomove.value = mosa_move.value;
        }
    } else if (!isUsed_mosaic.checked) {
        if (mosa_tile.style.display == "block") {
            mosa_tile.style.display = "none";
            mosa_move.style.display = "none";
            plane.material.uniforms.uMosaic.value = 0.0;
            plane.material.uniforms.uMomove.value = 0.0;
        }
    }
});

mosa_tile.addEventListener("input", async () => {
    console.log("バーを動かした");
    plane.material.uniforms.uMosaic.value = mosa_tile.value;
});

mosa_move.addEventListener("input", async () => {
    console.log("バーを動かした");
    plane.material.uniforms.uMomove.value = mosa_move.value;
});

// 
// 
//

// 
// グリッチ
//
const isUsed_glitch = document.getElementById("isUsed_glitch");

isUsed_glitch.addEventListener("click", async () => {
    if (isUsed_glitch.checked) {
        plane.material.uniforms.uGlitch.value = true;
    } else if (!isUsed_glitch.checked) {
        plane.material.uniforms.uGlitch.value = false;
    }
});

// 
// 
//

let time = 0;

const animate = function () {
    requestAnimationFrame(animate);
    time++;
    plane.rotation.y += 0.01;
    plane.material.uniforms.uTime.value = time;
    renderer.render(scene, camera);
};

const init = async () => {

    isUsed_mosaic.checked = false;
    mosa_tile.style.display = "none";
    mosa_move.style.display = "none";

    isUsed_glitch.checked = false;
    
}

window.addEventListener("load", async () => {
    init();
});
