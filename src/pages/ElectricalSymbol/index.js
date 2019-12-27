import React from 'react';

import { Button } from 'antd'

import Layout from '../../components/Layout'

import curveLineIcons from '../../assets/svg/jowo0115_icons/curve_line.svg'
import switch01Icons from '../../assets/svg/jowo0115_icons/switch01.svg'
import switch02Icons from '../../assets/svg/jowo0115_icons/switch02.svg'
import groundIcons from '../../assets/svg/jowo0115_icons/ground.svg'
import currentTransformerIcons from '../../assets/svg/jowo0115_icons/current_transformer.svg'
import capacitorBankIcons from '../../assets/svg/jowo0115_icons/capacitor_bank.svg'

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
        const width = 96
        const height = 96
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

    render_switch01() {
        return (
            <>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_V_D_Open`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_V_U_Open`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_H_L_Open`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_H_R_Open`} stroke="black" />
                        </svg>
                    </div>
                </div>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_V_D_Close`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_V_U_Close`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_H_L_Close`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch01Icons}#Switch01_H_R_Close`} stroke="black" />
                        </svg>
                    </div>
                </div>
            </>
        )
    }

    render_switch02() {
        return (
            <>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_V_D_Open`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_V_U_Open`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_H_L_Open`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_H_R_Open`} stroke="black" />
                        </svg>
                    </div>
                </div>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_V_D_Close`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_V_U_Close`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_H_L_Close`} stroke="black" />
                        </svg>
                    </div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${switch02Icons}#Switch02_H_R_Close`} stroke="black" />
                        </svg>
                    </div>
                </div>
            </>
        )
    }

    render_curve() {
        return (
            <div>
                <div style={{ margin: 20, display: "inline-block" }}>
                    <svg
                        style={{ width: 96, height: 96, background: "#eee" }}
                        viewBox="0 0 96 96"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                        <use
                            xlinkHref={`${curveLineIcons}#CurveLine-L`}
                            stroke="black"
                            strokeWidth={1}
                        />
                    </svg>
                </div>

                <div style={{ margin: 20, display: "inline-block" }}>
                    <svg
                        style={{ width: 96, height: 96, background: "#eee" }}
                        viewBox="0 0 96 96"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        strokeWidth={1}
                    >
                        <use xlinkHref={`${curveLineIcons}#CurveLine-R`} stroke="black" />
                    </svg>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h1>电路图元件</h1>

                <h3>弯线</h3>
                {this.render_curve()}
                <hr />

                <h3>隔断开关</h3>
                {this.render_switch01()}
                <hr />

                <h3>抽屉式断路器</h3>
                {this.render_switch02()}
                <hr />

                <h3>接地</h3>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${groundIcons}#Ground`} stroke="black" />
                        </svg>
                    </div>
                </div>

                <h3>电流互感器</h3>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${currentTransformerIcons}#CurrentTransformer`} stroke="black" />
                        </svg>
                    </div>
                </div>

                <h3>电容器组</h3>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${capacitorBankIcons}#CapacitorBank`} stroke="black" />
                        </svg>
                    </div>
                </div>

                <h3>测试</h3>
                <div>
                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${exampleIcons}#YWinding`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${electricalSymbols}#Dis_V_D_Open`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            <use xlinkHref={`${exampleIcons}#FuseBreaker_V_D_Open`} stroke="black" />
                        </svg>
                    </div>

                    <div style={{ margin: 20, display: "inline-block" }}>
                        <svg
                            style={{ width: 96, height: 96, background: "#eee" }}
                            viewBox="0 0 96 96"
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

