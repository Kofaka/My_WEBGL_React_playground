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

        this.material = null;
        this.mesh = {};
        this.geometry = new THREE.SphereGeometry(24, 32, 32);
        THREE.ImageUtils.crossOrigin = true;
        this.textureLoader = new THREE.TextureLoader();
        this.textureLoader.crossOrigin = true;

        // so many lights
        this.light1 = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light1.position.set( 0, 1, 0 );
        this.scene.add( this.light1 );

        this.light2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.light2.position.set( 0, -1, 0 );
        this.scene.add( this.light2 );

        this.light3 = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light3.position.set( 1, 0, 0 );
        this.scene.add( this.light3 );

        this.light4 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.light4.position.set( 0, 0, 1 );
        this.scene.add( this.light4 );

        this.light5 = new THREE.DirectionalLight( 0xffffff, 1 );
        this.light5.position.set( 0, 0, -1 );
        this.scene.add( this.light5 );

        this.light6 = new THREE.DirectionalLight( 0xffffff, 0.5 );
        this.light6.position.set( -1, 0, 0 );
        this.scene.add( this.light6 );

        this.animate = this.animate.bind(this);
    }

    componentDidMount() {
        this.threeJsModel.appendChild(this.renderer.domElement);

        this.textureLoader.load(
            './rank_3_police_unit/textures/ctrl_eye_baseColor.png',
            texture => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(2, 2);
                const color = new THREE.Color('#009900');
                this.material = new THREE.MeshPhongMaterial({color: color.getHex(), bumpMap: texture});
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.scene.add(this.mesh);
                this.camera.updateProjectionMatrix();
                this.animate();
            },
            xhr => console.log(xhr),
            error => console.log(error),
        );
    }

    animate() {
        requestAnimationFrame(this.animate);
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y -= 0.01;

        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return <section ref={thisNode => this.threeJsModel = thisNode}/>;
    }
}

export default ThreeJsModel;