import * as THREE from './../three.module.js'

class laser {
    create = async(size, color) => {
        const geometry = new THREE.CylinderGeometry(size, size, 15, 25, 25, true);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            opacity: 0.5
        });

        this.mesh = new THREE.Mesh(geometry, material);

        return;
    }

    update () {
        this.mesh.rotation.z = 0.5;

        if (this.mesh.scale.y >= 0.05) {
            this.mesh.scale.y -= 0.01;
        }
        else {
            this.mesh.scale.y += 0.01;
        }
    }
}

export {laser};