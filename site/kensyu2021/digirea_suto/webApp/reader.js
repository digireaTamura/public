import * as THREE from './../three.module.js'
import { laser } from './laser.js'
import { fog } from './fog.js'

const inputImg = document.getElementById('inputImg');
// const saveImg = document.getElementById('saveImg');

// 背景画像
const backImg = document.getElementById('inputBackImg');

// 音声
const music = document.getElementById('playSound');

// キャンバス
// const canvas = document.getElementById('imgCanvas');

// ファイル画像読込
const loadLocalImg = () => {
    const fileData = inputImg.files;
    const reader = new FileReader();

    reader.onload = function(e) {
        // 画像パス読み出し
        const uploadImgSrc = e.target.result;

        const image = new Image();
        const texture = new THREE.Texture(image);

        // 画像のテクスチャ化
        image.onload = () => {
            texture.needsUpdate = true;
            addImage(texture);
        }

        // 画像パスを格納
        image.src = uploadImgSrc;
        // console.log(image.src);
    }

    for (let i=0; i<fileData.length; i++) {
        reader.readAsDataURL(fileData[i]);
        break;
    }
}

// ファイルインプット時にloadLocalImgを実行
inputImg.addEventListener('change', loadLocalImg);
// saveImg.addEventListener('change', loadLocalImg);

window.objArray = [];

// メイン処理
const main = async() => {
    // キャンバス
    const canvas = document.querySelector('#imgCanvas');
    var encoder;

    // キャンバスサイズ
    const canvasSize = [400, 400];

    window.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvasSize[0] / canvasSize[1], 0.1, 1000);

    // カメラ設定
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-10, 10, 10);
    scene.add(directionalLight);

    // 環境光
    var ambient = new THREE.AmbientLight(0x333333);
    scene.add(ambient);

    // レンダリング設定
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(canvasSize[0], canvasSize[1]);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x00, 1);

    // 音声
    var audio = new AudioContext();

    var buffer = null;
    var src = null;

    const LoadSample = (ctx, url) => {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            if (request.response) {
                ctx.decodeAudioData(request.response, (b) => {buffer=b;}, () => {});
                // document.querySelector("button#playSound").removeAttribute("disabled");
                music.disabled = false;
            };
        }
        request.send();
    }
        
    LoadSample(audio, "./webApp/dinner.mp3");

    // 霧
    const fogMat = new fog();
    fogMat.create().then(() => {
        window.objArray.push(fogMat);
        window.scene.add(fogMat.mesh);
        scene.fog = new THREE.FogExp2('#66cdaa', 0.035);
    })

   // 周波数分析
   var timerId;
   var analyser = audio.createAnalyser();

   analyser.fftSize = 128;
   analyser.minDecibels = -100;
   analyser.maxDecibels = -30;
   
   // オブジェクト
   var obj;
   var squere;
   var line;
   const changeGraphic = () => {
       var data = new Uint8Array(512);

       scene.remove(obj);
       scene.remove(squere);
       scene.remove(line);


       analyser.getByteTimeDomainData(data);

        // レーザー
       const geometry = new THREE.CylinderGeometry(
           0.1,
           0.1,
           Math.round(data[0] * 0.025),
           15,
           25,
           25,
           true
        );

        const material = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            opacity: 0.5
        });

        obj = new THREE.Mesh(geometry, material);
        obj.position.y = -3.0;
        obj.rotation.z = 1.5708;
        scene.add(obj);

        // 四角形
        const squereGeo = new THREE.PlaneGeometry(
            Math.round(data[0] * 0.025),
            Math.round(data[0] * 0.025),
            1,
            1
        );
 
         const squereMat = new THREE.MeshBasicMaterial({
             color: 0xFF0000,
             opacity: 0.5
         });
 
         squere = new THREE.Mesh(squereGeo, squereMat);
         scene.add(squere);

        // ライン
        const vertices = [];
        for (let i=0; i<32; i++) {
            const x = (i) - 8;
            const y = (data[i] * 0.01) - 1.5;
            const z = -2;

            vertices.push(x, y, z);
        }

        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0xFF0000,
            linewidth: 1
        });
        line = new THREE.Line(lineGeo, lineMat);
        // line = new THREE.Mesh(lineGeo, lineMat);

        scene.add(line);

        requestAnimationFrame(changeGraphic);
   }

   timerId = requestAnimationFrame(changeGraphic);

    // アニメーション
    const animate = function () {
        requestAnimationFrame(animate);

        for (let i=0; i<objArray.length; i++) {
            window.objArray[i].update();
        }

        renderer.render(window.scene, camera);
    }

    animate();
    

    // Playボタンを押した時
    music.addEventListener("click", async(e) => {
        var label;

        if (e.target.innerHTML == "Stop") {
            src.stop(0);
            cancelAnimationFrame(timerId);
            label = "Start";
        } else {
            src = audio.createBufferSource();
            src.buffer = buffer;
            src.loop = true;
            src.connect(audio.destination);
            src.connect(analyser);
            src.start(0);
            label = "Stop";
        }

        e.target.innerHTML = label;
    });

    // 画像保存
    const saveImg = document.querySelector("#saveImg");
    saveImg.addEventListener('click', () => {
        // ダウンロード直前に画像を再度呼び出す
        animate();
        canvas.toBlob((blob) => {
            saveBlob(blob, 'a.png');
        });
    });

    const saveBlob = (function() {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';

        return function saveData(blob, fileName) {
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
        };
    } ()
    );


    // //GIFアニメ処理
    // var ctx;
    // var recorder;
    // var frames;
    // var encorder;

    // // GIFアニメ生成(new)
    // // キャンバス
    // var dimCanvas = document.getElementById('2dCanvas');
    // var dimCtx = dimCanvas.getContext("2d");

    // const draw2dCanvas = function()  {
    //     dimCtx.clearRect(0, 0, dimCanvas.Width, dimCanvas.height);
    //     dimCtx.drawImage(canvas, 0, 0);
    //     requestAnimationFrame(draw2dCanvas);
    // }

    // draw2dCanvas();

    // window.scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, canvasSize[0] / canvasSize[1], 0.1, 1000);

    // // レンダリング設定
    // const saveRenderer = new THREE.WebGLRenderer({saveCanvas});
    // saveRenderer.setSize(canvasSize[0], canvasSize[1]);
    // document.body.appendChild(saveRenderer.domElement);
    // saveRenderer.setClearColor(0x00, 1);

    // ctx = canvas.getContext('2d');

    // var stream = dimCanvas.captureStream();

    // recorder = new MediaRecorder(stream);

    // const b = document.createElement('b');
    // document.body.appendChild(b);
    // b.style.display = 'none';

    // recorder.ondatavaliable = function(e) {
    //     var videoBlob = new Blob(e.data);
    //     blobUrl = window.URL.createObjectURL(videoBlob);
    //     b.download = 'movie.mp4';
    //     b.href = blobUrl;
    //     b.style.display = 'block';
    // }

    // // 画面録画
    // const recording = document.querySelector("#record");
    // recording.addEventListener('click', () => {
    //     recorder.start();

    //     encoder = new GIFEncoder();
    //     encoder.setRepeat(0);
    //     encoder.setDelay(200);
    //     encoder.start();

    //     for (var i=0; i<14; i++) {
    //         dimCtx.drawImage(canvas, 0, 0);
    //         encorder.addFrame(dimCtx);
    //     }
    // });

    // function viewFrame (i = -1) {
    //     i++;

    //     dimCtx.drawImage(canvas, 0, 0);
    //     encorder.addFrame(dimCtx);
    //     setTimeout (function() {
    //         viewFrame(i);
    //     }, 200);
    // }

    // // 録画終了，GIF作成
    // const createGif = document.querySelector("#createGif");
    // createGif.addEventListener('click', () => {
    //     recorder.stop();



    //     // console.log(recorder);

    //     // frames = viewFrame();

    //     // for (var i=0; i<14; i++) {
    //     //     dimCtx.drawImage(frames[i], 0, 0);
    //     //     encorder.addFrame(dimCtx);
    //     // }

    //     encorder.finish();
    //     document.getElementById('animeGif').src = 'data:image/gif;base64,' + encode64(encoder.stream().getData());
    // });
    
};

