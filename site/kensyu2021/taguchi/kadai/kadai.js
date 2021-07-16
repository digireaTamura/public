import * as THREE from './../three.module.js'

var base64 = '';
const image = new Image();
var texture = new THREE.Texture(image);

var cam_on = false;
var gif_rec = false;
let mouse_flag = false;
var is_tex_existed = false;

var addDul = 0;
var frame = 0;

const addFactor = 0.002;
var bubbleDul = 1.0;



const loadshader = async()=>{
    const res_vert = await fetch("./kadai/modules/ita1.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./kadai/modules/ita1.frag");
    const frag = await res_frag.text();

    const loader =new THREE.TextureLoader();
    const texture2 = await loader.load("./kadai/displacement.jpeg");

    const material = new THREE.ShaderMaterial({
        uniforms:{
            uTimer:{value:0.0},
            uTex:{value:texture},
            uTex2:{value:texture2},
            uColor:{
                value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
            }
        },
        vertexShader:vert,
        fragmentShader:frag
    });

    return material;

}

const materialShader = await loadshader();
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 12, 250);
//const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camera = new THREE.PerspectiveCamera(45, 960 / 540);
camera.position.z = 7;
camera.lookAt(new THREE.Vector3(0, 0, 0)); 

const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true 
});

renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 0.85);
renderer.domElement.id = 'renderer'
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x8888, 1);

/*
const sprite = new THREE.Sprite(materialShader);
sprite.scale.set(10, 10, 10);
scene.add(sprite);
*/

const spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("./kadai/bubble2.jpg"),
    color:0xaaffff,
    transparent: true, // 透明の表示許可
    blending: THREE.AdditiveBlending, // ブレンドモード
  });

const amount = 500;
const sprite = [amount];　//漂うシャボン
const spriteCol = [amount];

for (let i = 0; i < amount; i++) {
    sprite[i] = new THREE.Sprite(spriteMaterial);
    // ランダムな座標に配置
    sprite[i].position.x = 400 * Math.random() - 200;
    sprite[i].position.y = 100 * Math.random() - 40;
    sprite[i].position.z = 400 * Math.random() - 200;

    //ランダムなスケールで生成
    var scale = 30 - Math.random()* 15.0 ;
    sprite[i].scale.set(scale,scale,scale);

    //衝突判定を設定
    spriteCol[i] = [1.0,1.0,1.0];
    scene.add(sprite[i]);
}


const geometry = new THREE.BoxGeometry(50, 50, 50);
const cube = new THREE.Mesh(geometry,materialShader);
scene.add(cube);


const ground = new THREE.GridHelper(300, 10, 0x888888, 0x888888);
ground.position.y = -40;
scene.add(ground);

let time = 0;
const animate = function(){
    frame++;
    addDul = addFactor * frame;
    cube.material.uniforms.uTimer.value = addDul;

    bubbleAction();

    if(is_tex_existed){
        rotateCube();
    }

    camera.position.x = 100 * Math.sin(Date.now() / 2000);
    camera.position.z = 100 * Math.cos(Date.now() / 2000);
    camera.position.y = 50 * Math.sin(Date.now() / 1000) + 60;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    if(mouse_flag){
        rotateCamera();
    }

    requestAnimationFrame(animate);
    renderer.render(scene,camera);
}

animate();


function rotateCube(){
    cube.rotation.x -= 0.005 * bubbleDul; 
    cube.rotation.y -= 0.005 * bubbleDul;
    cube.rotation.z -= 0.005 * bubbleDul;
}


function bubbleAction(){
    for (let i = 0; i < amount; i++) {

        if(sprite[i].position.x > 40 || sprite[i].position.x  < -40){
            spriteCol[i][0] *= -1.0;
        }

        if(sprite[i].position.y  >= 20 || sprite[i].position.y <= -40){
            spriteCol[i][1] *= -1.0;
        }

        if(sprite[i].position.z > 40 || sprite[i].position.z < -40){
            spriteCol[i][2] *= -1.0;
        }

        sprite[i].position.x += 0.2  * spriteCol[i][0] * bubbleDul;
        sprite[i].position.y += 0.2  * spriteCol[i][1] * bubbleDul;
        sprite[i].position.z += 0.2  * spriteCol[i][2] * bubbleDul;
    }
}

