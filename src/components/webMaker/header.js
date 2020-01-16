
import React from "react"
import { Layout } from 'antd'

class WebMakerHeader extends React.PureComponent {

    render() {
        return (
            <Layout.Header style={{ background: "#4C84FF" }}>
                <div className="demo-title-box">Header</div>
            </Layout.Header>
        )
    }
}

export default WebMakerHeader