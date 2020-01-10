
import React from "react"
import { Layout } from 'antd'

import ComponentList from "./componentList"

class WebMakerSiderLeft extends React.PureComponent {

    render() {
        return (
            <Layout.Sider width={224} style={{ borderRight: '1px solid rgba(0,0,0,.1)', overflowY: 'auto', background: '#fff' }}>

                <ComponentList />

            </Layout.Sider>
        )
    }
}

export default WebMakerSiderLeft