
import React from "react"

import WebMakerContext from "../../context"
import { EditorMode } from "../../constants"

import Mesh from "./mesh"
import { loadComponent } from "../../componentLoader"

class Stage extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        this.stageRef = React.createRef()

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDrop = this.onDrop.bind(this)
    }

    componentDidMount() {

    }

    renderMesh(mesh) {

        const { componentKey, specs } = mesh

        const { properties } = specs

        const meshStyle = {
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
            <Mesh {...meshProps} >
                {this.renderComponent(componentKey, properties)}
            </Mesh>
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

        const stageTarget = this.stageRef.current
        if (!stageTarget) {
            return
        }

        const componentKey = event.dataTransfer.getData('componentKey')
        if (!componentKey) {
            return
        }

        const { addMesh } = this.context

        const { clientX, clientY } = event
        const targetRect = stageTarget.getBoundingClientRect()
        const { handleDrop } = this.props

        const x = clientX - targetRect.x
        const y = clientY - targetRect.y

        handleDrop(componentKey, x, y)
    }

    // renderStageMask() {
    //     const { mode } = this.context
    //     if (mode === EditorMode.Readonly) {
    //         return null
    //     }

    //     const { meshes } = this.state

    //     const layerStyle = {
    //         position: "relative",
    //         width: "100%",
    //         height: "100%",
    //         zIndex: 100
    //     }

    //     return (
    //         <div style={layerStyle} id="stage-mask">
    //             {meshes.map((mesh) => this.renderMeshMask(mesh))}
    //         </div>
    //     )
    // }

    // renderMeshMask(mesh) {

    //     const { componentKey, specs } = mesh
    //     const { properties } = specs

    //     const wrapStyle = {
    //         position: "absolute",
    //         width: properties.$width,
    //         height: properties.$height,
    //         left: properties.$x,
    //         top: properties.$y
    //     }

    //     const wrapProps = {
    //         style: wrapStyle,
    //         key: properties.$id
    //     }

    //     const { selectedMeshes } = this.state

    //     const maskProps = {
    //         meshId: properties.$id,
    //         selected: selectedMeshes.has(properties.$id),
    //         addSelectedMeshes: this.addSelectedMeshes,
    //         setSelectedMeshes: this.setSelectedMeshes
    //     }

    //     return (
    //         <div {...wrapProps}>
    //             <MeshMask {...maskProps} />
    //         </div>
    //     )
    // }

    render() {

        console.log("render: stage")

        const { mode, backgroundColor, meshes } = this.context

        const stageStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: backgroundColor
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
            <div {...stageProps} id="stage" ref={this.stageRef}>
                {meshes.map((mesh) => this.renderMesh(mesh))}
                {/* {this.renderStageMask()} */}
            </div>
        )
    }
}

export default Stage