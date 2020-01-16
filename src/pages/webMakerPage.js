import React from 'react'

import WebMaker, { EditorMode } from "../components/webMaker"

class WebMakerPage extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    generateDefaultMeshes = () => {
        const meshes = [
            {
                componentKey: "icon",
                specs: {
                    properties: {
                        $id: "fewu2i2312io21n4i321ojo4213",
                        $name: "icon-t8w2fv",
                        $x: 20,
                        $y: 20,
                        $width: 300,
                        $height: 180,
                        $rotate: 45
                    }
                }
            },
            {
                componentKey: "text",
                specs: {
                    properties: {
                        $id: "fqwjgojp2412n5ionqwn312podw",
                        $name: "text-t8w2fv",
                        $x: 360,
                        $y: 20,
                        $width: 200,
                        $height: 80,
                        $rotate: 0
                    }
                }
            },
            {
                componentKey: "image",
                specs: {
                    properties: {
                        $id: "gfw12n5ionqwn312pcd2",
                        $name: "image-fksdj3",
                        $x: 360,
                        $y: 140,
                        $width: 160,
                        $height: 160,
                        $rotate: 0
                    }
                }
            }
        ]

        return meshes
    }

    render() {

        const webMakerProps = {
            mode: EditorMode.Writeable,
            width: 1024,
            height: 768,
            backgroundColor: "#FFFFFF",
            defaultMeshes: this.generateDefaultMeshes()
        }

        return (
            <WebMaker {...webMakerProps} />
        )

    }

}

export default WebMakerPage