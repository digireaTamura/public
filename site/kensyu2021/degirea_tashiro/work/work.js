import * as THREE from './../three.module.js'

const windowWidth = 480;
const windowHeight = 480;

//初期画像読み込み
const loader = new THREE.TextureLoader();
var texture = await loader.load("./work/hyde.png");
var imageAlpha = 1.0;
var mono = 0.0;
var light = 0.0;
var rainbowCount = 0.0;

const loadImageShader = async() => {
    const res_vert = await fetch("./work/modules/image.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./work/modules/image.frag");
    const frag = await res_frag.text();

    const material = new THREE.ShaderMaterial({
        uniforms:{
            uTex:{value:texture},
            uColor:{value:new THREE.Vector4(1.0, 1.0, 1.0, 1.0)},
            uAlpha: {value:imageAlpha},
            uMono: {value:mono},
            uLight: {value:light},
            uRainbow: {value:rainbowCount}
        },
        vertexShader: vert,
        fragmentShader: frag
    });

    return material;
}

const imageShader = await loadImageShader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
camera.position.z = 5;
camera.lookAt(new THREE.Vector3(0, 0, 0)); 

//キャンバスにレンダリング
const canvas = document.querySelector("#myCanvas");
const renderer = new THREE.WebGLRenderer({canvas, preserveDrawingBuffer: true});
renderer.setSize(windowWidth, windowHeight);
renderer.setClearColor(0x000000, 1);

//ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(5, 5, 15);
scene.add(directionalLight);

//画像を表示するところ
const DEFAULT_IMAGE_SIZE = 7.7;
var imageW = DEFAULT_IMAGE_SIZE;
var imageH = DEFAULT_IMAGE_SIZE;
const image = new THREE.Sprite(imageShader);
image.scale.set(imageW,imageH);
scene.add(image);

//sparkle
//const sparkleLoader = new THREE.TextureLoader();
const sparkleTex = await loader.load("./work/sparkle.jpg");
const effectMaterial = new THREE.MeshBasicMaterial({
    map: sparkleTex, // テクスチャーを指定
    color: 0xffffff, // 色
    transparent: true, // 透明の表示許可
    blending: THREE.AdditiveBlending, // ブレンドモード
    side: THREE.DoubleSide, // 表裏の表示設定
    depthWrite: false // デプスバッファへの書き込み可否
});
const sparkle = new THREE.Sprite(effectMaterial);
var sparkleFlag = false;
const DEFAULT_SPARKLE_SIZE = 2;
var sparkleR = DEFAULT_SPARKLE_SIZE;
sparkle.scale.set(sparkleR, sparkleR);
sparkle.position.z = 3;

//爆発
const BOM_EFFECT_NUM = 3;
const bomTex = new Array(BOM_EFFECT_NUM);
const bomMaterial = new Array(BOM_EFFECT_NUM);
const bom = new Array(BOM_EFFECT_NUM);
const bomSize = new Array(BOM_EFFECT_NUM);
for(let i=0; i<BOM_EFFECT_NUM; i++){
    if(i<BOM_EFFECT_NUM-1){
        bomTex[i] = await loader.load("./work/bom" + i + ".jpg");
    }else{
        bomTex[i] = await loader.load("./work/bom" + i + ".png");
    }
    bomMaterial[i] = new THREE.MeshBasicMaterial({
        map: bomTex[i], // テクスチャーを指定
        color: 0xffffff, // 色
        transparent: true, // 透明の表示許可
        blending: THREE.AdditiveBlending, // ブレンドモード
        depthWrite: false // デプスバッファへの書き込み可否
    });
    bom[i] = new THREE.Sprite(bomMaterial[i]);
    bomSize[i] = 0;
    bom[i].scale.set(bomSize[i], bomSize[i]);
    bom[i].position.z = i;
    //scene.add(bom[i]);
}
var bomFlag = false;
var bomCount = 0;

//球体のデータ
var sphereFlag = false;
const n = 5;
const particle = new Array(n);
const velocityX = new Array(n);
const velocityY = new Array(n);
const sphereSize = 0.5;
const sphereGeometry = new THREE.SphereGeometry(sphereSize, 32, 32);
var sphereMaterial = new THREE.MeshStandardMaterial({ map: texture });

//画像の分身データ
var mirrorFlag = false;
const mirrorN = 4;
const mirror = new Array(n);
for(let i=0; i<mirrorN; i++){
    mirror[i] = new THREE.Sprite(imageShader);
    mirror[i].scale.set(imageW,imageH);
    mirror[i].position.z = 1;
    //mirror[i].rotateX(Math.random()*Math.PI/6);
    //mirror[i].rotateY(Math.random()*Math.PI/6);
    mirror[i].rotateZ((Math.random() + i) * Math.PI / 2)
}
mirror[0].position.x = -DEFAULT_IMAGE_SIZE/3;
mirror[0].position.y = DEFAULT_IMAGE_SIZE/3;
mirror[1].position.x = DEFAULT_IMAGE_SIZE/3;
mirror[1].position.y = DEFAULT_IMAGE_SIZE/3;
mirror[2].position.x = DEFAULT_IMAGE_SIZE/3;
mirror[2].position.y = -DEFAULT_IMAGE_SIZE/3;
mirror[3].position.x = -DEFAULT_IMAGE_SIZE/3;
mirror[3].position.y = -DEFAULT_IMAGE_SIZE/3;

