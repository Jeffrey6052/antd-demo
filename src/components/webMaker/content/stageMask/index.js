import React from "react"

import WebMakerContext from "../../context"
import MeshMask from "./meshMask"

class StageMask extends React.PureComponent {

    static contextType = WebMakerContext;

    renderMeshMask(mesh) {

        const { componentKey, specs } = mesh
        const { properties } = specs

        const wrapStyle = {
            position: "absolute",
            width: properties.$width,
            height: properties.$height,
            left: properties.$x,
            top: properties.$y
        }

        const wrapProps = {
            style: wrapStyle,
            key: properties.$id
        }

        const { selectedMeshes } = this.context

        const maskProps = {
            meshId: properties.$id,
            selected: selectedMeshes.has(properties.$id)
        }

        return (
            <div {...wrapProps}>
                <MeshMask {...maskProps} />
            </div>
        )
    }

    render() {
        const { meshes } = this.context

        const layerStyle = {
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 100
        }

        return (
            <div style={layerStyle} id="stage-mask">
                {meshes.map((mesh) => this.renderMeshMask(mesh))}
            </div>
        )
    }
}

export default StageMask