import React from 'react';

import { Button, Divider } from 'antd'

import Layout from '../../components/Layout'

import exampleIcons from '../../assets/svg/example_icons.svg'
import electricalSymbols from '../../assets/svg/electrical_symbols.svg'

import { UncontrolledReactSVGPanZoom } from 'react-svg-pan-zoom';

class CircuitDiagramPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            clock: 0
        }

        this.nextFrameId = null
    }

    componentDidMount() {
        this.animate()
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.nextFrameId)
    }

    animate() {
        this.nextFrameId = window.requestAnimationFrame(() => this.animate())
        this.setState({
            clock: this.getClock()
        })
    }

    getClock() {
        const now = new Date()
        return now.getSeconds() * 1000 + now.getMilliseconds()
    }

    render() {

        const { clock } = this.state

        // 电路图 成员数据
        const dragramElements = [
            {
                identifier: "点1",
                type: "point",
                typeId: "",
                position: {
                    x: 0,
                    y: 0
                },
                style: {
                    visible: false,
                    shape: "circle",
                    opacity: 0.5,
                    width: 4,
                    color: "rgba(255, 0, 0, 1)"
                }
            },
            {
                identifier: "点2",
                type: "point",
                typeId: "",
                position: {
                    x: 300,
                    y: 0
                },
                style: {
                    visible: true,
                    opacity: 0.5,
                    shape: "circle",
                    width: 2,
                    color: "rgba(255, 0, 0, 1)"
                }
            },
            {
                identifier: "点3",
                type: "point",
                typeId: "",
                position: {
                    x: 300,
                    y: 200
                },
                style: {
                    visible: true,
                    opacity: 0.5,
                    shape: "rect",
                    width: 10,
                    color: "rgba(200, 0, 50, 1)"
                }
            },
            {
                identifier: "点4",
                type: "point",
                typeId: "",
                position: {
                    x: 0,
                    y: 200
                },
                style: {
                    visible: true,
                    opacity: 0.5,
                    shape: "circle",
                    width: 2,
                    color: "rgba(255, 0, 255, 1)"
                }
            }
        ]

        const symbol1 = {
            identifier: "隔离开关1",
            type: "symbol",
            typeId: "Dis_V_D_Open",
            position: {
                x: 300 + 10 * Math.sin(clock / 1000),
                y: 100
            }
        }
        dragramElements.push(symbol1)

        const symbol2 = {
            identifier: "隔离开关2",
            type: "symbol",
            typeId: "Dis_H_L_Open",
            position: {
                x: 100,
                y: 200 + 10 * Math.sin(clock / 1000)
            }
        }
        dragramElements.push(symbol2)

        const symbol3 = {
            identifier: "隔离开关3",
            type: "symbol",
            typeId: "Dis_H_L_Open",
            position: {
                x: 200,
                y: 0
            }
        }
        dragramElements.push(symbol3)

        // 电路图 连线数据
        const dragramLinks = [
            {
                from: {
                    identifier: "点1"
                },
                to: {
                    identifier: "隔离开关3",
                    point: "left"
                },
                style: {
                    // color: "rgba(255, 0, 0, 1)"
                }
            },
            {
                from: {
                    identifier: "隔离开关3",
                    point: "right"
                },
                to: {
                    identifier: "点2"
                },
                style: {
                    // color: "rgba(255, 0, 0, 1)"
                }
            },
            {
                from: {
                    identifier: "点2"
                },
                to: {
                    identifier: "隔离开关1",
                    point: "up"
                },
                style: {
                    // color: "rgba(255, 255, 0, 1)"
                }
            },
            {
                from: {
                    identifier: "隔离开关1",
                    point: "down",
                },
                to: {
                    identifier: "点3"
                },
                style: {
                    // color: "rgba(255, 0, 255, 1)"
                }
            },
            {
                from: {
                    identifier: "点3"
                },
                to: {
                    identifier: "隔离开关2",
                    point: "right"
                },
                style: {
                    // color: "rgba(0, 255, 0, 1)"
                }
            },
            {
                from: {
                    identifier: "隔离开关2",
                    point: "left",
                },
                to: {
                    identifier: "点4"
                },
                style: {
                    // color: "rgba(255, 255, 0, 1)"
                }
            },
            {
                from: {
                    identifier: "点4"
                },
                to: {
                    identifier: "点1"
                },
                style: {
                    // color: "rgba(0, 255, 255, 1)"
                }
            }
        ]

        // 电路图 元件定义
        const dragramSymbols = [
            {
                identifier: "Dis_V_D_Open",
                desc: "隔离开关_竖直_刀下_分",
                width: 81,
                height: 81,
                points: {
                    center: { x: 40, y: 40 },
                    up: { x: 0, y: -30 },
                    down: { x: 0, y: 30 }
                }
            },
            {
                identifier: "Dis_H_L_Open",
                desc: "隔离开关_水平_刀左_分",
                width: 81,
                height: 81,
                points: {
                    center: { x: 40, y: 40 },
                    left: { x: -30, y: 0 },
                    right: { x: 30, y: 0 }
                }
            }
        ]

        return (
            <Layout>
                <h3>电路图渲染测试</h3>

                <p>Clock: {this.state.clock}</p>

                <CircuitDiagram
                    dragramElements={dragramElements}
                    dragramLinks={dragramLinks}
                    dragramSymbols={dragramSymbols}
                />
            </Layout>
        )
    }
}

export class CircuitDiagram extends React.Component {

    componentDidMount() {
        this.refViewer.fitToViewer()
    }

