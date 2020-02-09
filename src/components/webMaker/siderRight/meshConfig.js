
import React from "react"
import classNames from "classnames"

import { Row, Col } from 'antd'

import WebMakerContext from "../context"
import styles from "./siderRight.module.css"

class MeshConfig extends React.PureComponent {

    static contextType = WebMakerContext

    renderBox(text) {
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
            <div style={tmpStyle}>{text}</div>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.title}>组件配置</div>
                <div className={styles.scroller}>
                    <div className={styles.group}>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={8}>
                                <span>配置1</span>
                            </Col>
                            <Col span={16}>
                                <span>左对齐</span>
                            </Col>
                        </Row>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={8}>
                                <span>配置2</span>
                            </Col>
                            <Col span={16}>
                                <span>自适应</span>
                            </Col>
                        </Row>
                    </div>
                    <div className={classNames(styles.group, styles.hasBorder)}>
                        {this.renderBox("占位 Mesh1")}
                    </div>
                    <div className={classNames(styles.group, styles.hasBorder)}>
                        {this.renderBox("占位 Mesh2")}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default MeshConfig
