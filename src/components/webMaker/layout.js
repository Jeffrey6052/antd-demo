
import React from "react"
import { Layout } from 'antd'

import styles from "./webMaker.module.css"

import Header from "./header"
import SiderLeft from "./siderLeft"
import Content from "./content"
import SiderRight from "./siderRight"

class WebMakerLayout extends React.PureComponent {

    constructor(props) {
        super(props)

        this.layoutStyle = {
            height: "100%",
            userSelect: "none"
        }
    }



    render() {

        // console.log("render webMakerlayout")

        return (
            <Layout className={styles.layout} style={this.layoutStyle}>
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