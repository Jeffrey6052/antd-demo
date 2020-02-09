
import React from "react"

import { Layout, Row, Col } from 'antd'

import WebMakerContext from "../context"

import StageConfig from "./stageConfig"
import MeshConfig from "./meshConfig"
import GroupConfig from "./groupConfig"

class WebMakerSiderRight extends React.PureComponent {

    static contextType = WebMakerContext

    render() {

        const { selectedMeshes } = this.context

        const siderStyle = {
            borderLeft: '1px solid #dadada',
            overflowY: 'auto',
            background: '#fff'
        }

        const meshCount = selectedMeshes.size

        let siderContent = null
        if (meshCount > 1) {
            siderContent = <GroupConfig />
        } else if (meshCount === 1) {
            siderContent = <MeshConfig />
        } else {
            siderContent = <StageConfig />
        }

        return (
            <Layout.Sider width={296} style={siderStyle}>
                {siderContent}
            </Layout.Sider>
        )
    }
}

export default WebMakerSiderRight