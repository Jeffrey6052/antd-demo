
import React from "react"
import classNames from "classnames"

import { Row, Col, Select, Checkbox } from 'antd'

import ColorPicker from "../common/colorPicker"
import WebMakerContext from "../context"
import styles from "./siderRight.module.css"

class StageConfig extends React.PureComponent {

    static contextType = WebMakerContext

    constructor(props) {
        super(props)

        this.onStageSizeSelectChange = this.onStageSizeSelectChange.bind(this)

        this.onIndexPageChange = this.onIndexPageChange.bind(this)
        this.onLayoutChange = this.onLayoutChange.bind(this)
    }

    renderBox(text) {
        const tmpStyle = {
            width: "100%",
            height: 200,
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

    onStageSizeSelectChange(newValue) {

        console.log("onStageSizeSelectChange", newValue)

        const [width, height] = newValue.split("x").map(n => parseInt(n, 10))

        // console.log("width", width, "height", height)

        const { setStageSize } = this.context

        setStageSize(width, height)
    }

    onIndexPageChange(newValue) {
        console.log("onIndexPageChange", newValue)
    }

    onLayoutChange(newValue) {
        console.log("onLayoutChange", newValue)
    }

    renderBackgroundColorPicker() {
        const { backgroundColor, setBackgroundColor } = this.context

        return (
            <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
        )
    }

    renderStageSizeSelect() {

        const items = [
            "1024x768",
            "1366x768",
            "1280x800",
            "1440x900",
            "1600x900",
            "1920x1080"
        ]

        const style = {
            width: "100%"
        }

        const { width, height } = this.context

        const value = `${width}x${height}`

        const { Option } = Select

        return (
            <Select value={value} style={style} onChange={this.onStageSizeSelectChange} >
                {items.map((item) => <Option value={item} key={item}>{item}</Option>)}
            </Select>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className={styles.title}>页面配置</div>
                <div className={styles.scroller}>
                    <div className={styles.group}>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={8}>
                                <span>页面分辨率</span>
                            </Col>
                            <Col span={16}>
                                {this.renderStageSizeSelect()}
                            </Col>
                        </Row>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={8}>
                                <span>背景颜色</span>
                            </Col>
                            <Col span={16}>
                                {this.renderBackgroundColorPicker()}
                            </Col>
                        </Row>
                    </div>


                    <div className={classNames(styles.group, styles.hasBorder)}>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={24}>
                                <Checkbox onChange={this.onIndexPageChange}>设为首页</Checkbox>
                            </Col>
                        </Row>
                        <Row justify="space-around" className={styles.row}>
                            <Col span={24}>
                                <Checkbox onChange={this.onLayoutChange}>隐藏布局</Checkbox>
                            </Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default StageConfig
