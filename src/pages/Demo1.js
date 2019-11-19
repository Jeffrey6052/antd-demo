import React from 'react';

import Layout from '../components/Layout'

import * as THREE from "three"

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
        inited: false
      }
    }
  }

  render() {

    const { app3d } = this.state

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
          </div>
          <div className="demo-block">

          </div>
        </div>
      </Layout>
    )
  }

  componentDidMount() {
    this.init3d()
    this.animate3d()
  }

  init3d() {

    const app3d = this.state.app3d

    const scene = new THREE.Scene()

    // camera
    const camera = new THREE.PerspectiveCamera(30, app3d.width / app3d.height, 1, 10000);
    camera.position.set(1000, 50, 1500);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(app3d.width, app3d.height)
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    this.ref3d.appendChild(renderer.domElement)

    const stats = new Stats();

    console.log(stats.dom.style.position = "absolute");

    this.ref3d.appendChild(stats.dom);

    // controls
    var controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minDistance = 1000;
    controls.maxDistance = 5000;

    // lights
    this.addLightsToScene(scene)

    // ground
    this.addGroundToScene(scene)

    // ball
    this.addSphereToScene(scene)

    this.setState({
      app3d: {
        ...app3d,
        scene,
        camera,
        renderer,
        stats,
        inited: true
      }
    }, () => {
      this.init3dModels()
    })
  }

  addLightsToScene(scene) {

    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.DirectionalLight(0xdfebff, 1);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);

    light.castShadow = true;

    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 300;

    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;

    light.shadow.camera.far = 1000;

    scene.add(light);
  }

  addGroundToScene(scene) {

    const loader = new THREE.TextureLoader();
    const groundTexture = loader.load('textures/terrain/grasslight-big.jpg');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(25, 25);
    groundTexture.anisotropy = 16;

    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);
  }

  addSphereToScene(scene) {
    scene.add(sphere)
  }


  init3dModels() {

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

    const { scene, camera, renderer } = app3d

    simulate(lastTime);

    app3d.stats.update();

    renderer.render(scene, camera)
  }

  setCanvasSize(width, height) {

    console.log("setCanvasSize", width, height)

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

}

function plane(width, height) {

  return function (u, v, target) {

    var x = (u - 0.5) * width;
    var y = (v + 0.5) * height;
    var z = 0;

    target.set(x, y, z);

  };

}

function simulate(time) {

  if (!lastTime) {

    lastTime = time;
    return;
  }

  // Ball Constraints
  ballPosition.z = - Math.sin(Date.now() / 600) * 90;
  ballPosition.x = Math.cos(Date.now() / 400) * 70;

  sphere.visible = true;

}

let lastTime

const ballPosition = new THREE.Vector3(0, - 45, 0);
const ballSize = 60; //40

// sphere
const ballGeo = new THREE.SphereBufferGeometry(ballSize, 32, 16);
const ballMaterial = new THREE.MeshLambertMaterial();

const sphere = new THREE.Mesh(ballGeo, ballMaterial);
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.visible = false;


export default Page