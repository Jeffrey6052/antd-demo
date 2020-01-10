
import React from "react"
import PropTypes from 'prop-types'

import crypto from 'crypto'

import { getComponent } from "../../componentLoader"

class Stage extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            meshes: null
        }
    }

    static getDerivedStateFromProps(props, prevState) {

        console.log("getDerivedStateFromProps")

        const meshes = [
            {
                componentKey: "icon",
                specs: {
                    $id: "fewu2i2312io21n4i321ojo4213",
                    $name: "icon-t8w2fv",
                    $x: 20,
                    $y: 20,
                    $width: 300,
                    $height: 180,
                    $rotate: 45
                }
            },
            {
                componentKey: "text",
                specs: {
                    $id: "fqwjgojp2412n5ionqwn312podw",
                    $name: "text-t8w2fv",
                    $x: 400,
                    $y: 20,
                    $width: 100,
                    $height: 200,
                    $rotate: 0
                }
            }
        ]

        return {
            meshes: meshes
        }
    }

    renderMesh(mesh) {

        const { componentKey, specs } = mesh

        const meshStyle = {
            backgroundColor: "white",
            position: "absolute",
            width: specs.$width,
            height: specs.$height,
            left: specs.$x,
            top: specs.$y
        }

        return (
            <div style={meshStyle} key={specs.$id}>
                {componentKey}
            </div>
        )
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

        console.log("onDrop", componentKey)
        console.log("pageX", pageX, "pageY", pageY, "left", left, "top", top)

        const x = pageX - left
        const y = pageY - top

        this.addMesh(componentKey, x, y)
    }

    addMesh(componentKey, x, y) {

        console.log("componentKey", componentKey)

        const component = getComponent[componentKey]

        console.log("component", component)

        if (!component) {
            return
        }

        const idcode = crypto.randomBytes(10).toString('hex')
        const namecode = crypto.randomBytes(3).toString('hex')

        const mesh = {
            componentKey: "icon",
            specs: {
                $id: idcode,
                $name: `${componentKey}-${namecode}`,
                $x: x,
                $y: y,
                $width: 100,
                $height: 100,
                $rotate: 0
            }
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