//球体を転がす
const sphereMove = function () {
    for(let i=0; i<n; i++){
        particle[i].position.x += velocityX[i];
        particle[i].position.y += velocityY[i];
        particle[i].rotateX(-velocityY[i]);
        particle[i].rotateY(velocityX[i]);
        //壁衝突判定
        if(particle[i].position.x > DEFAULT_IMAGE_SIZE/2 - sphereSize*3){
            velocityX[i] = -velocityX[i];
        }else if(particle[i].position.x < -DEFAULT_IMAGE_SIZE/2 + sphereSize*3){
            velocityX[i] = -velocityX[i];
        }
        if(particle[i].position.y > DEFAULT_IMAGE_SIZE/2 - sphereSize*3){
            velocityY[i] = -velocityY[i];
        }else if(particle[i].position.y < -DEFAULT_IMAGE_SIZE/2 + sphereSize*3){
            velocityY[i] = -velocityY[i];
        }
        //パーティクル同士衝突判定
        // for(let j=0; j<n; j++){
        //     if(j != i){
        //         var d = (particle[i].position.x - particle[j].position.x)*(particle[i].position.x - particle[j].position.x)
        //                 + (particle[i].position.y - particle[j].position.y)*(particle[i].position.y - particle[j].position.y);
        //         if(d < (sphereSize*2)*(sphereSize*2)*3){
        //             velocityX[i] = -velocityX[i];
        //             velocityX[j] = -velocityX[j];
        //             velocityY[i] = -velocityY[i];
        //             velocityY[j] = -velocityY[j];
        //         }
        //     }
        // }

    }
};

//sparkleの動き
var sparkleExpand = false;
const sparkleMove = function () {
    //回転
    sparkle.rotateX(0.1);
    sparkle.rotateY(0.3);
    sparkle.rotateZ(0.5);
    //大きくなったり小さくなったり
    if(sparkleExpand){
        sparkleR += 0.2;
        if(sparkleR > DEFAULT_SPARKLE_SIZE){
            sparkleExpand = false;
        }
    }else{
        sparkleR -= 0.2;
        if(sparkleR < 0.1){
            sparkleExpand = true;
        }
    }
    sparkle.scale.set(sparkleR, sparkleR);
};

//爆発の動き
const bomMove = function () {
    //初期設定
    if(bomCount == 0){
        for(let i=0; i<BOM_EFFECT_NUM; i++){
            bomSize[i] = 0;
            scene.add(bom[i]);
        }
        imageAlpha = 1.0;
    }

    //bom0の動き
    if(bomCount < 30){
        bomSize[0] += 0.2;
    }else if(bomCount < 60){
        bomSize[0] -= 0.2;
    }
    //bom1の動き
    bomSize[1] += 0.1;
    //bom2の動き
    if(20 < bomCount){
        bomSize[2] += 0.1;
    }
    //サイズ変更
    for(let i=0; i<BOM_EFFECT_NUM; i++){
        bom[i].scale.set(bomSize[i], bomSize[i]);
    }

    //画像を徐々に消す→復活
    if(bomCount < 280){
        if(imageAlpha > 0){
            imageAlpha -= 0.01;
        }
    }else{
        imageAlpha += 0.1;
        if(imageAlpha > 1.0){
            imageAlpha = 1.0;
        }
    }
    image.material.uniforms.uAlpha.value = imageAlpha;

    bomCount++;

    //終了
    if(bomCount == 300){
        bomFlag = false;
        for(let i=0; i<BOM_EFFECT_NUM; i++){
            scene.remove(bom[i]);
        }
    }
};

var moveFlag = true;
const animate = function () {
    requestAnimationFrame(animate);

    if(moveFlag){
        if(sphereFlag){
            sphereMove();
            sphereMove();
            sphereMove();
        }
        if(sparkleFlag){
            sparkleMove();
        }
        if(bomFlag){
            bomMove();
        }
        if(rainbowCount > 0.1){
            rainbowCount += 0.1;
            image.material.uniforms.uRainbow.value = rainbowCount;
            if(mirrorFlag){
                for(let i=0; i<mirrorN; i++){
                    mirror[i].material.uniforms.uRainbow.value = rainbowCount;
                }
            }
        }
    }

    renderer.render(scene, camera);
};
animate();

