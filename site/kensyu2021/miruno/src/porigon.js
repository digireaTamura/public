import* as THREE from './../three.module.js'
// import TextSprite from './../node_modules/three.textsprite'

var canvas = document.getElementById('preview');
var ctx = canvas.getContext('2d');//キャンパスに描画するためのコンテキスト(メニュー)を取得するメソッド


////ここからウェブカメラ
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false, // マイクから音声も取得する場合はtrue
}).then(media => {
    document.getElementById('video').srcObject = media;
});

var video_frag =true ; 
var main_frag = true;
const image = new Image();
document.getElementById("send").onclick = function(){

    if(document.getElementById("name").value != ""){
        card_name = document.getElementById("name").value; 
    }
    if(document.getElementById("atk").value != ""){
        card_atack = document.getElementById("atk").value; 
    }
    if(document.getElementById("def").value != ""){
        card_defend = document.getElementById("def").value; 
    }
    if(document.getElementById("message").value != ""){
        card_naiyou = document.getElementById("message").value; 
    }

    if(video_frag){
        const videoElement = document.getElementById('video');
        ctx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
        
        image.src = canvas.toDataURL('image/jpg', 0.85);
        
        if(main_frag){
            main_frag=false;            
            main();
        }else{
            
            //再描画処理
            removeFunc();

            time=0;
           
            const texture = new THREE.Texture(image);
            texture.needsUpdate = true;
            materialShader.uniforms.uTex.value = texture; 

            plane = new THREE.Mesh(geometry,materialShader);
            plane.position.z = 0.01;
            scene.add(plane);

            makeTitle();
            makeStatus();
            makeDescription();

            scene.add(boxes);

            Jump();
        }
         
        //録画ストップ
        video_frag=false;
        const tracks = document.getElementById('video').srcObject.getTracks();
        tracks.forEach(track => {
            track.stop();
        });
        
    }else{

        //録画スタート
        video_frag=true;
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false, // マイクから音声も取得する場合はtrue
        }).then(media => {
            document.getElementById('video').srcObject = media;
        });
    }
    
}


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);

camera.position.z= 5;
camera.lookAt(new THREE.Vector3(0,0,0));

const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true
});
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff,1);


//事前宣言

// const loader = new THREE.TextureLoader();
var plane = new THREE.Mesh();
var plane_back = new THREE.Mesh();
var plane_ura = new THREE.Mesh();
var materialShader;
var materialShader_back;
var materialShader_ura;

window.mesh_text =new THREE.Mesh();
window.mesh_status =new THREE.Mesh();
window.mesh_description =new THREE.Mesh();

//text
const loader_text = new THREE.FontLoader();
var geometry_text;
var geometry_status;

var boxes = new THREE.Group();



var card_name = "Nanashi";
var card_atack = "0";
var card_defend = "0";
var card_naiyou = "Not so strong.";





const geometry_back = new THREE.BufferGeometry();
var alp=0.2;
const vertices_back = new Float32Array([
    -1-alp,1+alp,0,
    -1-alp,-2-alp,0,
    1+alp,1+alp,0,

    -1-alp,-2-alp,0,
    1+alp,-2-alp,0,
    1+alp,1+alp,0
]);

const uvs_back = new Float32Array([
    0,1,
    0,0,
    1,1,


    0,0,
    1,0,
    1,1
]);

geometry_back.setAttribute('position',new THREE.BufferAttribute(vertices_back,3));
geometry_back.setAttribute('uv',new THREE.BufferAttribute(uvs_back,2));

const loadShader_back = async() =>{
    const res_vert = await fetch("./src/shader_back.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./src/shader_back.frag");
    const frag = await res_frag.text();

    const loader = new THREE.TextureLoader();
    const texture = await loader.load("./src/back.jpg");
    // const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    const material = new THREE.ShaderMaterial({
        uniforms:{
            uTime:{value:0.0},                
            uTex:{value:texture}
        },
        vertexShader: vert,
        fragmentShader: frag
    })
    return material;
}

const geometry_ura = new THREE.BufferGeometry();
geometry_ura.setAttribute('position',new THREE.BufferAttribute(vertices_back,3));
geometry_ura.setAttribute('uv',new THREE.BufferAttribute(uvs_back,2));

