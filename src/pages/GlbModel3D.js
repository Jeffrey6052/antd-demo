
import React from "react"

import Layout from '../components/Layout'

import * as THREE from "three"

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 600

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 3, 5)

class Page extends React.Component {

    render() {
        return (
            <Layout background="#eee">
                <div>
                    <h2>3D模型(glb格式)</h2>
                    <div
                        ref={ref => (this.ref3d = ref)}
                        style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px`, border: "1px solid #ccc" }}
                    />
                </div>
            </Layout>
        )
    }

    componentDidMount() {
        this.init3d()
        this.animate3d()
    }

    init3d() {

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 2000)

        camera.position.set(...DEFAULT_CAMERA_POSITION.toArray())
        camera.lookAt(new THREE.Vector3(0, 0, 0))

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)

        this.ref3d.appendChild(renderer.domElement)

        //光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 0.8)
        camera.add(pointLight)

        this.app3d = {
            scene,
            camera,
            renderer,
            gltf: null,
            walthead: null
        }

        var loader = new GLTFLoader();

        loader.load('/models/glb/Parrot/Parrot.glb', (gltf) => {

            scene.add(gltf.scene);

            this.app3d.gltf = gltf

        }, undefined, (error) => {

            console.error(error);

        });

    }

    animate3d() {
        requestAnimationFrame(this.animate3d.bind(this))
        this.render3d()
    }

    render3d() {

        const { scene, camera, renderer, gltf } = this.app3d

        if (gltf) {

            const gltfScene = gltf.scene

            gltfScene.rotation.y += 0.005
        }

        renderer.render(scene, camera)

    }

}

export default Page