
import React, { useEffect, useState, useCallback, useRef } from 'react'

import * as THREE from "three"

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import D3ModelLoader from '../utils/D3ModelLoader'
import { makeTextSprite, makeCube } from '../utils/threeHelper'

import Layout from '../components/Layout'


export default function D3SpritePage(props) {

    const [groundHeight] = useState(-250)
    const [playTime] = useState(Date.now())

    const [env3d, setEnv3d] = useState({
        width: 1440,
        height: 900,
        scene: null,
        camera: null,
        controls: null,
        renderer: null,
        raycaster: null,
        stats: null,
        clock: null,
        inited: false,
        autoRotateScene: false
    })

    const [cityModel, setCityModel] = useState(null)

    const [sprites, setSprites] = useState([])
    const [cars, setCars] = useState([])
    const [birds, setBirds] = useState({})

    const [focusBuilding, setFocusBuilding] = useState(null)
    const [cameraInspect, setCameraInspect] = useState(null)

    const buildDefaultMouse = () => {
        return {
            down: false,
            moved: false,
            downPosition: null,
            movedPosition: null,
            downTime: 0
        }
    }

    const [mouse, setMouse] = useState(buildDefaultMouse())

    // console.log("mouse", mouse)

    // const [draging, setDraging] = useState(false)

    const refContainer = useRef()
    const refFrameId = useRef()

    useEffect(() => {

        init3d()

        return () => clean3d()
    }, [])

    useEffect(() => {

        const onWindowResize = () => {

            const { camera, renderer } = env3d

            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()

            renderer.setSize(window.innerWidth, window.innerHeight)

            setEnv3d({
                ...env3d,
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', onWindowResize, false)

        return () => window.removeEventListener('resize', onWindowResize, false)
    }, [env3d])

    useEffect(() => {
        animate3d()
        return () => cancelAnimationFrame(refFrameId.current)
    }, [env3d.inited, cars, birds])

    const onRendererDomMouseDown = useCallback((e) => {

        const downPosition = { x: e.clientX, y: e.clientY }

        setMouse({
            ...mouse,
            down: true,
            downPosition,
            downTime: Date.now()
        })

    })

    const onRendererDomMouseMove = useCallback((e) => {

        if (!mouse.down) return

        const movedPosition = { x: e.clientX, y: e.clientY }

        setMouse({
            ...mouse,
            moved: true,
            movedPosition
        })
    })

    const onRendererDomMouseUp = useCallback((e) => {

        const nativeEvent = e.nativeEvent

        if (!mouse.down) return

        if (!env3d.inited) return

        const container = refContainer.current
        if (!container) return

        const { downPosition } = mouse

        // 体验改进: 鼠标按下和抬起的间隔小于200毫秒,并且鼠标移动距离不超过10像素, 也认为是点击事件
        const moveDistance = Math.sqrt((e.clientX - downPosition.x) ** 2 + (e.clientY - downPosition.y) ** 2)
        const almostClick = (Date.now() - mouse.downTime) <= 200 && moveDistance < 10

        if (!almostClick) return

        const { renderer, raycaster, camera } = env3d

        var renderSize = renderer.getSize()

        const raycasterTarget = {
            x: (nativeEvent.layerX / renderSize.width) * 2 - 1,
            y: ((nativeEvent.layerY / renderSize.height) * 2 - 1) * -1
        }

        raycaster.setFromCamera(raycasterTarget, camera)

        const intersects = raycaster.intersectObjects(sprites, true)

        if (intersects.length > 0) {
            var obj = intersects[0].object
            if (obj && obj.userData) {
                setFocusBuilding(obj.userData)
            }
        } else {
            setFocusBuilding(null)
        }
    })

    const init3d = useCallback(() => {

        const container = refContainer.current
        if (!container) return

        const scene = new THREE.Scene()

        // camera
        const stageWidth = 10000000
        const cameraFar = stageWidth * 10
        const cameraNear = stageWidth / 10000
        const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, cameraNear, cameraFar)
        camera.position.set(-550000, groundHeight + 1430000, -780000)

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.gammaInput = true
        renderer.gammaOutput = true
        renderer.shadowMap.enabled = true
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap

        container.appendChild(renderer.domElement)

        const stats = new Stats()
        stats.dom.style.position = "absolute"
        stats.dom.style.left = "auto"
        stats.dom.style.right = 0

        container.appendChild(stats.dom)

        //controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.maxPolarAngle = Math.PI * 0.5
        controls.minDistance = cameraNear
        controls.maxDistance = stageWidth
        controls.target = new THREE.Vector3(-1700000, 320000, -2500000)
        controls.update()

        // lights
        addLightsToScene(scene)

        // models
        addCityToScene(scene)

        // 天空盒
        addSkyBoxToScene(scene, stageWidth)

        // 文字面板
        addSpritesToScene(scene, camera, renderer)

        // 添加汽车
        addCarsToScene(scene)

        // 添加鸟
        addBirdsToScene(scene)


        // 测试方块, 用于定位坐标系
        scene.add(makeCube(10000, 0xff0000, new THREE.Vector3(0, 0, 0)))
        scene.add(makeCube(10000, 0x00ff00, new THREE.Vector3(1000000, 0, 0)))
        scene.add(makeCube(10000, 0x0000ff, new THREE.Vector3(0, 1000000, 0)))
        scene.add(makeCube(10000, 0xff00ff, new THREE.Vector3(0, 0, 1000000)))

        // scene.add(makeCube(10000, 0xccccff, new THREE.Vector3(-1150598, 420337, -2148137)))

        const clock = new THREE.Clock()

        const raycaster = new THREE.Raycaster()

        setEnv3d({
            width: window.innerWidth,
            height: window.innerHeight,
            scene,
            camera,
            controls,
            renderer,
            stats,
            clock,
            raycaster,
            inited: true
        })
    })

    const animate3d = () => {
        refFrameId.current = requestAnimationFrame(animate3d)
        render3d()
    }

    const render3d = () => {

        if (!env3d.inited) return

        const { scene, camera, renderer, clock } = env3d

        // const delta = clock.getDelta()

        const globalTime = Date.now() - playTime

        // 更新汽车位置
        cars.forEach(({ model, properties }) => {

            if (!properties.moving) return

            const carTime = Math.abs((globalTime + properties.offset) % properties.duration)
            const moveDistance = properties.speed * carTime

            if (properties.debug) {
                console.log("moveDistance", moveDistance)
            }

            const { direction } = properties

            if (direction === "z+") {
                model.position.z = properties.z + moveDistance
            } else if (direction === "z-") {
                model.position.z = properties.z - moveDistance
            } else if (direction === "x+") {
                model.position.x = properties.x + moveDistance
            } else if (direction === "x-") {
                model.position.x = properties.x - moveDistance
            }
        })

        env3d.stats.update()

        setCameraInspect({
            name: "摄像机信息:",
            position: camera.position,
            rotation: camera.rotation
        })

        renderer.render(scene, camera)
    }

    const clean3d = () => {
        if (!env3d.inited) return

        let oldScene = env3d.scene
        env3d.scene = null
        oldScene.dispose()

        let oldRenderer = env3d.renderer
        env3d.renderer = null
        oldRenderer.forceContextLoss()
        oldRenderer.domElement = null
        oldRenderer.dispose()

        let oldControls = env3d.controls
        env3d.controls = null
        oldControls.dispose()

        env3d = null
    }

    const addLightsToScene = (scene) => {

        // const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        // hemiLight.name = 'hemi_light';
        // scene.add(hemiLight)

        scene.add(new THREE.AmbientLight(0x888888))

    }

    const addCityToScene = async (scene) => {

        const baseUrl = "/models/gltf/ccity_building_set_1"

        const loadUrl = `${baseUrl}/scene.gltf`

        const gltf = await D3ModelLoader.load_glb_model(loadUrl)

        const scala = 200
        const cityModel = gltf.scene
        cityModel.scale.set(scala, scala, scala)
        cityModel.position.set(0, groundHeight, 0)

        cityModel.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })

        scene.add(cityModel)

        setCityModel(cityModel)
    }

    const addSpritesToScene = (scene, camera, renderer) => {

        const scale = 6000 // 适配模型尺寸

        const sprite1 = makeTextSprite("员工宿舍楼", renderer)
        sprite1.scale.set(scale, scale, scale)
        sprite1.position.set(-1720000, 460000, -2500000)
        // sprite1.position.copy(camera.position)
        scene.add(sprite1)

        const sprite2 = makeTextSprite("办公楼A3", renderer)
        sprite2.position.set(-1020000, 460000, -2060000)
        sprite2.scale.set(scale, scale, scale)
        scene.add(sprite2)

        const sprite3 = makeTextSprite("作业车间C8", renderer)
        sprite3.position.set(-1020000, 380000, -1760000)
        sprite3.scale.set(scale, scale, scale)
        scene.add(sprite3)

        setSprites([sprite1, sprite2, sprite3])
    }

    const addCarsToScene = async (scene) => {

        const carModel = await create3dCarModel()

        const allCars = []

        const car1A = {
            model: carModel.clone(),
            properties: {
                x: 100000,
                z: 100000,
                ry: Math.PI / 2,
                speed: 500,
                direction: "z-",
                duration: 9000,
                offset: 2000,
                moving: true
            }
        }
        allCars.push(car1A)

        const car2A = {
            model: carModel.clone(),
            properties: {
                x: -5000,
                z: -4400000,
                ry: Math.PI / -2,
                speed: 500,
                direction: "z+",
                duration: 9000,
                offset: 0,
                moving: true
            }
        }
        allCars.push(car2A)

        const car3A = {
            model: carModel.clone(),
            properties: {
                x: -7660000,
                z: -1360000,
                ry: 0,
                speed: 500,
                direction: "x+",
                duration: 18000,
                offset: 0,
                moving: true
            }
        }
        allCars.push(car3A)

        const car3B = {
            model: carModel.clone(),
            properties: {
                x: -7660000,
                z: -1360000,
                ry: 0,
                speed: 500,
                direction: "x+",
                duration: 18000,
                offset: 6000,
                moving: true
            }
        }
        allCars.push(car3B)

        const car3C = {
            model: carModel.clone(),
            properties: {
                x: -7660000,
                z: -1360000,
                ry: 0,
                speed: 500,
                direction: "x+",
                duration: 18000,
                offset: 12000,
                moving: true
            }
        }
        allCars.push(car3C)

        const car4A = {
            model: carModel.clone(),
            properties: {
                x: 1800000,
                z: -1500000,
                ry: Math.PI,
                speed: 500,
                direction: "x-",
                duration: 18000,
                offset: 0,
                moving: true
            }
        }
        allCars.push(car4A)

        const car4B = {
            model: carModel.clone(),
            properties: {
                x: 1800000,
                z: -1500000,
                ry: Math.PI,
                speed: 500,
                direction: "x-",
                duration: 18000,
                offset: 6000,
                moving: true
            }
        }
        allCars.push(car4B)

        const car4C = {
            model: carModel.clone(),
            properties: {
                x: 1800000,
                z: -1500000,
                ry: Math.PI,
                speed: 500,
                direction: "x-",
                duration: 18000,
                offset: 12000,
                moving: true
            }
        }
        allCars.push(car4C)

        const car5A = {
            model: carModel.clone(),
            properties: {
                x: -2780000,
                z: 100000,
                ry: Math.PI / 2,
                speed: 500,
                direction: "z-",
                duration: 9000,
                offset: 7000,
                moving: true,
                debug: false
            }
        }
        allCars.push(car5A)

        const car6A = {
            model: carModel.clone(),
            properties: {
                x: -2920000,
                z: -4400000,
                ry: Math.PI / -2,
                speed: 500,
                direction: "z+",
                duration: 9000,
                offset: 1000,
                moving: true
            }
        }
        allCars.push(car6A)


        const car7A = {
            model: carModel.clone(),
            properties: {
                x: -1326000,
                z: -2700000,
                ry: Math.PI / -2,
                speed: 500,
                direction: "z+",
                duration: 5000,
                offset: 0,
                moving: true
            }
        }
        allCars.push(car7A)

        allCars.forEach((car) => {

            const { model, properties } = car

            model.position.x = properties.x
            model.position.z = properties.z
            model.rotation.y = properties.ry

            // console.log("model", model)

            scene.add(model)
        })

        setCars(allCars)
    }

    const create3dCarModel = async () => {

        const baseUrl = "/models/gltf/CesiumMilkTruck"
        const loadUrl = `${baseUrl}/CesiumMilkTruck.gltf`

        const gltf = await D3ModelLoader.load_glb_model(loadUrl)

        const scala = 30000
        const carModel = gltf.scene
        carModel.scale.set(scala, scala, scala)
        carModel.position.set(0, groundHeight, 0)

        carModel.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
                node.castShadow = true
                node.receiveShadow = true
            }
        })

        return carModel
    }

    const addBirdsToScene = (scene) => {

    }

    const addSkyBoxToScene = (scene, stageWidth) => {

        const skyWidth = stageWidth * 10

        const geometry = new THREE.CubeGeometry(skyWidth, skyWidth, skyWidth)

        const cubeMaterials = [
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/demoAssets/skybox/sunnysky/posx.jpg"),
                side: THREE.DoubleSide
            }), //front side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/demoAssets/skybox/sunnysky/negx.jpg"),
                side: THREE.DoubleSide
            }), //back side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/demoAssets/skybox/sunnysky/posy.jpg"),
                side: THREE.DoubleSide
            }), //up side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/demoAssets/skybox/sunnysky/negy.jpg"),
                side: THREE.DoubleSide
            }), //down side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/demoAssets/skybox/sunnysky/posz.jpg"),
                side: THREE.DoubleSide
            }), //right side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load("/demoAssets/skybox/sunnysky/negz.jpg"),
                side: THREE.DoubleSide
            }) //left side
        ];

        const skyBox = new THREE.Mesh(geometry, cubeMaterials)
        skyBox.position.x = stageWidth / 2
        skyBox.position.y = 0
        skyBox.position.z = stageWidth / 2

        scene.add(skyBox)
    }

    const renderBuildingPanel = () => {
        if (!focusBuilding) return null

        return (
            <div className="buildingPanel">
                <div className="container">
                    <h3 style={{ color: "white" }}>{focusBuilding.title}</h3>
                    <div style={{ marginTop: 20, marginBottom: 20 }}>
                        <div className="col8">
                            <div>温度</div>
                            <div>{focusBuilding.template}℃</div>
                        </div>
                        <div className="col8">
                            <div>湿度</div>
                            <div>{focusBuilding.humidity}%</div>
                        </div>
                        <div className="col8">
                            <div>烟雾</div>
                            <div>-</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 20 }}>产能走势</div>
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <img src={`/demoAssets/buildingPanel/chart${focusBuilding.chart1}.png`} />
                    </div>
                    <div style={{ marginTop: 20 }}>营收走势</div>
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                        <img src={`/demoAssets/buildingPanel/chart${focusBuilding.chart2}.png`} />
                    </div>
                </div>
            </div>
        )
    }

    const visibility = cityModel ? "visible" : "hidden"

    const containerStyle = {
        width: `${env3d.width}px`,
        height: `${env3d.height}px`,
        position: "relative",
        visibility: visibility
    }

    const containerProps = {
        ref: refContainer,
        onMouseDown: onRendererDomMouseDown,
        onMouseMove: onRendererDomMouseMove,
        onMouseUp: onRendererDomMouseUp,
        style: containerStyle
    }

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <div {...containerProps} />
            {renderBuildingPanel()}
        </div>
    )
}


function SceneInspect(props) {

    if (!props.data) {
        return null
    }

    let { name, position, rotation } = props.data

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
