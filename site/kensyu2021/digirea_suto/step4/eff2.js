import * as THREE from './../three.module.js'


class eff2 {
    // 経過時間管理数値
    addDul = 0;

    addFactor = 0.05; 
    
    create = async(size) => {
        
        const loader = new THREE.TextureLoader();
        const texture = await loader.load("./step4/effepack/efe17_A_F_Alp_0013.jpg");

        const geometry = new THREE.PlaneGeometry(
            size,
            size
          );

        const material = new THREE.MeshBasicMaterial({
            map: texture, // テクスチャーを指定
            color: 0x55aaff, // 色
            transparent: true, // 透明の表示許可
            blending: THREE.AdditiveBlending, // ブレンドモード
            side: THREE.DoubleSide, // 表裏の表示設定
            depthWrite: false // デプスバッファへの書き込み可否
        });

        this.mesh = new THREE.Mesh(geometry, material);

        return;
    }

    update(){
        this.addDul += this.addFactor;
        // this.mesh.rotation.z += 1;

        this.mesh.scale.x = Math.cos(this.addDul);
        this.mesh.scale.y = Math.cos(this.addDul);
    }
}


export { eff2 };