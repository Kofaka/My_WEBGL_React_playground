import React, {Component} from 'react';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

class ThreeJsModel extends Component {
    constructor(props) {
        super(props);

        const [width, height] = [window.innerWidth, window.innerHeight];

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 45);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x7812d6, 1);
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.animate = this.animate.bind(this);
        this.addManyLights = this.addManyLights.bind(this);
        this.addGLTFModel = this.addGLTFModel.bind(this);
    }

    componentDidMount() {
        this.threeJsModel.appendChild(this.renderer.domElement);
        this.addManyLights();
        this.addGLTFModel();

        this.animate();
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

    addGLTFModel() {
        const path = './rank_3_police_unit/textures';
        const format = '.png';
        const envMap = new THREE.CubeTextureLoader().load([
            `${path}posx${format}`, `${path}negx${format}`,
            `${path}posy${format}`, `${path}negy${format}`,
            `${path}posz${format}`, `${path}negz${format}`,
        ]);

        this.scene.background = envMap;

        const light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
        light.position.set(0, 1, 0);
        this.scene.add(light);

        const loader = new GLTFLoader();
        loader.load(
            './rank_3_police_unit/scene.gltf',
            gltf => {
                gltf.scene.traverse(child => child.isMesh && child.material.envMap);
                this.scene.add(gltf.scene);
            },
            xhr => console.log(xhr),
            error => console.error(error),
        );
    }

    animate() {
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <section ref={thisNode => this.threeJsModel = thisNode}/>;
    }
}

export default ThreeJsModel;