
import React from "react"
import classNames from "classnames"

import { Layout, Row, Col } from 'antd'

import ColorPicker from "../common/colorPicker"

import WebMakerContext from "../context"
import styles from "./sider.module.css"

class WebMakerSiderRight extends React.PureComponent {

    static contextType = WebMakerContext

    renderGroupContent() {
        return (
            <div>todo renderGroupContent</div>
        )
    }

    renderMeshContent() {
        return (
            <div>todo renderMeshContent</div>
        )
    }

    renderStageContent() {

        const { backgroundColor, setBackgroundColor } = this.context

        const tmpStyle = {
            width: "100%",
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#12c2e9",
            background: "linear-gradient(to top, #12c2e9, #c471ed, #f64f59)"
        }

        return (
            <React.Fragment>
                <div className={styles.title}>页面配置</div>
                <div className={styles.scroller}>
                    <div className={styles.group}>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={8}>
                                <span>背景颜色</span>
                            </Col>
                            <Col span={16}>
                                <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                            </Col>
                        </Row>
                    </div>
                    <div className={classNames(styles.group, styles.hasBorder)}>
                        <div style={tmpStyle}>占位1</div>
                    </div>
                    <div className={classNames(styles.group, styles.hasBorder)}>
                        <div style={tmpStyle}>占位2</div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    render() {

        const { selectedMeshes } = this.context

        const siderStyle = {
            borderLeft: '1px solid #dadada',
            overflowY: 'auto',
            background: '#fff'
        }

        const meshCount = selectedMeshes.size

        let siderContent = null
        if (meshCount === 0) {
            siderContent = this.renderStageContent()
        } else if (meshCount === 1) {
            siderContent = this.renderMeshContent()
        } else {
            siderContent = this.renderGroupContent()
        }

        return (
            <Layout.Sider width={296} style={siderStyle}>
                {siderContent}
            </Layout.Sider>
        )
    }
}

export default WebMakerSiderRight