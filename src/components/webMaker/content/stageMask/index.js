import React from "react"
import PropTypes from 'prop-types'

import WebMakerContext from "../../context"
import MeshMask from "./meshMask"

class StageMask extends React.PureComponent {

    static contextType = WebMakerContext;

    renderMeshMask(mesh) {

        const { specs } = mesh
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

        const { setMouseCapture } = this.props

        const maskProps = {
            selected: selectedMeshes.has(properties.$id),
            meshProperties: properties,
            setMouseCapture: setMouseCapture
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

StageMask.propTypes = {
    setMouseCapture: PropTypes.func.isRequired
}


export default StageMask