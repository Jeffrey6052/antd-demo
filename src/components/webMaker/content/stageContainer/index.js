
import React from "react"

import WebMakerContext from "../../context"
import Stage from "../stage"

import { isCtrlDown, getShortCut, matchShortCut } from "../../../../utils/KeyboardWatch"

class StageContainer extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        this.state = {
            scale: 0.8,
            translateX: 0,
            translateY: 0,
            containerWidth: 0,
            containerHeight: 0,
            containerReady: false
        }

        this.containerStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            touchAction: "none"
        }

        this.containerRef = React.createRef()

        this.handleWheel = this.handleWheel.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
        this.handleResize = this.handleResize.bind(this)
        this.handleDrop = this.handleDrop.bind(this)
    }

    componentDidMount() {
        this.containerRef.current.addEventListener('mousewheel', this.handleWheel, { passive: false })

        window.addEventListener('resize', this.handleResize)
        window.addEventListener('keydown', this.handleKeydown)

        // initialize依赖container的元素宽高, 需要先让页面完成渲染再执行
        window.setTimeout(() => {
            this.initialize()
        }, 0)
    }

    componentWillUnmount() {
        this.containerRef.current.removeEventListener('mousewheel', this.handleWheel)

        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('keydown', this.handleKeydown)
    }

    initialize() {
        const { width, height } = this.context
        this.setState((prevState) => ({
            translateX: (width - 1) * prevState.scale * -1,
            translateY: (height - 1) * prevState.scale * -1
        }))

        this.updateContainerSize()
    }

    handleKeydown() {
        const shortCut = getShortCut()
        // console.log("shortCut", shortCut)

        const press_Ctrl_C = matchShortCut("command+c", shortCut)
        // console.log("press_Ctrl_C", press_Ctrl_C)
    }

    handleResize() {
        this.updateContainerSize()
    }

    handleWheel(event) {

        event.stopPropagation()
        event.preventDefault()

        // console.log("event", event)

        const deltaX = event.deltaX
        const deltaY = event.deltaY

        const ctrlDown = isCtrlDown()
        const componentElement = this.containerRef.current

        if (ctrlDown && deltaY != 0 && componentElement) { // 缩放Stage
            const step = 0.05
            const modScale = deltaY > 0 ? step : step * -1
            this.setState((prevState) => {

                let newScale = prevState.scale + modScale

                if (newScale < 0.3 || newScale > 2) {
                    return null
                }

                const componentRect = componentElement.getBoundingClientRect()

                const offsetX = Math.round((event.clientX - componentRect.x - prevState.translateX) / prevState.scale)
                const offsetY = Math.round((event.clientY - componentRect.y - prevState.translateY) / prevState.scale)

                const newTranslateX = prevState.translateX - offsetX * modScale
                const newTranslateY = prevState.translateY - offsetY * modScale

                return {
                    scale: newScale,
                    translateX: newTranslateX,
                    translateY: newTranslateY
                }
            })
        } else { // 移动Stage
            if (deltaX != 0) {
                this.setState((prevState) => ({
                    translateX: prevState.translateX - deltaX
                }))
            }

            if (deltaY != 0) {
                this.setState((prevState) => ({
                    translateY: prevState.translateY - deltaY
                }))
            }
        }
    }

    updateContainerSize() {
        // 页面结构加载完成后，重新获取元素宽度和高度
        const containerElement = this.containerRef.current

        this.setState({
            containerWidth: containerElement.clientWidth,
            containerHeight: containerElement.clientHeight,
            containerReady: true
        })
    }

    handleDrop(componentKey, x, y) {

        const { scale } = this.state

        // 通过scale修正坐标
        const posX = x / scale
        const posY = y / scale

        const { addMesh } = this.context

        addMesh(componentKey, posX, posY)
    }

    renderContent() {

        const { containerReady, translateX, translateY, scale } = this.state

        if (!containerReady) {
            return null
        }

        const { width, height } = this.context

        const scaleLayerStyle = {
            position: "absolute",
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            transformOrigin: "left top",
            willChange: "transform"
        }

        const fullLayerStyle = {
            width: width * 3,
            height: height * 3,
            overflow: "hidden",
            backgroundColor: "rgb(242, 242, 242)"
        }

        const wrapperStyle = {
            marginLeft: width,
            marginTop: height,
            width: width,
            height: height
        }

        return (
            <div style={scaleLayerStyle}>
                <div style={fullLayerStyle}>
                    <div style={wrapperStyle}>
                        <Stage handleDrop={this.handleDrop} />
                    </div>
                </div>
            </div>
        )
    }

    render() {

        console.log("render: stageContainer")

        const content = this.renderContent()

        return (
            <div style={this.containerStyle} ref={this.containerRef}>
                {content}
            </div>
        )
    }
}

export default StageContainer