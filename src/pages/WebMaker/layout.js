
import React from "react"
import { Layout } from 'antd'

class WebMakerLayout extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {

        const { Header, SiderLeft, Content, SiderRight } = this.props

        return (
            <Layout style={{ height: "100%" }}>
                <Header />
                <Layout style={{ height: "100%" }}>
                    <SiderLeft />
                    <Content />
                    <SiderRight />
                </Layout>
            </Layout>
        )
    }
}

export default WebMakerLayout