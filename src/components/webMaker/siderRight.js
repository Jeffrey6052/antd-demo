
import React from "react"
import { Layout } from 'antd'

class WebMakerSiderRight extends React.PureComponent {

    render() {

        const siderStyle = {
            borderLeft: '1px solid #dadada',
            overflowY: 'auto',
            background: '#fff'
        }

        return (
            <Layout.Sider width={224} style={siderStyle}>
                <div className="demo-title-box" style={{ height: 1000 }}>SiderRight</div>
            </Layout.Sider>
        )
    }
}

export default WebMakerSiderRight