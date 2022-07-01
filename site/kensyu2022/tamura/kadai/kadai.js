import * as THREE from './../three.module.js'
import { OrbitControls } from './../OrbitControls.js'

const image = new Image();
let isVideo = true;
let doDot = 1.;
let doParticle = 1.;
document.getElementById("doDot").onclick = () => {
    if (doDot > 0) {
        doDot = 0;
    } 
    else {
        doDot = 1.;
    }
}
document.getElementById("doParticle").onclick = () => {
    if (doParticle > 0) {
        doParticle = 0;
    } 
    else {
        doParticle = 1.;
    }
}
const texture = new THREE.Texture(image);
const v = document.getElementById("video")
var videoTexture = new THREE.VideoTexture(v);
'use strict';
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
}).then(s => {
    v.srcObject = s;
    v.play()
}).catch(e => {
});
const file_picker = document.getElementById("file_picker");
let reader = new FileReader();
file_picker.onchange = (event) => {
    var fileData = event.target.files[0];

    if (!fileData.type.match('image.*')) {
        alert('画像を選択してください');
        return;
    }
    reader.readAsDataURL(fileData);
}
reader.onload = () => {
    image.src = reader.result;
}
image.onload = () => {
    texture.needsUpdate = true;
}

const download_button = document.getElementById("download_button");

const createMaterial = async () => {
    const res_frag = await fetch("./kadai/shader.frag");
    const frag = await res_frag.text();

    const res_vert = await fetch("./kadai/shader.vert");
    const vert = await res_vert.text();

    const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
            uTime: {
                value: 0.0
            },
            lightDirection: {
                value: new THREE.Vector3(1.0, 0.0, 1.0)
            },
            uTex: {
                type: "t",
                value: isVideo ? videoTexture : texture
            },
            uGrid: {
                value: 40.
            },
            uDistort: {
                value: 0.02
            },
            uDoDot: {
                value: 1.
            },
        }
    });
    material.transparent = true;

    return material;
}

const createParticleMaterial = async (size) => {
    const res_frag = await fetch("./kadai/particle.frag");
    const frag = await res_frag.text();

    const res_vert = await fetch("./kadai/particle.vert");
    const vert = await res_vert.text();

    const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
            uTime: {
                value: 0.0
            },
            uSize: {
                value: size
            },
            uCameraPosition: {
                value: new THREE.Vector3(0.0, 0.0, 1.0)
            },
            uDoParticle: {
                value: 1.
            },
        }
    });
    material.transparent = true;

    return material;
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
let points;
const createParticle = async (scene) => {
    const WIDTH = 40;
    const HEIGHT = 40;
    const positions = [];
    const colors = [];
    const velocities = [];

    for (let j = 0; j < HEIGHT; j++) {
        for (let i = 0; i < WIDTH; i++) {
            let x = 1. / (WIDTH - 1) * i * 2. - 1.;
            let y = 1. / (HEIGHT - 1) * (HEIGHT-j-1) * 2. - 1.;
            // let y = 1. / (HEIGHT - 1) * j * 2. - 1.;
            let z = 0.15;
            positions.push(x, y, z);
            colors.push(0, 1, 1, 1);
            velocities.push(0, 0, 0);
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
    geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));

    // マテリアルを作成
    const material = await createParticleMaterial(1./WIDTH*2*5.);

    // // 物体を作成
    points = new THREE.Points(geometry, material);
    await scene.add(points); // シーンは任意の THREE.Scene インスタンス
}

const updateParticleColors = (camera) => {
    if (!points.geometry.attributes.color.array) return;
    if (!canvas) return;
    if (!ctx) return;
    const colors = points.geometry.attributes.color.array;
    if (isVideo) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
    }
    else {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
    }
    const data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data;
    const WIDTH = 40;
    const HEIGHT = 40;

    for (let j = 0; j < HEIGHT; j++) {
        for (let i = 0; i < WIDTH; i++) {
            let cx = canvas.width / WIDTH * i;
            let cy = canvas.height / HEIGHT * j;
            let imgIndex = (cy * canvas.width + cx) * 4;
            let index = (j * WIDTH + i) * 4;
            colors[index] = data[imgIndex] / 255;
            colors[index + 1] = data[imgIndex + 1] / 255;
            colors[index + 2] = data[imgIndex + 2] / 255;
            colors[index + 3] = data[imgIndex + 3] / 255;
            // colors[index] = 0;
            // colors[index + 1] = 1;
            // colors[index + 2] =  0;
            // colors[index + 3] =  1;
        }
    }
    points.geometry.attributes.color.needsUpdate = true;
    sortPoints(camera);
}

