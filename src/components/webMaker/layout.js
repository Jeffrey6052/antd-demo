
import React from "react"
import { Layout } from 'antd'

import Header from "./header"
import SiderLeft from "./siderLeft"
import Content from "./content"
import SiderRight from "./siderRight"

class WebMakerLayout extends React.PureComponent {

    constructor(props) {
        super(props)

        this.layoutStyle = {
            height: "100%"
        }
    }

    render() {
        return (
            <Layout style={this.layoutStyle}>
                <Header />
                <Layout style={this.layoutStyle}>
                    <SiderLeft />
                    <Content />
                    <SiderRight />
                </Layout>
            </Layout>
        )
    }
}

export default WebMakerLayout