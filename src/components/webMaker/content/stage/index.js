
import React from "react"
import PropTypes from 'prop-types'
import crypto from 'crypto'

import { EditorMode } from "../../constants"

import MeshComponent from "./meshComponent";
import { getComponent, loadComponent } from "../../componentLoader"

class Stage extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            meshes: props.meshes
        }
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

        const stageStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: props.backgroundColor,
        }

        const stageProps = {
            style: stageStyle
        }

        if (props.mode === EditorMode.Writeable) {
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
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([EditorMode.Writeable, EditorMode.ReadOnly]).isRequired,
    meshes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Stage