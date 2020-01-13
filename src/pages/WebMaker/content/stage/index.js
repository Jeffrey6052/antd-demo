
import React from "react"
import PropTypes from 'prop-types'
import crypto from 'crypto'

import MeshComponent from "./meshComponent";
import { getComponent, loadComponent } from "../../componentLoader"

class Stage extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            meshes: this.getDefaultMeshes()
        }
    }

    getDefaultMeshes() {
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

    renderMesh(mesh) {

        const { componentKey, specs } = mesh

        const { properties } = specs

        const meshStyle = {
            backgroundColor: "white",
            position: "absolute",
            width: properties.$width,
            height: properties.$height,
            left: properties.$x,
            top: properties.$y
        }

        const meshProps = {
            style: meshStyle,
            key: properties.$id
        }

        return (
            <MeshComponent {...meshProps} >
                {this.renderComponent(componentKey, properties)}
            </MeshComponent>
        )
    }

    renderComponent(componentKey, properties) {
        const Component = loadComponent(componentKey)

        return <Component {...properties} />
    }

    onMouseEnter(event) {

    }

    onMouseLeave(event) {

    }

    onDragOver(event) {
        event.preventDefault()
    }

    onDrop(event) {
        event.preventDefault()

        const componentKey = event.dataTransfer.getData('componentKey')
        if (!componentKey) {
            return
        }

        const { pageX, pageY } = event
        const { left, top } = event.target.getBoundingClientRect();

        const x = pageX - left
        const y = pageY - top

        this.addMesh(componentKey, x, y)
    }

    addMesh(componentKey, x, y) {

        const component = getComponent(componentKey)

        if (!component) {
            return
        }

        const idcode = crypto.randomBytes(10).toString('hex')
        const namecode = crypto.randomBytes(3).toString('hex')

        const defaultName = componentKey
        const defaultWidth = 100
        const defaultHeight = 100
        const defaultRotate = 0

        const properties = {
            $id: idcode,
            $name: `${defaultName}-${namecode}`,
            $x: Math.floor(x - defaultWidth * 0.5),
            $y: Math.floor(y - defaultHeight * 0.5),
            $width: defaultWidth,
            $height: defaultHeight,
            $rotate: defaultRotate
        }

        const specs = {
            properties: properties
        }

        const mesh = {
            componentKey: componentKey,
            specs: specs
        }

        this.setState((preState) => ({
            meshes: [...preState.meshes, mesh]
        }))
    }

    render() {

        const { props, state } = this
        const { meshes } = state

        // console.log("meshes", meshes)

        const stageStyle = {
            position: "relative",
            width: "100%",
            height: "100%"
        }

        const stageProps = {
            style: stageStyle
        }

        if (props.mode === "writable") {
            stageProps.onMouseEnter = (e) => this.onMouseEnter(e)
            stageProps.onMouseLeave = (e) => this.onMouseLeave(e)
            stageProps.onDragOver = (e) => this.onDragOver(e)
            stageProps.onDrop = (e) => this.onDrop(e)
        }

        return (
            <div {...stageProps}>
                {meshes.map((mesh) => this.renderMesh(mesh))}
            </div>
        )
    }
}

Stage.propTypes = {
    mode: PropTypes.oneOf(['writable', 'readonly']).isRequired,
    meshes: PropTypes.arrayOf(PropTypes.object).isRequired
}

Stage.defaultProps = {
    mode: 'readonly',
    meshes: []
}

export default Stage