//画像ファイルのアップロード
var inputfile = document.getElementById("fileUpload");
inputfile.addEventListener("change", function (e) {
    var file = e.target.files;
    var imageURL = URL.createObjectURL(file[0]);
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");
    texture = loader.load(imageURL);

    //リサイズ
    var reader = new FileReader();
    reader.readAsDataURL(file[0]);
    var img = new Image();
    reader.onload = function () {
        img.onload = function() {
            if(img.width < img.height){
                imageH = DEFAULT_IMAGE_SIZE;
                imageW = DEFAULT_IMAGE_SIZE * img.width / img.height;
            }else{
                imageW = DEFAULT_IMAGE_SIZE;
                imageH = DEFAULT_IMAGE_SIZE * img.height / img.width;
            }
            image.scale.set(imageW,imageH);
        }
        img.src = reader.result;
    }

    image.material.uniforms.uTex.value = texture;

    //球体削除
    if(sphereFlag){
        for(let i=0; i<n; i++){
            scene.remove(particle[i]);
        }
        sphereFlag = false;
    }
}, false);

//全体画像保存
document.getElementById("save").addEventListener('click', (e) => {
    var anchor;
	anchor = document.createElement("a");
	anchor.download = "cg.png";
    var context = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
	anchor.href = canvas.toDataURL("image/png");
	document.body.appendChild(anchor);
	anchor.click();
}, false);

//球体
document.getElementById("sphere").addEventListener('click', (e) => {
    if(sphereFlag){
        //球体削除
        for(let i=0; i<n; i++){
            scene.remove(particle[i]);
        }
        sphereFlag = false;
    }else{
        //球体生成
        sphereMaterial = new THREE.MeshStandardMaterial({ map: texture });
        for(let i=0; i<n; i++){
            particle[i] = new THREE.Mesh(sphereGeometry, sphereMaterial);
            particle[i].position.x = (i - n/2) * sphereSize;
            particle[i].position.y = (Math.random() - 0.5) * imageH * 0.5;
            particle[i].position.z = 1.0 + i * 0.05;
            scene.add(particle[i]);

            velocityX[i] = 0.02 + (Math.random() - 0.5) * 0.02;
            velocityY[i] = 0.02 + (Math.random() - 0.5) * 0.02;
            particle[i].rotateX(-velocityY[i]);
            particle[i].rotateY(velocityX[i]);
        }
        sphereFlag = true;
    }
}, false);

//光
document.getElementById("sparkle").addEventListener('click', (e) => {
    if(sparkleFlag){
        scene.remove(sparkle);
        sparkleFlag = false;
    }else{
        scene.add(sparkle);
        sparkleFlag = true;
    } 
}, false);

//爆発
document.getElementById("bom").addEventListener('click', (e) => {
    bomCount = 0;
    bomFlag = true;
}, false);

//分身
document.getElementById("mirror").addEventListener('click', (e) => {
    if(mirrorFlag){
        //球体削除
        for(let i=0; i<n; i++){
            scene.remove(mirror[i]);
        }
        mirrorFlag = false;
    }else{
        //分身生成
        for(let i=0; i<mirrorN; i++){
            scene.add(mirror[i]);
            mirror[i].rotateZ((Math.random() + i) * Math.PI / 2)
        }
        mirrorFlag = true;
    }
}, false);

//スタート/ストップ
document.getElementById("move").addEventListener('click', (e) => {
    if(moveFlag){
        document.getElementById("move").innerText = "スタート"
    }else{
        document.getElementById("move").innerText = "ストップ"
    }
    moveFlag = !moveFlag;
}, false);

//明暗
document.getElementById("light").addEventListener('click', (e) => {
    light += 0.1;
    image.material.uniforms.uLight.value = light;
    if(mirrorFlag){
        for(let i=0; i<mirrorN; i++){
            mirror[i].material.uniforms.uLight.value = light;
        }
    }
}, false);
document.getElementById("dark").addEventListener('click', (e) => {
    light -= 0.1;
    image.material.uniforms.uLight.value = light;
    if(mirrorFlag){
        for(let i=0; i<mirrorN; i++){
            mirror[i].material.uniforms.uLight.value = light;
        }
    }
}, false);

//モノクロ
document.getElementById("mono").addEventListener('click', (e) => {
    if(mono==0.0){
        mono = 1.0;
    }else{
        mono = 0.0;
    }
    image.material.uniforms.uMono.value = mono;
    if(mirrorFlag){
        for(let i=0; i<mirrorN; i++){
            mirror[i].material.uniforms.uMono.value = mono;
        }
    }
}, false);

//レインボー
document.getElementById("rainbow").addEventListener('click', (e) => {
    if(rainbowCount==0.0){
        rainbowCount += 0.2;
    }else{
        rainbowCount = 0.0;
    }
    image.material.uniforms.uRainbow.value = rainbowCount;
    if(mirrorFlag){
        for(let i=0; i<mirrorN; i++){
            mirror[i].material.uniforms.uRainbow.value = rainbowCount;
        }
    }
}, false);