import React from 'react'

import Layout from '../components/Layout'

import * as THREE from "three"

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import D3ModelLoader from '../utils/D3ModelLoader'

class Page extends React.Component {

  constructor(props) {

    super(props)

    this.state = {
      app3d: {
        width: 900,
        height: 600,
        scene: null,
        camera: null,
        renderer: null,
        stats: null,
        clock: null,
        inited: false,
        autoRotateScene: true
      },
      model3d: {
        man: null,
        duck: null,
        parrot: null,
        parrotMixer: null,
        parrot2: null,
        parrot2Mixer: null,
        parrot3: null,
        parrot3Mixer: null,
        robot: null,
        robotMixer: null
      },
      inspect: {
        camera: null
      }
    }

    this.groundHeight = -250 //平地高度
    this.lastTime = null //3D动画基准时间，初始渲染后再设置该值
  }

  render() {

    const { app3d } = this.state

    let playBtnArea = null
    if (app3d.autoRotateScene) {
      playBtnArea = (<button onClick={this.stopAutoRotateScene.bind(this)}>停止Y轴旋转</button>)
    } else {
      playBtnArea = <button onClick={this.startAutoRotateScene.bind(this)}>开始Y轴旋转</button>
    }

    return (
      <Layout>
        <h2>Demo1 Page</h2>
        <div className="demo-flex-box">
          <div className="demo-block">
            <div
              ref={ref => (this.ref3d = ref)}
              style={{ width: `${app3d.width}px`, height: `${app3d.height}px`, border: "1px solid #ccc", position: "relative" }}
            />
            <span className="demo-button">
              <button onClick={this.setCanvasSize.bind(this, 600, 400)}>600x400</button>
            </span>
            <span className="demo-button">
              <button onClick={this.setCanvasSize.bind(this, 900, 600)}>900x600</button>
            </span>
            <span className="demo-button">
              {playBtnArea}
            </span>
          </div>
          <div className="demo-block">
            <ModelInspect data={this.state.inspect.camera} />
          </div>
        </div>
      </Layout>
    )
  }

  componentDidMount() {

    this.init3d()

    this.lastTime = Date.now()

    this.animate3d()
  }

  init3d() {

    const { groundHeight } = this
    const app3d = this.state.app3d

    const scene = new THREE.Scene()

    // camera
    const camera = new THREE.PerspectiveCamera(90, app3d.width / app3d.height, 1, 20000)
    camera.position.set(720, groundHeight + 1300, 2200)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(app3d.width, app3d.height)
    renderer.gammaInput = true
    renderer.gammaOutput = true
    renderer.shadowMap.enabled = true

    this.ref3d.appendChild(renderer.domElement)

    const stats = new Stats()
    stats.dom.style.position = "absolute"

    this.ref3d.appendChild(stats.dom)

    //controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.maxPolarAngle = Math.PI * 0.5
    controls.minDistance = 500
    controls.maxDistance = 10000
    controls.update()

    // lights
    this.addLightsToScene(scene)

    // ground
    this.addGroundToScene(scene)

    // models
    this.addParrotsToScene(scene)

    this.addDatacenterToScene(scene)

    this.addManToScene(scene)

    this.addDuckToScene(scene)

    this.addRobotToScene(scene)

    // 辅助线
    this.addAxisToScene(scene)

    let clock = new THREE.Clock()

    this.setState({
      app3d: {
        ...app3d,
        scene,
        camera,
        renderer,
        stats,
        clock,
        inited: true
      }
    })
  }

  addAxisToScene(scene) {

    const { groundHeight } = this

    const axisHelper = new THREE.AxisHelper(500)
    axisHelper.position.set(-1000, groundHeight + 1, -2000)
    scene.add(axisHelper)
  }

  addLightsToScene(scene) {

    const { groundHeight } = this

    scene.add(new THREE.AmbientLight(0x666666))

    const light = new THREE.DirectionalLight(0xdfebff, 1)
    light.position.set(300, groundHeight + 800, 500)

    light.castShadow = true

    light.shadow.mapSize.width = 1024
    light.shadow.mapSize.height = 1024

    const d = 10000

    light.shadow.camera.left = - d
    light.shadow.camera.right = d
    light.shadow.camera.top = d
    light.shadow.camera.bottom = - d

    light.shadow.camera.far = 20000

    scene.add(light)
  }

