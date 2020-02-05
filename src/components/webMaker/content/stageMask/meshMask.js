import React from "react"
import PropTypes from 'prop-types'

import WebMakerContext from "../../context"
import { isCtrlDown } from "../../../../utils/KeyboardWatch"

import maskStyles from "./mask.module.css"

class MeshMask extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)
        this.handleMouseDown = this.handleMouseDown.bind(this)
    }

    handleMouseDown(event) {

        const isLock = false
        if (isLock) {
            return
        }

        event.stopPropagation()

        const { meshId, selected } = this.props

        const { selectedMeshes, addSelectedMeshes, setSelectedMeshes, deleteSelectedMeshes } = this.context

        if (isCtrlDown()) {
            if (selectedMeshes.has(meshId)) {
                deleteSelectedMeshes([meshId])
            } else {
                addSelectedMeshes([meshId])
            }
        } else {
            setSelectedMeshes([meshId])
        }
    }

    render() {

        const { selected } = this.props

        const selectedClass = selected ? maskStyles.selected : ""

        const maskProps = {
            className: `${maskStyles.container} ${selectedClass}`,
            onMouseDown: this.handleMouseDown
        }

        return (
            <div {...maskProps} >
                <div className={maskStyles["top-left"]} style={{ cursor: "nwse-resize" }} />
                <div className={maskStyles["top"]} style={{ cursor: "ns-resize" }} />
                <div className={maskStyles["top-right"]} style={{ cursor: "nesw-resize" }} />
                <div className={maskStyles["right"]} style={{ cursor: "ew-resize" }} />
                <div className={maskStyles["bottom-right"]} style={{ cursor: "nwse-resize" }} />
                <div className={maskStyles["bottom"]} style={{ cursor: "ns-resize" }} />
                <div className={maskStyles["bottom-left"]} style={{ cursor: "nesw-resize" }} />
                <div className={maskStyles["left"]} style={{ cursor: "ew-resize" }} />
            </div>
        )
    }

}

MeshMask.propTypes = {
    meshId: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired
}

export default MeshMask