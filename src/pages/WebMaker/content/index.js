
import React from "react"
import { Layout } from 'antd'

import Stage from "./stage"

class WebMakerContent extends React.PureComponent {

    render() {

        const wrapStyle = {
            width: "100%",
            height: "100%"
        }

        return (
            <Layout.Content>
                <div style={wrapStyle}>
                    <Stage mode="writable" />
                </div>
            </Layout.Content >
        )
    }
}

export default WebMakerContent