  addGroundToScene(scene) {

    const { groundHeight } = this

    const loader = new THREE.TextureLoader()
    const groundTexture = loader.load('textures/terrain/grasslight-big.jpg')
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(25, 25)
    groundTexture.anisotropy = 16

    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture })

    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial)
    mesh.position.y = groundHeight
    mesh.rotation.x = - Math.PI / 2
    mesh.receiveShadow = true
    scene.add(mesh)
  }

  async addParrotsToScene(scene) {

    const { groundHeight } = this

    const loadUrl = '/models/glb/Parrot/Parrot.glb'

    const gltf = await D3ModelLoader.load_glb_model(loadUrl)
    const animation = gltf.animations[0]
    const object = gltf.scene
    object.scale.set(100, 100, 100)
    object.position.set(0, groundHeight + 1000, 0)
    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
      }
    })
    scene.add(object)

    const gltf2 = await D3ModelLoader.load_glb_model(loadUrl)
    const animation2 = gltf2.animations[0]
    const object2 = gltf2.scene
    object2.position.x += 1000
    object2.position.y -= 200
    object2.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
      }
    })
    scene.add(object2)

    const gltf3 = await D3ModelLoader.load_glb_model(loadUrl)
    const animation3 = gltf3.animations[0]
    const object3 = gltf3.scene
    object3.position.x -= 1000
    object3.position.y -= 200
    object3.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
      }
    })
    scene.add(object3)

    //飞行动画
    const mixer = new THREE.AnimationMixer(object)
    const action = mixer.clipAction(animation)
    action.play()

    const mixer2 = new THREE.AnimationMixer(object2)
    const action2 = mixer.clipAction(animation2)
    action2.play()

    const mixer3 = new THREE.AnimationMixer(object3)
    const action3 = mixer.clipAction(animation3)
    action3.play()

    this.setState({
      model3d: {
        ...this.state.model3d,
        parrot: object,
        parrotMixer: mixer,
        parrot2: object2,
        parrot2Mixer: mixer2,
        parrot3: object3,
        parrot3Mixer: mixer3,
      }
    })
  }

  async addDatacenterToScene(scene) {

    const { groundHeight } = this

    const baseUrl = "/models/glb/datacenter"

    const loadUrl = `${baseUrl}/datacenter-0715.glb`

    const gltf = await D3ModelLoader.load_glb_model(loadUrl)

    const scala = 200
    const object = gltf.scene
    object.scale.set(scala, scala, scala)
    object.position.set(0, groundHeight, 0)

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })

    scene.add(object)
  }

  async addManToScene(scene) {

    const { groundHeight } = this

    let modelUrl = "/models/obj/male02/male02.obj"
    let mtlUrl = "/models/obj/male02/male02_dds.mtl"

    const object = await D3ModelLoader.load_obj_model_with_mtl(modelUrl, mtlUrl)

    let objHeight = 10
    let scale = 2
    object.scale.set(scale, scale, scale)
    object.position.set(-200, groundHeight + (objHeight / 2) * scale, -1400)
    object.rotation.y += Math.PI / 2

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
      }
    })

    scene.add(object)

    this.setState({
      model3d: {
        ...this.state.model3d,
        man: object
      }
    })
  }

  async addDuckToScene(scene) {

    const { groundHeight } = this

    const loadUrl = '/models/gltf/Duck/Duck.gltf'

    const gltf = await D3ModelLoader.load_glb_model(loadUrl)

    const object = gltf.scene

    object.scale.set(100, 100, 100)
    object.position.set(0, groundHeight, 0)
    object.rotation.y -= Math.PI / 2

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true
      }
    })

    scene.add(object)

    this.setState({
      model3d: {
        ...this.state.model3d,
        duck: object
      }
    })
  }

  async addRobotToScene(scene) {

    const { groundHeight } = this

    const loader = new FBXLoader()
    loader.load('/models/fbx/Samba Dancing.fbx', (object) => {

      const mixer = new THREE.AnimationMixer(object)

      const action = mixer.clipAction(object.animations[0])
      action.play()

      object.scale.set(2, 2, 2)
      object.position.set(400, groundHeight, -1400)

      object.traverse(function (child) {

        if (child.isMesh) {

          child.castShadow = true
          child.receiveShadow = true
        }
      })

      scene.add(object)

      this.setState({
        model3d: {
          ...this.state.model3d,
          robot: object,
          robotMixer: mixer
        }
      })

    })


  }

  animate3d() {
    requestAnimationFrame(this.animate3d.bind(this))
    this.render3d()
  }

  render3d() {

    const app3d = this.state.app3d

    if (!app3d.inited) {
      return
    }
    const { scene, camera, renderer, clock } = app3d
    const model3d = this.state.model3d

    const time = Date.now()
    const { lastTime } = this
    const duration = time - lastTime
    const delta = clock.getDelta()


    if (model3d.parrot) {
      model3d.parrot.position.z = duration % 20000 - 10000
    }

    if (model3d.duck) {
      model3d.duck.rotation.y = duration / 1000
    }

    if (model3d.parrotMixer) {
      model3d.parrotMixer.update(delta)
      // console.log("parrotMixer", model3d.parrotMixer)
    }

    if (model3d.parrot2Mixer) {
      model3d.parrot2Mixer.update(delta)
      // console.log("parrot2Mixer", model3d.parrot2Mixer)
    }

    if (model3d.parrot3Mixer) {
      model3d.parrot3Mixer.update(delta)
    }

    if (model3d.robotMixer) {
      model3d.robotMixer.update(delta)
    }

    if (app3d.autoRotateScene) {
      scene.rotation.y -= 0.001
    }

    app3d.stats.update()

    this.setInspectState(camera)

    renderer.render(scene, camera)
  }

  setInspectState(camera) {
    this.setState({
      inspect: {
        ...this.state.inspect,
        camera: {
          name: "摄象机信息:",
          position: camera.position,
          rotation: camera.rotation
        }
      }
    })
  }

  setCanvasSize(width, height) {

    const app3d = this.state.app3d
    const { camera, renderer } = app3d

    this.setState({
      app3d: {
        ...app3d,
        width: width,
        height: height
      }
    })

    renderer.setSize(width, height)

    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  stopAutoRotateScene() {

    const app3d = this.state.app3d

    this.setState({
      app3d: {
        ...app3d,
        autoRotateScene: false
      }
    })
  }
  startAutoRotateScene() {

    const app3d = this.state.app3d

    this.setState({
      app3d: {
        ...app3d,
        autoRotateScene: true
      }
    })
  }

}


function ModelInspect(props) {

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

export default Page