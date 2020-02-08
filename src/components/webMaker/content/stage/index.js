
import React from "react"
import tinycolor from "tinycolor2"

import WebMakerContext from "../../context"
import { EditorMode } from "../../constants"

import Mesh from "./mesh"
import { loadComponent } from "../../componentLoader"

class Stage extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        this.stageRef = React.createRef()

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

    render() {

        console.log("render: stage")

        const { mode, width, height, backgroundColor, meshes } = this.context

        const stageStyle = {
            position: "absolute",
            width: width,
            height: height,
            backgroundColor: tinycolor(backgroundColor).toString()
        }

        const stageProps = {
            style: stageStyle
        }

        return (
            <div {...stageProps} id="stage" ref={this.stageRef}>
                {meshes.map((mesh) => this.renderMesh(mesh))}
            </div>
        )
    }
}

export default Stage