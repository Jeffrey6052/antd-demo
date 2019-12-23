import React from 'react';

import { Button } from 'antd'

import Layout from '../../components/Layout'

import curveLineIcons from '../../assets/svg/jowo0115_icons/curve_line.svg'
import switchIcons from '../../assets/svg/jowo0115_icons/switch.svg'

import exampleIcons from '../../assets/svg/example_icons.svg'
import electricalSymbols from '../../assets/svg/electrical_symbols.svg'

const ElectricalSymbolPage = () => {

    return (
        <Layout>
            <ElectricalSymbol />
        </Layout>
    )
}

class ElectricalSymbol extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dis1Open: true
        }
    }

    render_button() {
        if (this.state.dis1Open) {
            return <Button type="primary" onClick={() => this.setState({ dis1Open: false })}>闭合</Button>
        } else {
            return <Button type="primary" onClick={() => this.setState({ dis1Open: true })}>开启</Button>
        }
    }

    render_dis1() {
        const x = 0
        const y = 50
        const width = 81
        const height = 81
        const stroke = "black"
        const strokeOpacity = "1"
        const symbolName = this.state.dis1Open ? "Dis_V_D_Open" : "Dis_V_D_Close"

        return (
            <use
                xlinkHref={`${electricalSymbols}#${symbolName}`}
                width={width}
                height={height}
                x={x}
                y={y}
                stroke={stroke}
                strokeOpacity={strokeOpacity}
            />
        )
    }

    render() {
        return (
            <div>
                <h1>电路图元件</h1>

                <h3>弯线</h3>

                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            preserveAspectRatio="none"
                        >
                            <use
                                xlinkHref={`${curveLineIcons}#CurveLine-L`}
                                stroke="black"
                                strokeWidth={81 / 81}
                            />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            strokeWidth={81 / 81}
                        >
                            <use xlinkHref={`${curveLineIcons}#CurveLine-R`} stroke="black" />
                        </svg>
                    </div>
                </div>

                <hr />

                <h3>抽屉式断路器</h3>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switchIcons}#Switch_V_D_Open`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switchIcons}#Switch_V_D_Close`} stroke="black" />
                        </svg>
                    </div>
                </div>

                <hr />

                <h3>测试</h3>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${exampleIcons}#YWinding`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${electricalSymbols}#Dis_V_D_Open`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${exampleIcons}#FuseBreaker_V_D_Open`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 81, height: 81 }}
                            viewBox="0 0 81 81"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${exampleIcons}#DrawoutDis_V_Close`} stroke="black" />
                        </svg>
                    </div>
        
                </div>

                <hr />

                <div style={{ margin: 20 }}>
                    {this.render_button()}
                </div>

                <div style={{ margin: 20 }}>
                    <svg
                        style={{ width: 600, height: 400, border: "1px solid #eee" }}
                        viewBox="0 0 500 400"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >

                        {this.render_dis1()}

                        <line x1="40" y1="10" x2="40" y2="60" strokeWidth="1" stroke="black" strokeOpacity="0.8" />
                        <line x1="40" y1="120" x2="40" y2="300" strokeWidth="1" stroke="black" strokeOpacity="0.8" />
                        <line x1="40" y1="10" x2="400" y2="10" strokeWidth="1" stroke="black" strokeOpacity="0.8" />
                        <line x1="40" y1="300" x2="400" y2="300" strokeWidth="1" stroke="black" strokeOpacity="0.8" />
                        <line x1="400" y1="10" x2="400" y2="300" strokeWidth="1" stroke="black" strokeOpacity="0.8" />
                    </svg>
                </div>
            </div >
        )
    }
}

export default ElectricalSymbolPage

