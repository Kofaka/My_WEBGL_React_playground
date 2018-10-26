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

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x7812d6, 1);

        this.geometry = new THREE.BoxGeometry(20, 20, 20);
        this.material = new THREE.MeshLambertMaterial({color: 0xfd59d7});
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.cube);

        this.light = new THREE.PointLight(0xFFFF00);
        this.light.position.set(10, 0, 25);
        this.scene.add(this.light);

        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        this.threeJsModel.appendChild(this.renderer.domElement);
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate);

        this.cube.rotation.x += 0.01;
        this.cube.rotation.y -= 0.01;
        this.camera.updateProjectionMatrix();

        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <section ref={thisNode => this.threeJsModel = thisNode}/>;
    }
}

export default ThreeJsModel;