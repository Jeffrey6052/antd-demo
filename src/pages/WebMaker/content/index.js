
import React from "react"
import { Layout } from 'antd'

import StageEditor from "./stageEditor"

class WebMakerContent extends React.PureComponent {

    render() {

        const wrapStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
        }

        const editorProps = {
            width: 1440,
            height: 900,
            backgroundColor: "#FFFFFF"
        }

        return (
            <Layout.Content>
                <div style={wrapStyle}>
                    <StageEditor {...editorProps} />
                </div>
            </Layout.Content >
        )
    }
}

export default WebMakerContent