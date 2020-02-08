import React from "react"
import PropTypes from 'prop-types'

import WebMakerContext from "../../context"
import { isCtrlDown, isShiftDown } from "../../../../utils/KeyboardWatch"

import maskStyles from "./mask.module.css"

class MeshMask extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        // 记录鼠标按下瞬间的一些状态
        this.mouseDownX = null
        this.mouseDownY = null
        this.mouseDownTime = 0

        this.onMouseDown = this.onMouseDown.bind(this)
        this.onClick = this.onClick.bind(this)

    }

    onMouseDown(event) {

        this.mouseDownX = event.clientX
        this.mouseDownY = event.clientY
        this.mouseDownTime = new Date().getTime()

        const { meshProperties, setMouseCapture } = this.props

        const ctrlDown = isCtrlDown()
        const shiftDown = isShiftDown()

        const ctrlOrShiftDown = ctrlDown || shiftDown

        if (!ctrlOrShiftDown) {
            setMouseCapture({
                type: "mesh",
                data: meshProperties
            })
        }

        const meshId = meshProperties.$id

        const { selectedMeshes, setSelectedMeshes } = this.context

        if (!selectedMeshes.has(meshId) && !ctrlOrShiftDown) {
            setSelectedMeshes([meshId])
        }
    }

    onClick(event) {

        const { mouseDownX, mouseDownY, mouseDownTime } = this

        const currentTime = new Date().getTime()
        const clickDuration = currentTime - mouseDownTime

        const mouseMoved = mouseDownX !== event.clientX || mouseDownY !== event.clientY

        // 如果鼠标发生位移，则不认为是点击事件
        // 体验改进1: 如果鼠标按下和抬起的间隔很短, 小于200毫秒，则认为是点击事件
        if (mouseMoved && clickDuration >= 200) {
            return
        }

        const { meshProperties } = this.props

        const meshId = meshProperties.$id

        const { selectedMeshes, addSelectedMeshes, setSelectedMeshes, deleteSelectedMeshes } = this.context

        if (isShiftDown()) { // shift追加
            if (!selectedMeshes.has(meshId)) {
                addSelectedMeshes([meshId])
            }
        } else if (isCtrlDown()) { // ctrl反选
            if (selectedMeshes.has(meshId)) {
                deleteSelectedMeshes([meshId])
            } else {
                addSelectedMeshes([meshId])
            }
        } else { // 默认点击
            setSelectedMeshes([meshId])
        }
    }

    render() {

        const { selected } = this.props

        const selectedClass = selected ? maskStyles.selected : ""

        const maskProps = {
            className: `${maskStyles.container} ${selectedClass}`,
            onMouseDown: this.onMouseDown,
            onClick: this.onClick
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