    calculateLinkPosition(element, point, symbolsMap) {
        switch (element.type) {
            case "point":
                return element.position
            case "symbol":
                const symbol = symbolsMap[element.typeId]
                if (!symbol) {
                    return null
                }
                const symbolPoint = symbol.points[point]
                if (!symbolPoint) {
                    return null
                }

                // console.log(element, symbolPoint)

                return {
                    x: element.position.x + symbolPoint.x,
                    y: element.position.y + symbolPoint.y
                }
            default:
                return null
        }
    }

    generateElementsMap() {

        const { dragramElements } = this.props

        const map = {}

        dragramElements.forEach((element) => {
            map[element.identifier] = element
        })

        return map
    }

    generateSymbolsMap() {
        const { dragramSymbols } = this.props

        const map = {}

        dragramSymbols.forEach((symbol) => {
            map[symbol.identifier] = symbol
        })

        return map
    }

    renderPoint(element) {
        const { position, style } = element

        const pStyle = style || {}

        // console.log("renderPoint", element)

        const width = style.width || 1
        const height = style.height || width

        let opacity = style.opacity || 1
        if (!style.visible) {
            opacity = 0
        }

        const color = style.color || "rgba(255,0,0,1)"
        const shape = style.shape || "circle"

        switch (shape) {
            case "circle":
                return (
                    <ellipse
                        key={element.identifier}
                        opacity={opacity}
                        cx={position.x}
                        cy={position.y}
                        rx={width / 2}
                        ry={height / 2}
                        style={{ fill: color }}
                    />
                )
            case "rect":
                return (
                    <rect
                        key={element.identifier}
                        opacity={opacity}
                        width={width}
                        height={height}
                        x={position.x - width / 2}
                        y={position.y - height / 2}
                        style={{ fill: color }}
                    />
                )
            default:
                return null
        }
    }

    renderSymbolElement(element, symbol) {

        const { position } = element
        const { center } = symbol.points

        const x = position.x - center.x
        const y = position.y - center.y
        const width = symbol.width
        const height = symbol.height
        const stroke = "black"
        const strokeOpacity = "1"

        return (
            <use
                key={element.identifier}
                xlinkHref={`${electricalSymbols}#${symbol.identifier}`}
                width={width}
                height={height}
                x={x}
                y={y}
                stroke={stroke}
                strokeOpacity={strokeOpacity}
            />
        )
    }

    renderDragramElements({ symbolsMap }) {

        const { dragramElements } = this.props

        const elements = dragramElements.map((element) => {
            const { type, position } = element
            switch (type) {
                case "point":
                    return this.renderPoint(element)
                case "symbol":
                    const symbol = symbolsMap[element.typeId]
                    if (!symbol) {
                        return null
                    }
                    return this.renderSymbolElement(element, symbol)
                default:
                    return null
            }
        })

        return (
            <React.Fragment>
                {elements}
            </React.Fragment>
        )
    }

    renderDragramLinks({ elementsMap, symbolsMap }) {

        const { dragramLinks } = this.props

        const links = dragramLinks.map(({ from, to, style }, index) => {

            const fromElement = elementsMap[from.identifier]
            const toElement = elementsMap[to.identifier]
            if (!fromElement || !toElement) {
                return null
            }

            const fromPosition = this.calculateLinkPosition(fromElement, from.point, symbolsMap)
            const toPosition = this.calculateLinkPosition(toElement, to.point, symbolsMap)
            if (!fromPosition || !toPosition) {
                return null
            }

            const stroke = style.color || "rgba(0, 0, 0, 1)"

            return (
                <line
                    key={index}
                    x1={fromPosition.x}
                    y1={fromPosition.y}
                    x2={toPosition.x}
                    y2={toPosition.y}
                    strokeWidth="1"
                    stroke={stroke}
                    strokeOpacity="1"
                    strokeLinecap='square'
                />
            )
        })

        // 
        return (
            <React.Fragment>
                {links}
            </React.Fragment>
        )
    }

    render() {

        const elementsMap = this.generateElementsMap()
        const symbolsMap = this.generateSymbolsMap()

        const viewerWidth = 900
        const viewerHeight = 600
        const viewerPadding = 50

        return (
            <div style={{ width: viewerWidth, height: viewerHeight, border: "1px solid #ccc" }}>
                <UncontrolledReactSVGPanZoom
                    width={viewerWidth} height={viewerHeight}
                    ref={x => this.refViewer = x}
                    scaleFactorMax={100}
                    scaleFactorMin={1}
                    onClick={event => console.log('click', event.x, event.y, event.originalEvent)}
                >
                    <svg
                        viewBox={`0 0 ${viewerWidth} ${viewerHeight}`}
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        preserveAspectRatio="none"
                        onWheel={(e) => console.log("wheel", e)}
                    >
                        <svg
                            viewBox={`${viewerPadding * -1} ${viewerPadding * -1} ${viewerWidth + viewerPadding} ${viewerHeight + viewerPadding}`}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            {this.renderDragramLinks({ elementsMap, symbolsMap })}
                            {this.renderDragramElements({ symbolsMap })}

                            <line
                                x1={10}
                                y1={230}
                                x2={110}
                                y2={230}
                                strokeWidth="10"
                                stroke={"rgba(0, 0, 0, 1)"}
                                strokeOpacity="1"
                                strokeLinecap='square'
                                onClick={() => console.log("click")}
                                onMouseEnter={() => console.log("mouseEnter")}
                                onMouseLeave={() => console.log("mouseLeave")}
                            />
                        </svg>
                    </svg>
                </UncontrolledReactSVGPanZoom>
            </div>
        )
    }
}

export default CircuitDiagramPage

