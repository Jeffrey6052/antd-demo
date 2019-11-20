
import * as THREE from "three"

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

const D3ModelLoader = {
    load_gltf_model: function (url) {
        return new Promise((resolve) => {

            const loader = new GLTFLoader()

            loader.load(url, (gltf) => {
                return resolve(gltf)
            }, undefined, (error) => {
                throw error
            })
        })

    },
    load_glb_model: function (url) {
        return this.load_gltf_model(url)
    },
    load_obj_model_with_mtl: function (url, mtlUrl) {

        const manager = new THREE.LoadingManager();
        manager.addHandler(/\.dds$/i, new DDSLoader());

        return new Promise(resolve => {
            new MTLLoader(manager)
                .load(mtlUrl, (materials) => {
                    materials.preload();
                    new OBJLoader(manager)
                        .setMaterials(materials)
                        .load(url, (object) => {
                            return resolve(object)
                        });
                });
        })
    }
}

export default D3ModelLoader