import React from "react"
import PropTypes from 'prop-types'

import maskStyles from "./mask.module.css"

class MeshMask extends React.PureComponent {

    constructor(props) {
        super(props)

        console.log("MeshMask", props)

        this.handleMouseDown = this.handleMouseDown.bind(this)
    }

    handleMouseDown(event) {
        console.log("handleMouseDown", event)

        this.setSelected()
    }

    setSelected() {

        const { meshId, addSelectedMeshes, setSelectedMeshes } = this.props

        addSelectedMeshes([meshId])

        // meshId
        // addSelectedMeshes
        // setSelectedMeshes
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
    selected: PropTypes.bool.isRequired,
    addSelectedMeshes: PropTypes.func.isRequired,
    setSelectedMeshes: PropTypes.func.isRequired
}

export default MeshMask