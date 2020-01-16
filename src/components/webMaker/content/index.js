
import React from "react"
import { Layout } from 'antd'

import StageEditor from "./stageEditor"

class WebMakerContent extends React.PureComponent {

    constructor(props) {
        super(props)
        this.wrapStyle = {
            position: "relative",
            width: "100%",
            height: "100%"
        }
    }

    render() {

        return (
            <Layout.Content>
                <div style={this.wrapStyle}>
                    <StageEditor />
                </div>
            </Layout.Content >
        )
    }
}

export default WebMakerContent