// レンダリング
const addImage = (texture) => {
    const geometry = new THREE.PlaneBufferGeometry(3, 3);

    // // 頂点設定(座標を逆時計回りに指定)
    // const vertices = new Float32Array([
    //     -1, 1, 0,
    //     -1, -1, 0,
    //     1, 1, 0,

    //     -1, -1, 0,
    //     1, -1, 0,
    //     1, 1, 0
    // ]);

    // // UV座標設定
    // const uvs = new Float32Array([
    //     0, 1,
    //     0, 0,
    //     1, 1,

    //     0, 0,
    //     1, 0,
    //     1, 1,
    // ]);

    // // シェーダー読込関数
    // const loadShader = async() => {
    //     const res_vert = await fetch("./webApp/image.vert");
    //     const vert = await res_vert.text();

    //     const res_frag = await fetch("./webApp/image.frag");
    //     const frag = await res_frag.text();
        
    //     const loader = new THREE.TextureLoader();
    //     const texture = await loader.load("./webApp/moon.jpg");

    //     // マテリアル設定
    //     const material = new THREE.ShaderMaterial({
    //         uniforms: {
    //             uTime: {value: 0.0},
    //             uTex: {value: texture}
    //         },
    //         vertexShader: vert,
    //         fragmentShader: frag
    //     });

    //     return material;
    // }

    // // シェーダー読込
    // const materialShader = await loadShader();

    
    // geometry.setAttribute('position', new THREE.Int8BufferAttribute(vertices, 3));
    // geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    const material = new THREE.MeshBasicMaterial({map: texture, opacity: 1, transparent: true});
    const mesh = new THREE.Mesh(geometry, material);

    mesh.update = () => {

    };

    window.scene.add(mesh);
    window.objArray.push(mesh);
}

window.addEventListener("load", async() => {
    main();
});