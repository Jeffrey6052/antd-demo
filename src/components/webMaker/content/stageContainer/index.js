
import React from "react"
import PropTypes from 'prop-types'

import { EditorMode } from "../../constants"

import Stage from "../stage"

class StageContainer extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            translateX: props.width * props.scale * -1,
            translateY: props.height * props.scale * -1,
        }
    }

    renderStage() {

        const { mode, width, height, backgroundColor, meshes } = this.props

        const stageProps = {
            mode,
            width,
            height,
            backgroundColor,
            meshes,
        }

        return <Stage {...stageProps} />
    }

    render() {

        const { width, height, scale } = this.props
        const { translateX, translateY } = this.state

        const containerStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            touchAction: "none",
        }

        const scaleLayerStyle = {
            position: "absolute",
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            transformOrigin: "left top",
            willChange: "transform",
        }

        const fullLayerStyle = {
            width: width * 3,
            height: height * 3,
            overflow: "hidden",
        }

        const wrapperStyle = {
            marginLeft: width,
            marginTop: height,
            width: width,
            height: height,
        }

        return (
            <div style={containerStyle}>
                <div style={scaleLayerStyle}>
                    <div style={fullLayerStyle}>
                        <div style={wrapperStyle}>
                            {this.renderStage()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

StageContainer.propTypes = {
    mode: PropTypes.oneOf([EditorMode.Writeable, EditorMode.ReadOnly]).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    meshes: PropTypes.arrayOf(PropTypes.object).isRequired,
    scale: PropTypes.number.isRequired
}

StageContainer.defaultProps = {
    scale: 1
}

export default StageContainer