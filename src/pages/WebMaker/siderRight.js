
import React from "react"
import { Layout } from 'antd'

class WebMakerSiderRight extends React.PureComponent {

    render() {
        return (
            <Layout.Sider width={224} style={{ borderRight: '1px solid rgba(0,0,0,.1)', overflowY: 'auto', background: '#fff' }}>
                <div className="demo-title-box" style={{ height: 1000 }}>SiderRight</div>
            </Layout.Sider>
        )
    }
}

export default WebMakerSiderRight