function sortPoints(camera) {

    const vector = new THREE.Vector3();

    // Model View Projection matrix

    const matrix = new THREE.Matrix4();
    matrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
    matrix.multiply( points.matrixWorld );

    //

    const geometry = points.geometry;

    let index = geometry.getIndex();
    const positions = geometry.getAttribute( 'position' ).array;
    const length = positions.length / 3;

    if ( index === null ) {

        const array = new Uint16Array( length );

        for ( let i = 0; i < length; i ++ ) {

            array[ i ] = i;

        }

        index = new THREE.BufferAttribute( array, 1 );

        geometry.setIndex( index );

    }

    const sortArray = [];

    for ( let i = 0; i < length; i ++ ) {

        vector.fromArray( positions, i * 3 );
        vector.applyMatrix4( matrix );

        sortArray.push( [ vector.z, i ] );

    }

    function numericalSort( a, b ) {

        return b[ 0 ] - a[ 0 ];

    }

    sortArray.sort( numericalSort );

    const indices = index.array;

    for ( let i = 0; i < length; i ++ ) {

        indices[ i ] = sortArray[ i ][ 1 ];

    }

    geometry.index.needsUpdate = true;

}

const updateParticlePositions = () => {
    if (!points.geometry.attributes.position.array) return;
    const positions = points.geometry.attributes.position.array;
    const velocities = points.geometry.attributes.velocity.array;
    const WIDTH = 40;
    const HEIGHT = 40;

    const dt = 0.016;
    for (let j = 0; j < HEIGHT; j++) {
        for (let i = 0; i < WIDTH; i++) {
            let index = (j * WIDTH + i) * 3;
            positions[index] = positions[index] + velocities[index]*dt;
            positions[index + 1] = positions[index+1] + velocities[index+1]*dt;
            positions[index + 2] =  positions[index+2] + velocities[index+2]*dt - 0.5 * 9.8 * dt * dt ;
            velocities[index] = velocities[index];
            velocities[index + 1] = velocities[index+1];
            velocities[index + 2] =  velocities[index+2] -9.8 * dt;
            if (positions[index+2] < 0 ) {
                positions[index+2] *= -1;
                velocities[index+2] *= -0.10;
            }
            if (Math.abs(velocities[index+2]) < 0.0001 && Math.abs(positions[index+2]) < 0.0001 ) {
                positions[index+2] = 0;
                velocities[index+2] = 0;
            }
        }
    }
    points.geometry.attributes.position.needsUpdate = true;
    points.geometry.attributes.velocity.needsUpdate = true;
}



const main = async () => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new THREE.WebGLRenderer({
        preserveDrawingBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff, 1);

    download_button.onclick = () => {
        var a = document.createElement('a');
        a.href = renderer.domElement.toDataURL('image/png');
        a.download = 'download.png';
        a.click();
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    // scene.add(gridHelper);

    const verticies = new Float32Array([
        -1, 1, 0,
        -1, -1, 0,
        1, 1, 0,
        -1, -1, 0,
        1, -1, 0,
        1, 1, 0,
    ]);

    const uvs = new Float32Array([
        0, 1,
        0, 0,
        1, 1,
        0, 0,
        1, 0,
        1, 1,
    ]);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(verticies, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    const material = await createMaterial();
    let plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    document.getElementById("isVideo").onclick = async () => {
        isVideo = !isVideo;
        plane.material = await createMaterial();
    }
    await createParticle(scene);

    let time = 0;
    const animate = function () {
        time++;
        requestAnimationFrame(animate);
        plane.material.uniforms.uTime.value = time;
        plane.material.uniforms.uDoDot.value = doDot;
        points.material.uniforms.uDoParticle.value = doParticle;
        points.material.uniforms.uCameraPosition.value = camera.position;
        points.material.uniforms.uTime.value = time;
        updateParticleColors(camera);
        // updateParticlePositions();
        renderer.render(scene, camera);
    };

    document.getElementById("grid").onchange = (e) => {
        plane.material.uniforms.uGrid.value = e.target.value;
    }

    document.getElementById("distort").onchange = (e) => {
        plane.material.uniforms.uDistort.value = e.target.value;
    }


    animate();

}

window.addEventListener("load", async () => {
    main();
});
