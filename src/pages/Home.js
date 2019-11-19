
import React from "react"

import Layout from '../components/Layout'

import * as THREE from "three";

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 600

class Home extends React.Component {

    render() {
        return (
            <Layout>
                <h2>Home</h2>
                <div ref={ref => (this.mount = ref)} style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px`, border: "1px solid #ccc" }} />
            </Layout>
        )
    }

    componentDidMount() {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(
            75,
            CANVAS_WIDTH / CANVAS_HEIGHT,
            0.1,
            1000
        );

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.mount.appendChild(renderer.domElement);

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();
    }
}

export default Home