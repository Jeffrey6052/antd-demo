
import React from "react"

import Layout from '../components/Layout'

import * as THREE from "three"

import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

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
                renderer: null,
                model: null,
                modelLoaded: false,
                modelAdded: false,
                autoRotateY: true
            },
            modelInspect: null //模型信息
        }
    }

    render() {

        const app3d = this.state.app3d

        let addBtnArea = null
        if (app3d.modelLoaded) {
            if (app3d.modelAdded) {
                addBtnArea = (<button onClick={this.removeModel.bind(this)}>移除模型</button>)
            } else {
                addBtnArea = <button onClick={this.addModel.bind(this)}>添加模型</button>
            }

            // console.log(app3d.model)
        }

        let playBtnArea = null
        if (app3d.autoRotateY) {
            playBtnArea = (<button onClick={this.stopAutoRotateY.bind(this)}>停止Y轴旋转</button>)
        } else {
            playBtnArea = <button onClick={this.startAutoRotateY.bind(this)}>开始Y轴旋转</button>
        }

        return (
            <Layout background="#eee">
                <div>
                    <h2>3D模型(obj格式)</h2>

                    <div className="demo-flex-box">
                        <div className="demo-block">
                            <div
                                ref={ref => (this.ref3d = ref)}
                                style={{ width: `${CANVAS_WIDTH}px`, height: `${CANVAS_HEIGHT}px`, border: "1px solid #ccc" }}
                            />
                            <span className="demo-button">
                                {addBtnArea}
                            </span>
                            <span className="demo-button">
                                {playBtnArea}
                            </span>
                        </div>
                        <div className="demo-block">
                            <ModelInspect {...this.state.modelInspect} />
                        </div>
                    </div>
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

        camera.position.set(0, 150, 300)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)

        this.ref3d.appendChild(renderer.domElement)

        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.maxPolarAngle = Math.PI * 0.5
        controls.minDistance = 200
        controls.maxDistance = 800
        controls.target = new THREE.Vector3(0, 100, 0)
        controls.update()

        //光源
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 0.8)
        camera.add(pointLight)

        this.setState({
            app3d: {
                ...this.state.app3d,
                scene,
                camera,
                controls,
                renderer
            }
        }, () => {
            // this.initModel_v1()
            this.initModel_v2()
        })
    }

    animate3d() {
        this.nextFrameId = requestAnimationFrame(this.animate3d.bind(this))
        this.render3d()
    }

    render3d() {

        const app3d = this.state.app3d
        const { scene, model, camera, renderer } = app3d

        if (!app3d.modelLoaded) {
            return
        }

        if (model) {

            // model.opacity = 0.5
            // model.transparent = true

            if (app3d.autoRotateY) {
                model.rotation.y += 0.005
            }

            this.setState({
                modelInspect: {
                    name: "模型信息",
                    position: model.position,
                    rotation: model.rotation
                }
            })
        }

        renderer.render(scene, camera)
    }


    initModel_v1() {

        const app3d = this.state.app3d

        // manager
        const loadModel = () => {

            app3d.model.traverse(function (child) {
                if (child.isMesh) child.material.map = texture
            })
            app3d.model.position.y = 0
            app3d.scene.add(app3d.model)

            this.setState({
                app3d: {
                    ...app3d,
                    modelLoaded: true,
                    modelAdded: true
                }
            })
        }

        const manager = new THREE.LoadingManager(loadModel)
        manager.onProgress = function (item, loaded, total) {
            console.log(item, loaded, total)
        }

        // texture
        const textureLoader = new THREE.TextureLoader(manager)
        const texture = textureLoader.load('/textures/uv_grid_opengl.jpg')

        // model
        const onProgress = (xhr) => {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100
                console.log('model ' + Math.round(percentComplete, 2) + '% downloaded')
            }
        }
        const onError = () => { }
        const loader = new OBJLoader(manager)
        loader.load('/models/obj/male02/male02.obj', (obj) => {

            this.setState({
                app3d: {
                    ...this.state.app3d,
                    model: obj
                }
            })

        }, onProgress, onError)
    }

    initModel_v2() {

        const app3d = this.state.app3d

        // manager
        const manager = new THREE.LoadingManager();
        manager.addHandler(/\.dds$/i, new DDSLoader());
        manager.onProgress = function (item, loaded, total) {
            console.log("manager progress:", item, loaded, total)
        }

        // model
        const onProgress = (xhr) => {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100
                console.log('model ' + Math.round(percentComplete, 2) + '% downloaded')
            }
        }
        const onError = () => { }

        new MTLLoader(manager)
            .load('/models/obj/male02/male02_dds.mtl', (materials) => {
                materials.preload();
                new OBJLoader(manager)
                    .setMaterials(materials)
                    .load('/models/obj/male02/male02.obj', (object) => {

                        app3d.scene.add(object)

                        this.setState({
                            app3d: {
                                ...this.state.app3d,
                                model: object,
                                modelLoaded: true,
                                modelAdded: true
                            }
                        })

                    }, onProgress, onError);
            });

    }

    removeModel() {

        const app3d = this.state.app3d
        app3d.scene.remove(app3d.model)

        this.setState({
            app3d: {
                ...app3d,
                modelAdded: false
            }
        })
    }

    addModel() {

        const app3d = this.state.app3d
        app3d.scene.add(app3d.model)

        this.setState({
            app3d: {
                ...app3d,
                modelAdded: true
            }
        })
    }

    stopAutoRotateY() {

        const app3d = this.state.app3d

        this.setState({
            app3d: {
                ...app3d,
                autoRotateY: false
            }
        })
    }
    startAutoRotateY() {

        const app3d = this.state.app3d

        this.setState({
            app3d: {
                ...app3d,
                autoRotateY: true
            }
        })
    }

}

function ModelInspect(props) {

    const { name, position, rotation } = props

    if (!position) {
        return null
    }

    return (
        <React.Fragment>
            <h3>{name}</h3>
            <p>px: {position.x.toFixed(2)}</p>
            <p>py: {position.y.toFixed(2)}</p>
            <p>pz: {position.z.toFixed(2)}</p>
            <p>rx: {rotation.x.toFixed(2)}</p>
            <p>ry: {rotation.y.toFixed(2)}</p>
            <p>rz: {rotation.z.toFixed(2)}</p>
        </React.Fragment>
    )
}

export default Page