import React from 'react';

import { Button } from 'antd'

import Layout from '../../components/Layout'

import exampleIcons from '../../assets/svg/example_icons.svg'
import electricalSymbols from '../../assets/svg/electrical_symbols.svg'

const CircuitDiagramPage = () => {

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
                visible: true,
                shape: "circle",
                width: "4",
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
                shape: "circle",
                width: "2",
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
                shape: "circle",
                width: "3",
                color: "rgba(255, 255, 0, 1)"
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
                shape: "circle",
                width: "2",
                color: "rgba(255, 0, 255, 1)"
            }
        },
        {
            identifier: "隔离开关1",
            type: "symbol",
            typeId: "Dis_V_D_Open",
            position: {
                x: 300,
                y: 100
            }
        },
        {
            identifier: "隔离开关2",
            type: "symbol",
            typeId: "Dis_H_L_Open",
            position: {
                x: 100,
                y: 200
            }
        }
    ]

    // 电路图 连线数据
    const dragramLinks = [
        {
            from: {
                identifier: "点1"
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
            <CircuitDiagram
                dragramElements={dragramElements}
                dragramLinks={dragramLinks}
                dragramSymbols={dragramSymbols}
            />
        </Layout>
    )
}

export class CircuitDiagram extends React.Component {

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

                console.log(element, symbolPoint)

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
        const { position } = element

        console.log("renderPoint", element)

        return (
            <rect width="1" height="1" x={position.x - 0.5} y={position.y - 0.5}
                style={{ fill: "rgba(255,0,0,1)" }} />
        )
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

        const links = dragramLinks.map(({ from, to, style }) => {

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

        return (
            <div>
                <h3>电路图渲染测试</h3>

                <svg
                    style={{ width: 600, height: 400, border: "1px solid #ccc" }}
                    viewBox="-20 -20 320 260"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                // preserveAspectRatio="none"
                >
                    {this.renderDragramLinks({ elementsMap, symbolsMap })}
                    {this.renderDragramElements({ symbolsMap })}
                </svg>

            </div>
        )
    }
}

export default CircuitDiagramPage

