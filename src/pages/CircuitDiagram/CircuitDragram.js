import React from 'react';

import electricalSymbols from '../../assets/svg/electrical_symbols.svg';
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO } from 'react-svg-pan-zoom';

import lodash from "lodash"

import { isCtrlDown, isShiftDown, isAltDown } from "../../utils/KeyboardWatch"

// const inspect = require("object-inspect")

export default class CircuitDiagram extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            zoomTool: TOOL_NONE, // TOOL_AUTO
            zoomValue: INITIAL_VALUE,
            mouse: this.buildDefaultMouse(),
            viewerMouse: this.buildDefaultMouse(),
            shadowElement: null, //鼠标拖动元素时，该元素的半透明克隆对象
            ctrlDown: isCtrlDown(),
            shiftDown: isShiftDown(),
            altDown: isAltDown()
        }

        this.elementsMap = this.generateElementsMap()
        this.symbolsMap = this.generateSymbolsMap()
    }

    buildDefaultMouse() {
        return {
            down: false,
            moved: false,
            downPosition: null,
            movedPosition: null
        }
    }

    componentDidMount() {
        this.refViewer.fitToViewer()
        window.addEventListener("keydown", this.loadKeyboard.bind(this))
        window.addEventListener("keyup", this.loadKeyboard.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.loadKeyboard.bind(this))
        window.removeEventListener("keyup", this.loadKeyboard.bind(this))
    }

    loadKeyboard(e) {

        const { ctrlDown, shiftDown, altDown } = this.state

        const newCtrlDown = isCtrlDown()
        const newShiftDown = isShiftDown()
        const newAltDown = isAltDown()

        if (ctrlDown != newCtrlDown) {
            this.setState({ "ctrlDown": newCtrlDown })
        }

        if (shiftDown != newShiftDown) {
            this.setState({ "shiftDown": newShiftDown })
        }

        if (altDown != newAltDown) {
            this.setState({ "altDown": newAltDown })
        }
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
                        style={{ fill: color, cursor: "move" }}
                        dragram-element-type="point"
                        dragram-element-id={element.identifier}
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
                        style={{ fill: color, cursor: "move" }}
                        dragram-element-type="point"
                        dragram-element-id={element.identifier}
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
                dragram-element-type="symbol"
                dragram-element-id={element.identifier}
                style={{ cursor: "move" }}
            />
        )
    }

    renderConnectingLine(element, symbolsMap, elementsMap) {
        const { identifier, from, to, style } = element

        const fromPosition = from && this.calculateElementPointPosition(from.identifier, from.point, elementsMap, symbolsMap)

        const toPosition = to && this.calculateElementPointPosition(to.identifier, to.point, elementsMap, symbolsMap)

        // if (!fromPosition || !toPosition) {
        //     return null
        // }

        const stroke = style.color || "rgba(0, 0, 0, 1)"

        let points = []

        fromPosition && points.push(fromPosition)

        element.points.forEach((point) => points.push(point))

        toPosition && points.push(toPosition)

        const attrPoints = points.map((position) => {
            return `${position.x},${position.y}`
        }).join(" ")

        return (
            < polyline
                key={identifier}
                points={attrPoints}
                strokeWidth="1"
                stroke={stroke}
                strokeOpacity="1"
                strokeLinecap='square'
                style={{ fill: "none", cursor: "move" }}
                dragram-element-type="connectingLine"
                dragram-element-id={identifier}
            />
        )
    }

    renderDragramElements(symbolsMap, elementsMap) {

        const { elements } = this.props.dragram

        const rendElements = elements.map((element) => {
            // console.log("renderDragramElement", element)
            return this.renderDragramElement(element, symbolsMap, elementsMap)
        })

        return (
            <React.Fragment>
                {rendElements}
            </React.Fragment>
        )
    }

    renderDragramElement(element, symbolsMap, elementsMap) {
        if (!element) {
            return null
        }

        const { type } = element
        switch (type) {
            case "symbol":
                const symbol = symbolsMap[element.typeId]
                if (!symbol) {
                    return null
                }
                return this.renderSymbolElement(element, symbol)
            case "connectingLine":
                return this.renderConnectingLine(element, symbolsMap, elementsMap)
            case "point":
                return this.renderPoint(element)
            default:
                return null
        }
    }

    // 拖动元素时，跟随鼠标显示该元素的镜像
    renderShadowElement(symbolsMap, elementsMap) {

        const { shadowElement, viewerMouse } = this.state

        if (!shadowElement) {
            return null
        }

        if (!viewerMouse.down || !viewerMouse.moved) {
            return null
        }

        return this.renderDragramElement(shadowElement, symbolsMap, elementsMap)
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

        const isClick = mouse.down && !mouse.moved
        const isAreaSelect = mouse.down && mouse.moved && mouse.downPosition && mouse.movedPosition

        if (isClick) {
            // console.log("TODO 单击事件")
        } else if (isAreaSelect) {
            console.log("TODO 选中范围内的元素", mouse.downPosition, mouse.movedPosition)
        }

        this.setState({ mouse: this.buildDefaultMouse() })
    }


    handleViewerMouseDown(viewerEvent) {

        const event = viewerEvent.originalEvent

        const target = event.target

        const elementId = target.getAttribute("dragram-element-id")
        let shadowElement = null
        if (elementId) {
            event.stopPropagation()

            const element = this.getDragramElementById(elementId)

            if (element) {
                shadowElement = lodash.cloneDeep(element)
            }
        }

        const x = viewerEvent.x
        const y = viewerEvent.y

        this.setState((prevState) => ({
            viewerMouse: {
                ...prevState.viewerMouse,
                down: true,
                downPosition: { x: x, y: y },
                moved: false,
                movedPosition: null,
                target: target
            },
            shadowElement: shadowElement
        }))
    }

    handleViewerMouseMove(viewerEvent) {

        const { viewerMouse } = this.state

        if (!viewerMouse.down) {
            return
        }

        const movedPosition = { x: viewerEvent.x, y: viewerEvent.y }

        this.dragShadowElement(viewerMouse.target, viewerMouse.downPosition, movedPosition, viewerEvent.scaleFactor)

        this.setState((prevState) => ({
            viewerMouse: {
                ...prevState.viewerMouse,
                moved: true,
                movedPosition: movedPosition
            }
        }))
    }

    dragShadowElement(target, downPosition, movedPosition, scaleFactor) {

        if (!target) {
            return
        }

        const { shadowElement } = this.state
        if (!shadowElement) {
            return
        }

        const elementId = target.getAttribute("dragram-element-id")
        if (!elementId) {
            return
        }

        // TODO 每次都去查找，是否可以缓存
        const element = this.getDragramElementById(elementId)
        if (!element) {
            return
        }

        const { elementsMap, symbolsMap } = this
        
        const offset = this.calculateOffset(downPosition, movedPosition, scaleFactor)

        if (element.type === "connectingLine") {

            const { from, to } = element
            const fromPosition = from && this.calculateElementPointPosition(from.identifier, from.point, elementsMap, symbolsMap)
            const toPosition = to && this.calculateElementPointPosition(to.identifier, to.point, elementsMap, symbolsMap)

            let points = []

            fromPosition && points.push(fromPosition)
            element.points.forEach((point) => points.push(point))
            toPosition && points.push(toPosition)

            shadowElement.from = null
            shadowElement.to = null
            shadowElement.points = points.map((p) => ({
                x: p.x + offset.x,
                y: p.y + offset.y
            }))

            // console.log("todo 拖动连接线shadow", shadowElement)
        } else {
            const finalPosition = this.calculateFinalPosition(element.position, offset)
            shadowElement.position = finalPosition
        }

        this.props.refresh()
    }

    handleViewerMouseUp(viewerEvent) {

        const { viewerMouse } = this.state
        if (!viewerMouse.down) {
            return
        }

        const target = viewerMouse.target

        const isClick = viewerMouse.down && !viewerMouse.moved
        const isDrag = viewerMouse.down && viewerMouse.moved && viewerMouse.downPosition && viewerMouse.movedPosition

        if (isClick) {
            console.log("TODO 单击事件", target)
        } else if (isDrag) {
            // console.log("TODO 选中范围内的元素", viewerMouse.downPosition, viewerMouse.movedPosition)
        }

        const finalPosition = {
            x: viewerEvent.x,
            y: viewerEvent.y
        }

        if (isDrag) {
            this.dragElement(target, viewerMouse.downPosition, finalPosition, viewerEvent.scaleFactor)
        }

        this.setState({
            viewerMouse: this.buildDefaultMouse(),
            shadowElement: null
        })

        this.props.refresh()
    }

    dragElement(target, downPosition, movedPosition, scaleFactor) {
        if (!target) {
            return
        }

        const elementId = target.getAttribute("dragram-element-id")
        if (!elementId) {
            return
        }

        const element = this.getDragramElementById(elementId)
        if (!element) {
            return
        }

        const { elementsMap, symbolsMap } = this

        const offset = this.calculateOffset(downPosition, movedPosition, scaleFactor)

        if (element.type === "connectingLine") {

            console.log("todo 拖动连接线", element)

            const { from, to } = element
            const fromPosition = from && this.calculateElementPointPosition(from.identifier, from.point, elementsMap, symbolsMap)
            const toPosition = to && this.calculateElementPointPosition(to.identifier, to.point, elementsMap, symbolsMap)

            let points = []

            fromPosition && points.push(fromPosition)
            element.points.forEach((point) => points.push(point))
            toPosition && points.push(toPosition)

            element.from = null
            element.to = null
            element.points = points.map((p) => ({
                x: p.x + offset.x,
                y: p.y + offset.y
            }))

        } else {
            const finalPosition = this.calculateFinalPosition(element.position, offset)
            element.position = finalPosition
        }
    }

    // 计算位移的坐标
    calculateOffset(mouseDownPosition, mouseMovedPosition, scaleFactor) {
        const offsetX = (mouseMovedPosition.x - mouseDownPosition.x) / scaleFactor
        const offsetY = (mouseMovedPosition.y - mouseDownPosition.y) / scaleFactor

        return { x: offsetX, y: offsetY }
    }

    // 计算最终的落点坐标
    calculateFinalPosition(originPosition, offset) {

        const finalPosition = {
            x: originPosition.x + offset.x,
            y: originPosition.y + offset.y,
        }

        return finalPosition
    }

    getDragramElementById(elementId) {
        if (!elementId) {
            return null
        }

        const { elementsMap } = this

        // const { elements } = this.props.dragram
        // return elements.find((element) => element.identifier === elementId) || null

        return elementsMap[elementId] || null
    }

    calculateElementPointPosition(elementId, point, elementsMap, symbolsMap) {
        if (!elementId) {
            return null
        }

        const element = elementsMap[elementId]
        if (!element) {
            return null
        }
        return this.calculateLinkPosition(element, point, symbolsMap)
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

    getPropWidth() {
        return this.props.width || 1440
    }

    getPropHeight() {
        return this.props.height || 900
    }

    getPropBorderWidth() {
        return this.props.borderWidth || 4
    }

    render() {

        const { elementsMap, symbolsMap } = this

        const wrapWidth = this.getPropWidth()
        const wrapHeight = this.getPropHeight()
        const wrapBorderWidth = this.getPropBorderWidth()

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

        const miniatureProps = {
            position: "right" // one of none, right, left
        }

        const toolbarProps = {
            position: "top" // one of none, top, right, bottom, left
        }

        const viewerWidth = wrapWidth - wrapBorderWidth * 2
        const viewerHeight = wrapHeight - wrapBorderWidth * 2

        const { zoomTool, ctrlDown } = this.state
        let currentTool = zoomTool
        if (currentTool === TOOL_NONE && ctrlDown) {
            currentTool = TOOL_AUTO
        }

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
            tool: currentTool,
            onChangeTool: (tool) => this.setZoomTool(tool),
            miniatureProps: miniatureProps,
            toolbarProps: toolbarProps,
        }

        if (currentTool === TOOL_NONE) {
            wrapProps.onMouseDown = (e) => this.handleMouseDown(e)
            wrapProps.onMouseMove = (e) => this.handleMouseMove(e)
            wrapProps.onMouseUp = (e) => this.handleMouseUp(e)
            viewerProps.onMouseDown = (e) => this.handleViewerMouseDown(e)
            viewerProps.onMouseMove = (e) => this.handleViewerMouseMove(e)
            viewerProps.onMouseUp = (e) => this.handleViewerMouseUp(e)
        }

        return (
            <div {...wrapProps}>
                <ReactSVGPanZoom {...viewerProps}>
                    <svg
                        viewBox={`0 0 ${viewerWidth} ${viewerHeight}`}
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        preserveAspectRatio="none"
                    >
                        {this.renderDragramElements(symbolsMap, elementsMap)}

                        {this.renderShadowElement(symbolsMap, elementsMap)}
                    </svg>
                </ReactSVGPanZoom>
                {this.renderMouseArea()}
            </div>
        )
    }
}