
import React from "react"
import PropTypes from 'prop-types'

import { EditorMode } from "../../constants"

import StageContainer from "../stageContainer"

class StageEditor extends React.PureComponent {

    renderStageContainer() {

        const { mode, width, height, backgroundColor, meshes } = this.props

        const containerProps = {
            mode,
            width,
            height,
            backgroundColor,
            meshes,
        }

        return <StageContainer {...containerProps} />
    }

    renderTopRuler() {
        return null
    }

    renderLeftRuler() {
        return null
    }

    renderRulerResetSpot() {
        return null
    }

    render() {

        const wrapperStyle = {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: "hidden",
            backgroundColor: "#f6f6f6"
        }

        const innerStyle = {
            width: "100%",
            height: "100%"
        }

        return (
            <div style={wrapperStyle}>

                <div style={innerStyle}>

                    {this.renderTopRuler()}
                    {this.renderLeftRuler()}
                    {this.renderRulerResetSpot()}

                    {this.renderStageContainer()}
                </div>
            </div>
        )
    }
}

StageEditor.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([EditorMode.Writeable, EditorMode.ReadOnly]).isRequired,
    meshes: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default StageEditor