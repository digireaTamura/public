// import * as THREE from '../../three.module.js'

// class Image extends THREE.Object3D {
//     constructor(){
//         super();        
//     } 

//     create = async() => {
//         const res_frag = await fetch("./webApp/modules/image.frag");
//         const frag = await res_frag.text();
    
//         const res_vert = await fetch("./webApp/modules/image.vert");
//         const vert = await res_vert.text();

//         const loader = new THREE.TextureLoader();
//         const texture = await loader.load("./webApp/moon.jpg");

//         // 画像を貼り付けるもの
//         this.material = new THREE.ShaderMaterial({
//             vertexShader: vert,
//             fragmentShader: frag,
//             uniforms:{
//                 // uTex:{
//                 //     type:"t",
//                 //     value:texture
//                 // },
//                 uColor:{
//                     value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
//                 },
//                 // uTimer:{
//                 //     value: 0
//                 // }
//             }
//         });

//         this.board = new THREE.Sprite(this.material);
//         this.board.scale.set(5,5);

//         this.add(this.board);

//         return this;
//     }
// }

// export { Image };

import * as THREE from '../../three.module.js'


class Ita extends THREE.Object3D {
    // 経過時間管理数値
    addDul = 0;

    // 回転速度
    addFactor = 0.05;

    constructor(){
        super();        
    }  
    
    create = async() => {

        const res_frag = await fetch("./step3/modules/ita1.frag");
        const frag = await res_frag.text();
    
        const res_vert = await fetch("./step3/modules/ita1.vert");
        const vert = await res_vert.text();
      
        const loader = new THREE.TextureLoader();
        const texture = await loader.load("./webApp/moon.jpg");

        // 板表
        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms:{
                uTex:{
                    type:"t",
                    value:texture
                },
                uColor:{
                    value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
                },
                uTimer:{
                    value: 0
                }
            }
        });

        this.sprite = new THREE.Sprite(this.material);
        this.sprite.scale.set(5,5);

        this.add(this.sprite);

        this.rotation.y = 0;

        return this;
    };
    

    /////////////////////////

    update(){
        if(this.sprite ){
            // this.addDul = 10;
            this.rotation.y = 0;

            // // 回転
            // if(this.addDul >= Math.PI * 3){
            //     this.rotation.y =0;
            // }

            // this.sprite.material.uniforms.uTimer.value = this.addDul;
        }
    }
}

export { Ita };