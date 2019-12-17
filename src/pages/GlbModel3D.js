
import React from "react"

import Layout from '../components/Layout'

import * as THREE from "three"

import D3ModelLoader from '../utils/D3ModelLoader'

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
        const camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 5000)

        camera.position.set(0, 3, 5)

        scene.add(camera )

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.physicallyCorrectLights = true;
        renderer.gammaOutput = false;
        renderer.gammaFactor = 2.2;
        // renderer.setClearColor(0xcccccc);
        renderer.toneMappingExposure = 1.0

        renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT)

        this.ref3d.appendChild(renderer.domElement)

        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        // controls.maxPolarAngle = Math.PI
        controls.minDistance = 2
        controls.maxDistance = 10
        controls.target = new THREE.Vector3(0, 0, 0)
        controls.update()

        //光源
        this.addLightsToScene(scene, camera)

        //辅助线
        // this.addAxisToScene(scene)

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

        let url
        url = "/models/gltf/Duck/Duck.gltf"
        url = "/models/gltf/x.glb"
        let token = "11111"

        D3ModelLoader.load_gltf_model_with_token(url, token).then((gltf) => {

            const model = gltf.scene

            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3()).length();
            const center = box.getCenter(new THREE.Vector3());

            controls.reset();

            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);
            controls.maxDistance = size * 10;
            camera.near = size / 100;
            camera.far = size * 100;
            camera.updateProjectionMatrix();

            camera.position.copy(center);
            camera.position.x += size / 2.0;
            camera.position.y += size / 5.0;
            camera.position.z += size / 2.0;
            camera.lookAt(center);

            console.log(model)

            model.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true

                    console.log(node)
                }
            })

            let mixer = null
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model)
                const action = mixer.clipAction(gltf.animations[0])
                action.play()
            }

            this.traverseMaterials(model, (material) => {
                const encoding = THREE.sRGBEncoding
                if (material.map) material.map.encoding = encoding;
                if (material.emissiveMap) material.emissiveMap.encoding = encoding;
                if (material.map || material.emissiveMap) material.needsUpdate = true;
            });

            scene.add(model);

            // // 测量模型的大小
            // const box = new THREE.Box3().setFromObject(model)
            // const sizeTarget = new THREE.Vector3()
            // box.getSize(sizeTarget)

            // let maxSize = Math.max(sizeTarget.x, sizeTarget.y, sizeTarget.z)

            // // 如果模型太小，做放大处理
            // if (maxSize < 1) {
            //     const scale = Math.floor(1 / maxSize) + 1
            //     model.scale.set(scale, scale, scale)
            //     maxSize *= scale
            // }

            // camera.position.set(0, maxSize * 0.3, maxSize * 2)

            // controls.minDistance = 2
            // controls.maxDistance = maxSize * 4
            // controls.target = new THREE.Vector3(model.position.x, model.position.y + sizeTarget.y / 2, model.position.z)
            // controls.update()

            this.setState((prevState) => {
                return {
                    app3d: {
                        ...prevState.app3d,
                        model: model,
                        modelMixer: mixer
                    }
                }
            })

        });

    }

    traverseMaterials(object, callback) {
        object.traverse((node) => {
            if (!node.isMesh) return;
            const materials = Array.isArray(node.material)
                ? node.material
                : [node.material];
            materials.forEach(callback);
        });
    }

    addAxisToScene(scene) {
        const axisHelper = new THREE.AxisHelper(500)
        axisHelper.position.set(0, 0, 0)
        scene.add(axisHelper)
    }


    addLightsToScene(scene, camera) {

        const hemiLight = new THREE.HemisphereLight();
        hemiLight.name = 'hemi_light';
        scene.add(hemiLight);

        const light1 = new THREE.AmbientLight(0xffffff, 0.3);
        light1.name = 'ambient_light';
        light1.intensity = 0.3;
        camera.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 2.5);
        light2.position.set(0.5, 0, 0.866);
        light2.name = 'main_light';
        light2.intensity = 0.8 * Math.PI;
        camera.add(light2);

        // scene.add(new THREE.AmbientLight(0xffffff, 1))

        // const light = new THREE.DirectionalLight(0xffffff, 1);
        // light.position.set(-200, 500, -200);

        // light.castShadow = true;

        // const d = 1000;

        // light.shadow.camera.left = - d;
        // light.shadow.camera.right = d;
        // light.shadow.camera.top = d;
        // light.shadow.camera.bottom = - d;

        // light.shadow.camera.far = 2400;

        // scene.add(light);

        // //Create a helper for the shadow camera (optional)
        // var helper = new THREE.CameraHelper(light.shadow.camera);
        // scene.add(helper);
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

        // if (model) {
        //     model.rotation.y += 0.005
        // }

        const delta = clock.getDelta()

        if (modelMixer) {
            modelMixer.update(delta)
        }

        renderer.render(scene, camera)

    }

}

export default Page