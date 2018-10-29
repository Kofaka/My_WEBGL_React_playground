import React, {Component} from 'react';
import * as THREE from 'three';

class ThreeJsModel extends Component {
    constructor(props) {
        super(props);

        const [width, height] = [window.innerWidth, window.innerHeight];

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x7812d6, 1);

        this.sphereToRotate = {};

        this.animate = this.animate.bind(this);
        this.addManyLights = this.addManyLights.bind(this);
        this.addTexturedSphere = this.addTexturedSphere.bind(this);
    }

    componentDidMount() {
        this.threeJsModel.appendChild(this.renderer.domElement);
        this.addManyLights();
        this.addTexturedSphere();
    }

    addManyLights() {
        const lightsList = [
            {
                directionalLights: [0xffffff, 1],
                position: [0, 1, 0],
            },
            {
                directionalLights: [0xffffff, 0.5],
                position: [0, -1, 0],
            },
            {
                directionalLights: [0xffffff, 1],
                position: [1, 0, 0],
            },
            {
                directionalLights: [0xffffff, 0.5],
                position: [0, 0, 1],
            },
            {
                directionalLights: [0xffffff, 1],
                position: [0, 0, -1],
            },
            {
                directionalLights: [0xffffff, 0.5],
                position: [-1, 0, 0],
            },
        ];

        lightsList.map(item => {
            const light = new THREE.DirectionalLight(...item.directionalLights);
            light.position.set(...item.position);
            this.scene.add(light);
        });
    }

    addTexturedSphere() {
        // Add 'crossOrigin' tu turn on ability to use external link to to textures
        THREE.ImageUtils.crossOrigin = true;
        const textureLoader = new THREE.TextureLoader();
        textureLoader.crossOrigin = true;

        let material = null;
        const geometry = new THREE.SphereGeometry(24, 32, 32);
        const color = new THREE.Color('#009900');

        textureLoader.load(
            './rank_3_police_unit/textures/ctrl_eye_baseColor.png',
            texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
                material = new THREE.MeshPhongMaterial({color: color.getHex(), bumpMap: texture});
                this.sphereToRotate = new THREE.Mesh(geometry, material);
                this.scene.add(this.sphereToRotate);
                this.camera.updateProjectionMatrix();
                this.animate();
            },
            xhr => console.log(xhr),
            error => console.log(error),
        );
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.sphereToRotate.rotation.x += 0.01;
        this.sphereToRotate.rotation.y -= 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <section ref={thisNode => this.threeJsModel = thisNode}/>;
    }
}

export default ThreeJsModel;