import * as THREE from './../three.module.js'

class fog {
    create = async() => {
        const loader = new THREE.TextureLoader();
        const texture = await loader.load("./webApp/fog.png");

        const SIZE = 3000;
        const LENGTH = 5000;

        const vertices = [];
        for (let i=0; i<LENGTH; i++) {
            const x = SIZE * (Math.random() - 0.5);
            const y = SIZE * (Math.random() - 0.5);
            const z = SIZE * (Math.random() - 0.5);

            vertices.push(x, y, z);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            size: 50,
            map: texture,
            transparent: true
        });

        this.mesh = new THREE.Points(geometry, material);

        return;
    }

    update () {
        this.mesh.position.x += 0.05;
        this.mesh.position.y += 0.05;
    }
}

export {fog};