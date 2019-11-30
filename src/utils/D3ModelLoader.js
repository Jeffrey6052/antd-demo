
import * as THREE from "three"

import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { GLTFLoader } from './GLTFLoader'

const D3ModelLoader = {
    load_gltf_model_with_token: function (url, token) {
        return new Promise((resolve) => {
            const loader = new GLTFLoader()
            loader.setToken(token)
            loader.load(url, (gltf) => resolve(gltf))
        })
    },
    load_gltf_model: function (url) {
        return new Promise((resolve) => {
            const loader = new GLTFLoader()

            loader.load(url, (gltf) => resolve(gltf))
        })
    },
    load_glb_model: function (url) {
        return this.load_gltf_model(url)
    },
    load_obj_model: function (url, color = 0xBBC0C7) {
        const manager = new THREE.LoadingManager()
        const material = new THREE.MeshBasicMaterial({ color: color })

        return new Promise(resolve => {
            new OBJLoader(manager).load(url, (object) => {
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = material
                    }
                })

                return resolve(object)
            })
        })
    },
    load_obj_model_with_mtl: function (url, mtlUrl) {
        const manager = new THREE.LoadingManager()
        manager.addHandler(/\.dds$/i, new DDSLoader())

        return new Promise(resolve => {
            new MTLLoader(manager)
                .load(mtlUrl, (materials) => {
                    materials.preload()
                    new OBJLoader(manager)
                        .setMaterials(materials)
                        .load(url, (object) => resolve(object))
                })
        })
    },
    load_fbx_model: function (url) {
        const loader = new FBXLoader()

        return new Promise(resolve => {
            loader.load(url, (object) => resolve(object))
        })
    }
}

export default D3ModelLoader
