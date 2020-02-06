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
        this.handleClick = this.handleClick.bind(this)

        this.updateMouseDownPosition(null, null)
    }

    updateMouseDownPosition(x, y) {
        this.mouseDownX = x
        this.mouseDownY = y
    }

    handleMouseDown(event) {

        const { meshProperties, setMouseCapture } = this.props

        const ctrlDown = isCtrlDown()

        if (!ctrlDown) {
            setMouseCapture({
                type: "mesh",
                data: meshProperties
            })
        }

        const meshId = meshProperties.$id

        const { selectedMeshes, addSelectedMeshes, setSelectedMeshes, deleteSelectedMeshes } = this.context

        if (!selectedMeshes.has(meshId) && !ctrlDown) {
            setSelectedMeshes([meshId])
        }

        this.updateMouseDownPosition(event.clientX, event.clientY)
    }

    handleClick(event) {

        const { mouseDownX, mouseDownY } = this

        this.updateMouseDownPosition(null, null)

        // 如果鼠标发生位移，则不认为是点击事件
        if (mouseDownX !== event.clientX || mouseDownY != event.clientY) {
            return
        }

        const { meshProperties } = this.props

        const meshId = meshProperties.$id

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
            onMouseDown: this.handleMouseDown,
            onClick: this.handleClick
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
    meshProperties: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    setMouseCapture: PropTypes.func.isRequired
}

export default MeshMask