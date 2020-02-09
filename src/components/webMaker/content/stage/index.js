
import React from "react"
import tinycolor from "tinycolor2"

import WebMakerContext from "../../context"

import Mesh from "./mesh"

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

        const meshProps = {
            componentKey,
            specs,
            key: properties.$id
        }

        return (
            <Mesh {...meshProps} />
        )
    }

    render() {

        // console.log("render: stage")

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