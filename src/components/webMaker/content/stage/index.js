
import React from "react"
import crypto from 'crypto'

import WebMakerContext from "../../context"
import { EditorMode } from "../../constants"

import MeshComponent from "./meshComponent";
import { getComponent, loadComponent } from "../../componentLoader"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

class Stage extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        this.state = {
            meshes: []
        }

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDrop = this.onDrop.bind(this)
    }

    componentWillMount() {

        const { defaultMeshes } = this.context

        this.setState({
            meshes: defaultMeshes
        })
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
        const { scale } = this.props

        console.log("pageX", pageX)
        console.log("left", left)
        console.log("scale", scale)

        const x = pageX - left * scale
        const y = pageY - top * scale

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

        console.log("render: stage")

        const { mode, backgroundColor } = this.context
        const { meshes } = this.state

        const stageStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: backgroundColor,
        }

        const stageProps = {
            style: stageStyle
        }

        if (mode === EditorMode.Writeable) {
            stageProps.onMouseEnter = this.onMouseEnter
            stageProps.onMouseLeave = this.onMouseLeave
            stageProps.onDragOver = this.onDragOver
            stageProps.onDrop = this.onDrop
        }

        return (
            <div {...stageProps}>
                {meshes.map((mesh) => this.renderMesh(mesh))}
            </div>
        )
    }
}

export default Stage