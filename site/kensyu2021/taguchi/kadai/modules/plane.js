import * as THREE from '../../three.module.js'


class Ita extends THREE.Object3D {
    // 経過時間管理数値
    addDul = 0;

    addFactor = 0.05;

    constructor(){
        super();        
    }  
    
    create = async() => {

        const res_frag = await fetch("./kadai/modules/ita1.frag");
        const frag = await res_frag.text();
    
        const res_vert = await fetch("./kadai/modules/ita1.vert");
        const vert = await res_vert.text();
      
        const loader = new THREE.TextureLoader();
        const texture = await loader.load("./kadai/jibun.jpg");

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

        //////////////////

        const res_frag2 = await fetch("./kadai/modules/ita2.frag");
        const frag2 = await res_frag2.text();
    
        const res_vert2 = await fetch("./kadai/modules/ita2.vert");
        const vert2 = await res_vert2.text();

      
        this.material2 = new THREE.ShaderMaterial({
            vertexShader: vert2,
            fragmentShader: frag2,
            uniforms:{
                uColor:{
                    value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0)
                }
            }
        });

        this.sprite2 = new THREE.Sprite(this.material2);
        this.sprite2.scale.set(5,5);
        this.sprite2.rotation.y = Math.PI * -1; //裏返している
        
        this.add(this.sprite2);

        /////////////////// 

        this.rotation.y = Math.PI * -1;

        return this;
    };
    

    /////////////////////////

    update(){
        if(this.sprite ){
            this.addDul += this.addFactor;
            this.rotation.y += this.addFactor;

            if(this.addDul >= Math.PI * 3){
                this.rotation.y =0;
            }
            
            this.sprite.material.uniforms.uTimer.value = this.addDul;
        }
    }
}

export { Ita };