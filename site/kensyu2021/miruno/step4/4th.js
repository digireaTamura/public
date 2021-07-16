import * as THREE from './../three.module.js'

import { eff1 } from './eff1.js'
import { eff2 } from './eff2.js'


// 画像のアップロード～テクスチャ化
// input要素
const fileInput = document.getElementById('imgup');
// changeイベントで呼び出す関数
const handleFileSelect = () => {
  const files = fileInput.files;
  const reader = new FileReader();

  // URLとして読み込まれたときに実行する処理
  reader.onload = function (e) {
    const imageUrl = e.target.result; // URLはevent.target.resultで呼び出せる
    // Create an image
    const image = new Image(); 
    // Create texture
    const texture = new THREE.Texture(image);
    // On image load, update texture
    image.onload = () =>  { texture.needsUpdate = true; 
        addImage(texture);
    };
    // Set image source
    image.src = imageUrl;
  }

  for (let i = 0; i < files.length; i++) {
    reader.readAsDataURL(files[i]);
    break;
  }

}

// ファイル選択時にhandleFileSelectを発火
fileInput.addEventListener('change', handleFileSelect);

/////////////////


window.objArray = [];

const main = async()=>{

    const w_size = [300,480];

    window.scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w_size[0] / w_size[1], 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0)); 
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(w_size[0] , w_size[1]);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x000033, 1);


    // 追加した簡易エフェクトサンプル1 外にある円柱
    const ef1 = new eff1();
    ef1.create(1.5).then(()=>{
        window.objArray.push(ef1);
        window.scene.add(ef1.mesh);

        // この renderOrder を指定すると、描画順を奥行きを無視して強制的に指定することができる。
        ef1.mesh.renderOrder = -1;
    });

    // 追加した簡易エフェクトサンプル1 中にある円柱
    const ef2 = new eff1();
    ef2.create(1).then(()=>{
        window.objArray.push(ef2);
        window.scene.add(ef2.mesh);
        ef2.mesh.rotation.y = 0.3;
        ef1.mesh.renderOrder = 1;
    });

    
    // 追加した簡易エフェクトサンプル3 板１
    const ef3 = new eff2();
    ef3.create(5).then(()=>{
        window.objArray.push(ef3);
        window.scene.add(ef3.mesh);
    });

    // 追加した簡易エフェクトサンプル4 板2
    const ef4 = new eff2();
    ef4.create(3).then(()=>{
        window.objArray.push(ef4);
        window.scene.add(ef4.mesh);
        ef4.mesh.renderOrder = 1;
    });

    const animate = function () {

        requestAnimationFrame(animate);

        for(let i =0; i < objArray.length; i++){
            window.objArray[i].update();
        }

        renderer.render(window.scene, camera);
    };

    animate();
};

const addImage = (texture)=>{
    const geometry = new THREE.PlaneBufferGeometry();
    const material = new THREE.MeshBasicMaterial( { map: texture ,opacity:1, transparent: true } );
    const mesh = new THREE.Mesh( geometry, material );

    mesh.update = ()=>{

    };

    window.scene.add( mesh );
    window.objArray.push(mesh);
}

window.addEventListener("load",async()=>{
    main();
});
