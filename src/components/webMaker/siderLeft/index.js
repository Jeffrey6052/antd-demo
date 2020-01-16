
import React from "react"
import { Layout } from 'antd'

import ComponentList from "./componentList"

class WebMakerSiderLeft extends React.PureComponent {

    render() {

        const siderStyle = {
            borderRight: '1px solid #dadada',
            overflowY: 'auto',
            background: '#fff'
        }

        return (
            <Layout.Sider width={224} style={siderStyle}>

                <ComponentList />

            </Layout.Sider>
        )
    }
}

export default WebMakerSiderLeft