
import React from "react"

import StageContainer from "../stageContainer"

class StageEditor extends React.PureComponent {

    constructor(props) {
        super(props)

        this.wrapperStyle = {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: "hidden",
            backgroundColor: "#f6f6f6"
        }

        this.innerStyle = {
            width: "100%",
            height: "100%"
        }

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
        return (
            <div style={this.wrapperStyle}>
                <div style={this.innerStyle}>

                    {this.renderTopRuler()}
                    {this.renderLeftRuler()}
                    {this.renderRulerResetSpot()}

                    <StageContainer />
                </div>
            </div>
        )
    }
}

export default StageEditor