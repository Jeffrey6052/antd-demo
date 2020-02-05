
import React from "react"
import lodash from "lodash"

import WebMakerContext from "../../context"
import Stage from "../stage"
import StageMask from "../stageMask"

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
            containerReady: false,
            mouse: this.buildDefaultMouse(),
        }

        this.containerRef = React.createRef()
        this.stageAreaRef = React.createRef()

        this.handleWheel = this.handleWheel.bind(this)
        this.handleKeydown = this.handleKeydown.bind(this)
        this.handleResize = this.handleResize.bind(this)

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
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

    buildDefaultMouse() {
        return {
            down: false,
            moved: false,
            downPosition: null,
            movedPosition: null
        }
    }

    /**鼠标按下 */
    onMouseDown(e) {

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
    onMouseMove(e) {

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
    onMouseUp(e) {

        const { mouse } = this.state

        const isClick = mouse.down && !mouse.moved
        const isAreaSelect = mouse.down && mouse.moved && mouse.downPosition && mouse.movedPosition

        if (isClick) {

            if (!isCtrlDown()) {
                const { setSelectedMeshes } = this.context
                setSelectedMeshes([])
            }
        } else if (isAreaSelect) {

            const s1Position = this.calculateStagePosition(mouse.downPosition.x, mouse.downPosition.y)
            const s2Position = this.calculateStagePosition(mouse.movedPosition.x, mouse.movedPosition.y)

            const [left, right] = [s1Position.x, s2Position.x].sort()
            const [top, bottom] = [s1Position.y, s2Position.y].sort()

            const area = { left, right, top, bottom }

            const { meshes, selectedMeshes, addSelectedMeshes, setSelectedMeshes, deleteSelectedMeshes } = this.context
            const filterMeshes = meshes.filter(mesh => this.isMeshInArea(mesh, area))
            const areaMeshIds = filterMeshes.map(mesh => mesh.specs.properties.$id)

            if (isCtrlDown()) {
                const addMeshIds = areaMeshIds.filter(meshId => !selectedMeshes.has(meshId))
                if (addMeshIds.length) {
                    addSelectedMeshes(addMeshIds)
                }

                const delMeshIds = lodash.difference(areaMeshIds, addMeshIds)
                if (delMeshIds.length) {
                    deleteSelectedMeshes(delMeshIds)
                }
            } else {
                if (areaMeshIds.length) {
                    setSelectedMeshes(areaMeshIds)
                } else if (selectedMeshes.size) {
                    setSelectedMeshes([])
                }
            }
        }

        this.setState({ mouse: this.buildDefaultMouse() })
    }

    isMeshInArea(mesh, area) {

        const { $x, $y, $width, $height } = mesh.specs.properties

        const fitLeft = $x >= area.left
        const fitTop = $y >= area.top
        const fitRight = ($x + $width) <= area.right
        const fitBottom = ($y + $height) <= area.bottom

        return fitLeft && fitTop && fitRight && fitBottom
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

    onMouseEnter(event) {

    }

    onMouseLeave(event) {

    }

    onDragOver(event) {
        event.preventDefault()
    }

    onDrop(event) {
        event.preventDefault()

        const componentKey = event.dataTransfer.getData('componentKey')
        if (!componentKey) {
            return
        }

        const { clientX, clientY } = event

        const stagePosition = this.calculateStagePosition(clientX, clientY)
        if (!stagePosition) {
            return
        }

        const { addMesh } = this.context

        addMesh(componentKey, stagePosition.x, stagePosition.y)
    }

    calculateStagePosition(clientX, clientY) {
        const stageArea = this.stageAreaRef.current
        if (!stageArea) {
            return
        }

        const areaRect = stageArea.getBoundingClientRect()
        const { scale } = this.state

        const x = (clientX - areaRect.x) / scale
        const y = (clientY - areaRect.y) / scale

        return { x, y }
    }

    renderMouseArea() {

        const { mouse } = this.state

        const toRender = mouse.down && mouse.moved
        if (!toRender) {
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
            height: height,
            zIndex: 1000
        }

        return (
            <div style={areaStyle} />
        )
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
            width: width,
            height: height
        }

        const wrapperProps = {
            style: wrapperStyle,
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave,
            onDragOver: this.onDragOver,
            onDrop: this.onDrop
        }

        return (
            <div style={scaleLayerStyle}>
                <div style={fullLayerStyle}>
                    <div style={{ marginLeft: width, marginTop: height }}>
                        <div {...wrapperProps} id="stage-wrapper" ref={this.stageAreaRef}>
                            <Stage />
                            <StageMask />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {

        console.log("render: stageContainer")

        const containerStyle = {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            touchAction: "none"
        }

        const containerProps = {
            style: containerStyle,
            onMouseDown: this.onMouseDown,
            onMouseMove: this.onMouseMove,
            onMouseUp: this.onMouseUp
        }

        return (
            <div {...containerProps} id="stage-container" ref={this.containerRef}>
                {this.renderContent()}
                {this.renderMouseArea()}
            </div>
        )
    }
}

export default StageContainer