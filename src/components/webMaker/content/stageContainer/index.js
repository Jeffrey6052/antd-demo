
import React from "react"

import WebMakerContext from "../../context"
import Stage from "../stage"

import { isCtrlDown, DownKeys, getBasicShortCut, matchBasicShortCut, getShortCut, matchShortCut } from "../../../../utils/KeyboardWatch"

class StageContainer extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        this.state = {
            scale: 1,
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

        this.componentRef = React.createRef()

        this.handleWheel = this.handleWheel.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
        this.handleResize = this.handleResize.bind(this)
    }

    componentDidMount() {
        if (this.componentRef.current) {
            this.componentRef.current.addEventListener('wheel', this.handleWheel, { passive: false })
        }

        window.addEventListener('resize', this.handleResize)
        window.addEventListener('keydown', this.handleKeydown)

        // initialize依赖container的元素宽高, 需要先让页面完成渲染再执行
        window.setTimeout(() => {
            this.initialize()
        }, 0)
    }

    componentWillUnmount() {
        if (this.componentRef.current) {
            this.componentRef.current.removeEventListener('wheel', this.handleWheel)
        }

        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('keydown', this.handleKeydown)
    }

    initialize() {
        const { width, height } = this.context
        this.setState((prevState) => ({
            translateX: width * prevState.scale * -0.5,
            translateY: height * prevState.scale * -0.5
        }))

        this.updateContainerSize()
    }

    handleKeydown() {
        // const shortCut = getShortCut()
        // console.log("shortCut", shortCut)

        // const press_Ctrl_C = matchShortCut("command+c", shortCut)
        // console.log("press_Ctrl_C", press_Ctrl_C)
    }

    handleResize() {
        this.updateContainerSize()
    }

    handleWheel(event) {

        event.stopPropagation()
        event.preventDefault()

        const deltaX = event.deltaX
        const deltaY = event.deltaY

        const ctrlDown = isCtrlDown()

        if (ctrlDown) { // 缩放Stage
            if (deltaY != 0) {
                const modScale = deltaY > 0 ? 0.1 : -0.1
                this.setState((prevState) => ({
                    scale: prevState.scale + modScale
                }))
            }
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
        // 页面结构加载完成时，重新获取元素宽度和高度
        const containerElement = this.componentRef.current

        this.setState({
            containerWidth: containerElement.clientWidth,
            containerHeight: containerElement.clientHeight,
            containerReady: true
        })
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
            overflow: "hidden"
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
                        <Stage scale={scale} />
                    </div>
                </div>
            </div>
        )
    }

    render() {

        console.log("render: stageContainer")

        const content = this.renderContent()

        return (
            <div style={this.containerStyle} ref={this.componentRef}>
                {content}
            </div>
        )
    }
}

export default StageContainer