import React from 'react';

import Layout from '../../components/Layout'

import CircuitDiagram from './CircuitDragram'

export default class CircuitDiagramPage extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            _v: 0,
            startTime: new Date().getTime(),
            clock: 0,
            dragram: this.initDragram(),
            width: 900,
            height: 600,
            borderWidth: 4
        }

        this.nextFrameId = null
    }

    componentDidMount() {
        // this.animate()
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.nextFrameId)
    }

    initDragram() {

        // 电路图 元件定义
        const symbols = this.initDragramSymbols()

        // 电路图 成员数据
        const elements = this.initDragramElements()

        // 电路图 连线数据
        const links = this.initDragramLinks()

        return {
            symbols,
            elements,
            links
        }
    }

    initDragramSymbols() {
        return [
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
    }

    initDragramElements() {
        return [
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
            },
            {
                identifier: "隔离开关3",
                type: "symbol",
                typeId: "Dis_H_L_Open",
                position: {
                    x: 200,
                    y: 0
                }
            },
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
            },
            {
                identifier: "测试拖动元素",
                type: "point",
                typeId: "",
                position: {
                    x: 130,
                    y: 110
                },
                style: {
                    visible: true,
                    opacity: 0.5,
                    shape: "circle",
                    width: 15,
                    color: "#007bff"
                }
            }
        ]
    }

    initDragramLinks() {
        return [
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
    }

    animate() {
        this.nextFrameId = window.requestAnimationFrame(() => this.animate())
        this.playFrame()
    }

    getClock() {
        const now = new Date().getTime()
        return now - this.state.startTime
    }

    createElementWithNewPosition(element, newPosition) {
        return {
            ...element,
            position: newPosition
        }
    }

    refresh() {
        this.setState((prevState) => ({
            _v: prevState._v + 1
        }))
    }

    playFrame() {

        const { dragram } = this.state

        const clock = this.getClock()

        const newElements = dragram.elements.map((element) => {
            switch (element.identifier) {
                case "隔离开关1":
                    return this.createElementWithNewPosition(element, {
                        x: 300 + 10 * Math.sin(clock / 2000),
                        y: 100 + 6 * Math.sin(clock / 500)
                    })
                case "隔离开关2":
                    return this.createElementWithNewPosition(element, {
                        x: 100 + 6 * Math.sin(clock / 2000),
                        y: 200 + 10 * Math.sin(clock / 500)
                    })
                default:
                    return element
            }
        })

        this.setState((prevState) => ({
            clock: clock,
            dragram: {
                ...prevState.dragram,
                elements: newElements
            }
        }))
    }

    render() {

        const { clock, dragram, width, height, borderWidth } = this.state

        return (
            <Layout>
                <h3>电路图渲染测试</h3>

                <p>Clock: {clock}</p>

                <CircuitDiagram
                    dragram={dragram}
                    width={width}
                    height={height}
                    borderWidth={borderWidth}
                    refresh={this.refresh.bind(this)}
                />
            </Layout>
        )
    }
}