const loadShader_ura = async() =>{
    const res_vert = await fetch("./src/shader_back.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./src/shader_back.frag");
    const frag = await res_frag.text();

    const loader = new THREE.TextureLoader();
    const texture = await loader.load("./src/ura.jpg");
    // const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    const material = new THREE.ShaderMaterial({
        uniforms:{
            uTime:{value:0.0},                
            uTex:{value:texture}
        },
        vertexShader: vert,
        fragmentShader: frag
    })
    return material;
}





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

const loadShader = async() =>{
    const res_vert = await fetch("./src/shader.vert");
    const vert = await res_vert.text();

    const res_frag = await fetch("./src/shader.frag");
    const frag = await res_frag.text();

    const loader = new THREE.TextureLoader();
    // const texture = await loader.load("./src/tex.jpg");
    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    const material = new THREE.ShaderMaterial({
        uniforms:{
            uTime:{value:0.0},                
            uTex:{value:texture}
        },
        vertexShader: vert,
        fragmentShader: frag
    })
    return material;
}

let time = 0;
var rotate_speed = 0.01;
const animate = function(){
    // time++;

    
    //animation
    if(time < Math.PI * 20){
        rotate_speed = 1;
    }else if(time < Math.PI * 70){
        rotate_speed = 0;
        plane.rotation.y = 0;
        plane_ura.rotation.y = Math.PI * -1;
        plane_back.rotation.y = 0;
        boxes.rotation.y = 0;
    }else{
        rotate_speed = 0.01;
    }
    
    if(mousedown_frag){
        rotate_speed=0;
    }else{
        time++;
    }
    plane.rotation.y += rotate_speed;
    plane_ura.rotation.y += rotate_speed;
    plane_back.rotation.y += rotate_speed;
    boxes.rotation.y += rotate_speed;
    // window.mesh_description.rotation.y = time/30;
    // window.mesh_status.rotation.y = time/30;
    
    // for(let i ; i<scene.children.length; i++){

    //     scene.children[i].rotation.needsUpdate = true;
    //     scene.children[i].rotation.y = time/30;
    // }

    console.log(scene.children[0].rotation.y);
    // console.log(scene.children[0].rotation.y);
    
    // plane.material.uniforms.uTime.value =time;
    
    
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
};



const main = async()=>{
    
    materialShader_ura = await loadShader_ura();
    plane_ura = new THREE.Mesh(geometry_ura,materialShader_ura);
    plane_ura.position.y = 0.3;
    plane_ura.rotation.y = Math.PI * -1; //裏返している
    scene.add(plane_ura);
    
    materialShader_back = await loadShader_back();
    plane_back = new THREE.Mesh(geometry_back,materialShader_back);
    plane_back.position.y = 0.3;
    scene.add(plane_back);
    
    materialShader = await loadShader();
    plane = new THREE.Mesh(geometry,materialShader);
    plane.position.z = 0.01;
    scene.add(plane);
    
    makeTitle();
    makeStatus();
    makeDescription();

    scene.add(boxes);
    
    
    
    // var TextGeometry = new THREE.TextGeometry( 'Three.js!', {
        //     size: 30, height: 4, curveSegments: 3,
    //     font: "helvetiker", weight: "bold", style: "normal",
    //     bevelThickness: 1, bevelSize: 2, bevelEnabled: true
    // });
    // var material_text = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    // var Text = new THREE.Mesh( TextGeometry, material_text );

    // scene.add( Text );
    Jump();
    //animation Start
    animate();
}

const removeFunc = ()=>{
    scene.remove(plane);
    scene.remove(boxes);
    boxes.remove(window.mesh_text);
    boxes.remove(window.mesh_status);
    boxes.remove(window.mesh_description);
    // geometry.dispose();
    // material.dispose();
    // texture.dispose();
    // window.objArray.push(mesh);
}

function makeTitle(){

    loader_text.load( './../helvetiker_regular.typeface.json', function ( font ) {
        
        geometry_text = new THREE.TextGeometry( card_name, {
            font: font,
            size: 0.16,
            height: 0,
            curveSegments: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.0,
            bevelSize: 0.0,
            bevelOffset: 0,
            bevelSegments: 0.0
        });
        console.log(geometry_text);
        const material_text = new THREE.MeshBasicMaterial( { color: 0x444400} ); // front
        
        window.mesh_text = new THREE.Mesh(geometry_text,material_text);
        window.mesh_text.position.x = -1.0;
        window.mesh_text.position.y = 1.15;
        window.mesh_text.position.z = 0.01;
        // mesh_text.rotation.x = Math.PI * 0.5;
    
        console.log(window.mesh_text);
    
        boxes.add(window.mesh_text);
    });

}

