
import React from "react"

import Layout from '../components/Layout'

import * as THREE from "three"

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const CANVAS_WIDTH = 900
const CANVAS_HEIGHT = 600

class Page extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            app3d: {
                scene: null,
                camera: null,
                controls: null,
                renderer: null,
                clock: null,
                inited: false,
                model: null,
                modelMixer: null
            },
        }
    }

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


    componentWillUnmount() {

        let { app3d } = this.state

        cancelAnimationFrame(this.nextFrameId)

        if (!app3d.inited) {
            return
        }

        let oldScene = app3d.scene
        app3d.scene = null
        oldScene.dispose()

        let oldRenderer = app3d.renderer
        app3d.renderer = null
        oldRenderer.forceContextLoss()
        oldRenderer.domElement = null
        oldRenderer.dispose()

        let oldControls = app3d.controls
        app3d.controls = null
        oldControls.dispose()

        app3d = null
    }

    init3d() {

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 2000)

        camera.position.set(0, 3, 5)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)

        this.ref3d.appendChild(renderer.domElement)

        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.maxPolarAngle = Math.PI * 0.5
        controls.minDistance = 2
        controls.maxDistance = 10
        controls.target = new THREE.Vector3(0, 0, 0)
        controls.update()

        //光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 0.8)
        camera.add(pointLight)

        let clock = new THREE.Clock()

        this.setState((prevState) => {
            return {
                app3d: {
                    ...prevState.app3d,
                    scene,
                    camera,
                    renderer,
                    controls,
                    clock,
                    inited: true
                }
            }
        })

        const loader = new GLTFLoader();

        loader.load('/models/glb/Parrot/Parrot.glb', (gltf) => {

            const model = gltf.scene
            const mixer = new THREE.AnimationMixer(model)
            const action = mixer.clipAction(gltf.animations[0])
            action.play()

            scene.add(model);

            this.setState((prevState) => {
                return {
                    app3d: {
                        ...prevState.app3d,
                        model: model,
                        modelMixer: mixer
                    }
                }
            })

        }, undefined, (error) => {

            console.error(error)

        });

    }

    animate3d() {
        this.nextFrameId = requestAnimationFrame(this.animate3d.bind(this))
        this.render3d()
    }

    render3d() {

        const { inited, scene, camera, renderer, clock, model, modelMixer } = this.state.app3d

        if (!inited) {
            return
        }

        if (model) {
            model.rotation.y += 0.005
        }

        const delta = clock.getDelta()

        if (modelMixer) {
            modelMixer.update(delta)
        }

        renderer.render(scene, camera)

    }

}

export default Page