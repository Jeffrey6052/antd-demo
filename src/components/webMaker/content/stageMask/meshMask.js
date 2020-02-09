import React from "react"
import PropTypes from 'prop-types'

import { isCtrlDown, isShiftDown } from "../../../../utils/KeyboardWatch"

import styles from "./mask.module.css"

class MeshMask extends React.PureComponent {

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

        const { selected, setSelectedMeshes } = this.props

        if (!selected && !ctrlOrShiftDown) {
            setSelectedMeshes([meshId])
        }
    }

    onClick(event) {

        const { mouseDownX, mouseDownY, mouseDownTime } = this

        const currentTime = new Date().getTime()
        const clickDuration = currentTime - mouseDownTime

        const mouseMoved = mouseDownX !== event.clientX || mouseDownY !== event.clientY

        // 如果鼠标发生位移，则不认为是点击事件
        // 体验改进1: 如果鼠标发生位移，但鼠标按下和抬起的间隔很短, 小于200毫秒，则也认为是点击事件
        if (mouseMoved && clickDuration >= 200) {
            return
        }

        const { meshProperties, selected, addSelectedMeshes, setSelectedMeshes, deleteSelectedMeshes } = this.props

        const meshId = meshProperties.$id

        if (isShiftDown()) { // shift追加
            if (!selected) {
                addSelectedMeshes([meshId])
            }
        } else if (isCtrlDown()) { // ctrl反选
            if (selected) {
                deleteSelectedMeshes([meshId])
            } else {
                addSelectedMeshes([meshId])
            }
        } else { // 默认点击
            if (!selected) {
                setSelectedMeshes([meshId])
            }
        }
    }

    render() {

        const { selected, meshProperties } = this.props

        console.log("render: meshMask", meshProperties.$name)

        const selectedClass = selected ? styles.selected : ""

        const maskProps = {
            className: `${styles.mesh} ${selectedClass}`,
            onMouseDown: this.onMouseDown,
            onClick: this.onClick
        }

        return (
            <div {...maskProps} >
                <div className={styles["top-left"]} style={{ cursor: "nwse-resize" }} />
                <div className={styles["top"]} style={{ cursor: "ns-resize" }} />
                <div className={styles["top-right"]} style={{ cursor: "nesw-resize" }} />
                <div className={styles["right"]} style={{ cursor: "ew-resize" }} />
                <div className={styles["bottom-right"]} style={{ cursor: "nwse-resize" }} />
                <div className={styles["bottom"]} style={{ cursor: "ns-resize" }} />
                <div className={styles["bottom-left"]} style={{ cursor: "nesw-resize" }} />
                <div className={styles["left"]} style={{ cursor: "ew-resize" }} />
            </div>
        )
    }

}

MeshMask.propTypes = {
    meshProperties: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    setMouseCapture: PropTypes.func.isRequired,
    setSelectedMeshes: PropTypes.func.isRequired,
    addSelectedMeshes: PropTypes.func.isRequired,
    setSelectedMeshes: PropTypes.func.isRequired,
    deleteSelectedMeshes: PropTypes.func.isRequired,
}

export default MeshMask