function makeStatus(){

    loader_text.load( './../helvetiker_regular.typeface.json', function ( font ) {
        
        geometry_text = new THREE.TextGeometry( 'ATK'+card_atack+'/DEF'+card_defend, {
            font: font,
            size: 0.1,
            height: 0,
            curveSegments: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.0,
            bevelSize: 0.0,
            bevelOffset: 0,
            bevelSegments: 0.0
        });
        console.log(geometry_text);
        const material_text = new THREE.MeshBasicMaterial( { color: 0x444400} ); // front
        
        window.mesh_status = new THREE.Mesh(geometry_text,material_text);
        window.mesh_status.position.x = -1.0;
        window.mesh_status.position.y = -1.2;
        window.mesh_status.position.z = 0.01;
        // mesh_text.rotation.x = Math.PI * 0.5;
    
        console.log(window.mesh_status);
    
        boxes.add(window.mesh_status);
    });

}
// 'New employees at Photron Ltd.'
function makeDescription(){

    loader_text.load( './../helvetiker_regular.typeface.json', function ( font ) {
        
        geometry_text = new THREE.TextGeometry( card_naiyou, {
            font: font,
            size: 0.1,
            height: 0,
            curveSegments: 0.1,
            bevelEnabled: true,
            bevelThickness: 0.0,
            bevelSize: 0.0,
            bevelOffset: 0,
            bevelSegments: 0.0
        });
        console.log(geometry_text);
        const material_text = new THREE.MeshBasicMaterial( { color: 0x444400} ); // front
        
        window.mesh_description = new THREE.Mesh(geometry_text,material_text);
        window.mesh_description.position.x = -1.0;
        window.mesh_description.position.y = -1.4;
        window.mesh_description.position.z = 0.01;
        // mesh_text.rotation.x = Math.PI * 0.5;
    
        console.log(window.mesh_description);
    
        boxes.add(window.mesh_description);
    });

}







//save file 
document.getElementById("hozon").onclick = function(){

	var canvas_download = document.getElementById("result_scene");

    var a = document.createElement('a');
	a.href = canvas_download.toDataURL('image/jpg', 0.85);
	a.download = 'canvas.jpg';
	a.click();
    console.log("OK");
}

const myPics = document.getElementById('result_scene');
var mousedown_frag=false;
myPics.addEventListener('mousedown', e => {
    console.log("OK");
    if(mousedown_frag){
        mousedown_frag=false;
    }else{
        mousedown_frag=true;
    }


  });

//Open image file 未完成

// document.getElementById("filename").onclick = function(){
//     var reader = new FileReader();              // エ　ローカルファイルの処理
//     reader.onload = function(event) {           // オ　ローカルファイルを読込後処理
//         var img = new Image();                 // カ　　imgファイルの処理
//         img.onload = function() {              // キ　　　imgファイル読込後の処理
//             // 画像の圧縮
//             var img_w = img.naturalWidth;      // naturalWidthは元の画像の幅
//             var img_h = img.naturalHeight;
//             var canvas_asp = canvas.height / canvas.width;
//             var img_asp = img_h / img_w;
//             if (img_asp <= canvas_asp) {        // 縦横比≦canvas縦横比→横長→canvasの横幅がネックに
//                 var 圧縮後画像幅 = canvas.width;
//                 var 圧縮率 = canvas.width / img_w;
//                 var 圧縮後画像高 = 圧縮率 * img_h;
//             }
//             else {                              // 縦長のとき
//                 圧縮後画像高 = canvas.height;
//                 圧縮率 = canvas.height / img_h;
//                 圧縮後画像幅 = 圧縮率 * img_w;
//             }
//             // 画像を圧縮してcanvas表示
//             ctx.drawImage(img, 0, 0, 圧縮後画像幅, 圧縮後画像高);
//             img_pros_src = ctx.getImageData(0, 0, 圧縮後画像幅, 圧縮後画像高);　
//             console.log(img_pros_src.data);
//         }                                      
//         img.src = event.target.result;         // シ　　　imgを読み込む　
//     }                                           // ス　
//     reader.readAsDataURL(files[0]);             // セ　ローカルファイルを読み込む　
// }

function Jump() {
    location.href = "#jumpto";
    console.log("OK");
}