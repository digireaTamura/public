import * as THREE from './../three.module.js'


class eff1 {
    // 経過時間管理数値
    addDul = 0;

    addFactor = 0.05; 
    
    create = async(size) => {
        
        const loader = new THREE.TextureLoader();
        const texture = await loader.load("./step4/effepack/zan_A_01.jpg");

        const geometry = new THREE.CylinderGeometry(
            size,
            size,
            15,
            25,
            25,
            true
          );

        const material = new THREE.MeshBasicMaterial({
            map: texture, // テクスチャーを指定
            color: 0x007eff, // 色
            transparent: true, // 透明の表示許可
            blending: THREE.AdditiveBlending, // ブレンドモード
            side: THREE.DoubleSide, // 表裏の表示設定
            depthWrite: false // デプスバッファへの書き込み可否
        });

        this.mesh = new THREE.Mesh(geometry, material);

        return;
    }

    update(){
        this.mesh.rotation.y += 0.1;

        this.mesh.scale.y = Math.sin(this.mesh.rotation.y * 0.2);
    }
}


export { eff1 };