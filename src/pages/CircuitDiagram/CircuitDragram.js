import React from 'react';

import electricalSymbols from '../../assets/svg/electrical_symbols.svg';
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from 'react-svg-pan-zoom';

import SampleDragramItem from './SampleDragramItem';

// const inspect = require("object-inspect")

// 鼠标初始状态
const INITIAL_MOUSE = {
    down: false,
    moved: false,
    downPosition: null,
    upPosition: null
}

export default class CircuitDiagram extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            zoomTool: TOOL_NONE,
            zoomValue: INITIAL_VALUE,
            mouse: INITIAL_MOUSE
        }
    }

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
        const { elements } = this.props.dragram

        const map = {}

        elements.forEach((element) => {
            map[element.identifier] = element
        })

        return map
    }

    generateSymbolsMap() {
        const { symbols } = this.props.dragram

        const map = {}

        symbols.forEach((symbol) => {
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

        const { elements } = this.props.dragram

        const rendElements = elements.map((element) => {
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
                {rendElements}
            </React.Fragment>
        )
    }


    /**鼠标按下 */
    handleMouseDown(e) {

        const x = e.clientX
        const y = e.clientY

        this.setState((prevState) => ({
            mouse: {
                ...prevState.mouse,
                down: true,
                downPosition: { x: x, y: y },
                moved: false,
                movedPosition: null
            }
        }))
    }

    /**鼠标移动 */
    handleMouseMove(e) {

        const { mouse } = this.state

        if (!mouse.down) {
            return
        }

        const x = e.clientX
        const y = e.clientY

        this.setState((prevState) => ({
            mouse: {
                ...prevState.mouse,
                moved: true,
                movedPosition: { x: x, y: y }
            }
        }))
    }

    /**鼠标松开 */
    handleMouseUp(e) {

        const { mouse } = this.state

        if (!mouse.down) {
            return
        }

        const isClick = mouse.down && !mouse.moved

        if (isClick) {
            console.log("TODO 选中单击元素")
        } else if (mouse.downPosition && mouse.movedPosition) {
            console.log("TODO 选中范围内的元素", mouse.downPosition, mouse.movedPosition)
        }

        this.setState({ mouse: INITIAL_MOUSE })
    }


    handleViewerMouseDown(e) {
        console.log("handleViewerMouseDown", e)
    }

    handleViewerMouseMove(e) {
        // console.log("handleViewerMouseMove", e)
    }

    handleViewerMouseUp(e) {
        // console.log("handleViewerMouseUp", e)
    }

    renderDragramLinks({ elementsMap, symbolsMap }) {

        const { links } = this.props.dragram

        const rendLinks = links.map(({ from, to, style }, index) => {

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
                {rendLinks}
            </React.Fragment>
        )
    }

    setZoomValue(value) {
        this.setState({ zoomValue: value })
    }

    setZoomTool(tool) {
        this.setState({ zoomTool: tool })
    }

    renderMouseArea() {
        const { mouse } = this.state

        if (!mouse.down || !mouse.moved) {
            return null
        }

        const { downPosition, movedPosition } = mouse

        const width = Math.abs(movedPosition.x - downPosition.x) || 1
        const height = Math.abs(movedPosition.y - downPosition.y) || 1

        const left = Math.min(movedPosition.x, downPosition.x)
        const top = Math.min(movedPosition.y, downPosition.y)

        const areaStyle = {
            position: "fixed",
            backgroundColor: 'rgba(0,0,0,0.05)',
            left: left,
            top: top,
            width: width,
            height: height
        }

        return (
            <div style={areaStyle} />
        )
    }

    render() {

        const elementsMap = this.generateElementsMap()
        const symbolsMap = this.generateSymbolsMap()

        const wrapWidth = 1440
        const wrapHeight = 900
        const wrapBorderWidth = 4

        const wrapStyle = {
            borderWidth: wrapBorderWidth,
            borderStyle: "solid",
            borderColor: "#000",
            width: wrapWidth,
            height: wrapHeight
        }

        const wrapProps = {
            style: wrapStyle
        }

        if (this.state.zoomTool === "none") {
            wrapProps.onMouseDown = (e) => this.handleMouseDown(e)
            wrapProps.onMouseMove = (e) => this.handleMouseMove(e)
            wrapProps.onMouseUp = (e) => this.handleMouseUp(e)
        }

        const miniatureProps = {
            position: "right" // one of none, right, left
        }

        const toolbarProps = {
            position: "top" // one of none, top, right, bottom, left
        }

        const viewerWidth = wrapWidth - wrapBorderWidth * 2
        const viewerHeight = wrapHeight - wrapBorderWidth * 2

        const viewerProps = {
            width: viewerWidth,
            height: viewerHeight,
            ref: (x) => this.refViewer = x,
            scaleFactorMax: 100,
            scaleFactorMin: 0.2,
            value: this.state.zoomValue,
            onChangeValue: (value) => this.setZoomValue(value),
            detectAutoPan: false,
            disableDoubleClickZoomWithToolAuto: true,
            tool: this.state.zoomTool,
            onChangeTool: (tool) => this.setZoomTool(tool),
            miniatureProps: miniatureProps,
            toolbarProps: toolbarProps,
        }

        if (this.state.zoomTool === "none") {
            viewerProps.onMouseDown = (e) => this.handleViewerMouseDown(e)
            viewerProps.onMouseMove = (e) => this.handleViewerMouseMove(e)
            viewerProps.onMouseUp = (e) => this.handleViewerMouseUp(e)
        }

        const viewBoxPadding = 50

        return (
            <div {...wrapProps}>
                <ReactSVGPanZoom {...viewerProps}>
                    <svg
                        viewBox={`0 0 ${viewerWidth} ${viewerHeight}`}
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        preserveAspectRatio="none"
                    >
                        <svg
                            viewBox={`${viewBoxPadding * -1} ${viewBoxPadding * -1} ${viewerWidth + viewBoxPadding} ${viewerHeight + viewBoxPadding}`}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                        >
                            {this.renderDragramLinks({ elementsMap, symbolsMap })}
                            {this.renderDragramElements({ symbolsMap })}
                            <SampleDragramItem />

                            <rect x="130" y="110" width="30" height="20" fill="#007bff" />
                        </svg>
                    </svg>
                </ReactSVGPanZoom>
                {this.renderMouseArea()}
            </div>
        )
    }
}