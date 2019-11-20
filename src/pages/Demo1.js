import React from 'react';

import Layout from '../components/Layout'

import * as THREE from "three"

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
        inited: false,
        autoRotateScene: true
      },
      model3d: {
        man: null,
        duck: null
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

    this.lastTime = Date.now();

    this.animate3d()
  }

  init3d() {

    const { groundHeight } = this
    const app3d = this.state.app3d

    const scene = new THREE.Scene()

    // camera
    const camera = new THREE.PerspectiveCamera(90, app3d.width / app3d.height, 1, 20000);
    camera.position.set(720, groundHeight + 1300, 2200)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(app3d.width, app3d.height)
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    this.ref3d.appendChild(renderer.domElement)

    const stats = new Stats();
    stats.dom.style.position = "absolute"

    this.ref3d.appendChild(stats.dom);

    //controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 10000;
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

    // 辅助线
    this.addAxisToScene(scene)

    this.setState({
      app3d: {
        ...app3d,
        scene,
        camera,
        renderer,
        stats,
        inited: true
      }
    })
  }

  addAxisToScene(scene) {
    const axisHelper = new THREE.AxisHelper(1000);
    axisHelper.position.set(-2000, 0, -3000)
    scene.add(axisHelper);
  }

  addLightsToScene(scene) {

    const { groundHeight } = this

    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(300, groundHeight + 800, 500);
    // light.position.multiplyScalar(1.3);

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 10000;

    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;

    light.shadow.camera.far = 5000;

    scene.add(light);
  }

  addGroundToScene(scene) {

    const { groundHeight } = this

    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load('textures/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;

    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
    mesh.position.y = groundHeight;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  async addParrotsToScene(scene) {

    const { groundHeight } = this

    const loadUrl = '/models/glb/Parrot/Parrot.glb'

    const gltf = await D3ModelLoader.load_glb_model(loadUrl)

    const object = gltf.scene

    object.scale.set(100, 100, 100)
    object.position.set(1700, groundHeight + 300, -200)
    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
      }
    })

    scene.add(object)

    const obj2 = object.clone()
    obj2.position.x += 250
    obj2.position.y += 250
    scene.add(obj2)

    const obj3 = object.clone()
    obj3.position.x += 500
    obj3.position.y -= 200
    scene.add(obj3)
  }

  async addDatacenterToScene(scene) {

    const { groundHeight } = this

    const baseUrl = "/models/glb/datacenter"

    const datacenterUrl = `${baseUrl}/datacenter-0715.glb`

    const daGltf = await D3ModelLoader.load_glb_model(datacenterUrl)

    const daScala = 200
    const daObject = daGltf.scene
    daObject.scale.set(daScala, daScala, daScala)
    daObject.position.set(0, groundHeight, 0)
    scene.add(daObject)
  }

  async addManToScene(scene) {

    const { groundHeight } = this

    let modelUrl = "/models/obj/male02/male02.obj"
    let mtlUrl = "/models/obj/male02/male02_dds.mtl"

    const object = await D3ModelLoader.load_obj_model_with_mtl(modelUrl, mtlUrl)

    let objHeight = 10
    let scale = 2
    object.scale.set(scale, scale, scale)
    object.position.set(0, groundHeight + (objHeight / 2) * scale, 0)

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
      }
    });

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
    object.position.set(1400, groundHeight, 400)
    object.rotation.y -= Math.PI / 2

    object.traverse(function (node) {
      if (node instanceof THREE.Mesh) {
        node.castShadow = true;
      }
    });

    scene.add(object)

    this.setState({
      model3d: {
        ...this.state.model3d,
        duck: object
      }
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

    const time = Date.now()

    const { lastTime } = this
    const duration = time - lastTime

    const { scene, camera, renderer } = app3d

    const model3d = this.state.model3d
    const man3d = model3d.man
    const duck3d = model3d.duck

    if (man3d) {
      man3d.position.z = Math.sin(duration / 10000) * 500
    }

    if (duck3d) {
      duck3d.rotation.y = duration / 1000
    }

    if (app3d.autoRotateScene) {
      scene.rotation.y -= 0.001
    }

    app3d.stats.update();

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

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
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