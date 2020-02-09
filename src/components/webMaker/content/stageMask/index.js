import React from "react"
import PropTypes from 'prop-types'
import classNames from "classnames"

import WebMakerContext from "../../context"
import MeshMask from "./meshMask"

import styles from "./mask.module.css"

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

        const { selectedMeshes, setSelectedMeshes, addSelectedMeshes, deleteSelectedMeshes } = this.context

        const { setMouseCapture } = this.props

        const maskProps = {
            selected: selectedMeshes.has(properties.$id),
            meshProperties: properties,
            setMouseCapture,
            setSelectedMeshes,
            addSelectedMeshes,
            setSelectedMeshes,
            deleteSelectedMeshes
        }

        return (
            <div {...wrapProps}>
                <MeshMask {...maskProps} />
            </div>
        )
    }

    render() {

        // console.log("render: stageMask")

        const { meshes } = this.context
        const { hoverable } = this.props

        const style = {
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 100
        }

        const maskProps = {
            style,
            className: classNames(styles.main, hoverable && styles.hoverable),
            id: "stage-mask"
        }

        return (
            <div {...maskProps}>
                {meshes.map((mesh) => this.renderMeshMask(mesh))}
            </div>
        )
    }
}

StageMask.propTypes = {
    hoverable: PropTypes.bool.isRequired,
    setMouseCapture: PropTypes.func.isRequired
}

export default StageMask