function rotateCamera(){
    const targetRot1 = (mouseX / window.innerWidth) * 360;
    const targetRot2 = (mouseY / window.innerHeight) * 360
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rot1 += (targetRot1 - rot1) * 0.02;
    rot2 += (targetRot2 - rot2) * 0.02;

    // ラジアンに変換する
    const radian1 = rot1 * Math.PI / 180;
    const radian2 = rot2 * Math.PI / 180;


    // 角度に応じてカメラの位置を設定
    camera.position.x = 100 * Math.sin(radian1);
    camera.position.y = -100 * Math.sin(radian2);
    camera.position.z = 100 * Math.cos(radian1);

    camera.lookAt(new THREE.Vector3(0, 0, 0));
}


//render画面以外
document.querySelector('input[type=file]').onchange = function () {

    var file = document.querySelector('input[type=file]').files;
    var reader = new FileReader();
    reader.readAsDataURL(file[0]);

    reader.onload = function () {
      base64 = reader.result.toString('base64');
      image.src = base64;
    }
}


document.getElementById("button").onclick = function() {
    cam_on = !cam_on;
  
        navigator.mediaDevices.getUserMedia({video: true, audio: false})	
        .then(function (stream) { 
            if(cam_on){
                document.getElementById('camera').srcObject = stream;
                document.getElementById("button2").style.display = "inline"
            }else{
                stream.getTracks().forEach(track => track.stop());
            }
        }).catch(function (error) { // 失敗時の処理はこちら.
            console.error('mediaDevice.getUserMedia() error:', error);
            return;
        });
}

document.getElementById("button2").onclick = function() {
    image.src = takePicture();
}


document.getElementById("dlButton").onclick = function() {
    var anchor;
    anchor = document.createElement("a");
    anchor.download = "image.jpeg";
    anchor.href = renderer.domElement.toDataURL();
    document.body.appendChild(anchor);
    anchor.click();
};


function takePicture() {
    var camera = document.getElementById('camera');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
}


//------------------gif生成用-----------------------------//
var cvs = document.createElement("canvas");
cvs.width = renderer.domElement.width/2;
cvs.height = renderer.domElement.height/2;
var ctx = cvs.getContext("2d");
var encoder = new GIFEncoder();
encoder.setRepeat(0); //auto-loop
encoder.setDelay(100);//interval(ms)
var gifFrames;


document.getElementById("gifStart").onclick = function (){

    gif_rec = !gif_rec;

    if(gif_rec){
        console.log(encoder.start());
        //フレームの追加(1/10秒ごとに)
        gifFrames = setInterval(function(){
            gifAddFrame();
            } , 100);
    }else{
        encoder.finish();
        clearInterval(gifFrames);
        gif_rec = false;

        if(!document.getElementById('gif')){
            var gif = document.createElement('img');
            gif.id = 'gif';

            document.body.appendChild(gif);
        }

        document.getElementById('gif').src = 
        'data:image/gif;base64,'+encode64(encoder.stream().getData());

        document.getElementById("gifDownload").style.display = "inline";
    }
}

document.getElementById("gifDownload").onclick = function(){
    var anchor;
    anchor = document.createElement("a");
    anchor.download = "image.gif";
    anchor.href = document.getElementById('gif').src;
    document.body.appendChild(anchor);
    anchor.click();
}

function gifAddFrame(){
    if(gif_rec){
        ctx.drawImage(document.getElementById("renderer"), 0, 0, cvs.width, cvs.height);
        encoder.addFrame(ctx);
    }
}


//-------------マウス操作-----------
let rot1 = 0,
    rot2 = 0; // 角度
let mouseX = 0; // マウス座標
let mouseY = 0;
let scroll = 0;

document.getElementById("renderer").addEventListener("mousemove", (event) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
});

document.getElementById("renderer").addEventListener("scroll", (event) => {
    scroll = event.scrollY;
    console.log(scroll);
});


document.getElementById("renderer").addEventListener("mousedown", (event) => {
    mouse_flag = true;
    bubbleDul = 20.0
});

document.getElementById("renderer").addEventListener("mouseup", (event) => {
    mouse_flag = false;
    bubbleDul = 1.0
});




image.onload = () => {
    texture.needsUpdate = true;
    is_tex_existed = true;
};