
import React from "react"
import lodash from "lodash"

import WebMakerContext from "../../context"
import Stage from "../stage"
import StageMask from "../stageMask"

import { isCtrlDown, isShiftDown, getShortCut, parseShortCut } from "../../../../utils/KeyboardWatch"

class StageContainer extends React.PureComponent {

    static contextType = WebMakerContext;

    constructor(props) {
        super(props)

        this.state = {
            scale: 0.6,
            translateX: 0,
            translateY: 0,
            containerWidth: 0,
            containerHeight: 0,
            containerReady: false,
            mouse: this.buildDefaultMouse()
        }

        // 记录宽高，用于监听变化
        this.memoWidth = props.width
        this.memoHeight = props.height

        // 记录鼠标按下瞬间的一些状态
        this.mouseDownSelectedMeshIds = new Set([])
        this.mouseDownCtrlDown = false
        this.mouseDownShiftDown = false
        this.mouseDownTime = 0
        this.mouseCapture = null

        this.containerRef = React.createRef()
        this.stageAreaRef = React.createRef()

        this.setMouseCapture = this.setMouseCapture.bind(this)

        this.onMouseWheel = this.onMouseWheel.bind(this)
        this.onKeydown = this.onKeydown.bind(this)
        this.onResize = this.onResize.bind(this)

        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = lodash.throttle(this.onMouseMove.bind(this), 25) // 执行帧数限制
        this.onMouseUp = this.onMouseUp.bind(this)
    }

    componentDidMount() {

        this.containerRef.current.addEventListener('mousewheel', this.onMouseWheel, { passive: false })

        window.addEventListener('resize', this.onResize)
        window.addEventListener('keydown', this.onKeydown)
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)

        // initialize依赖container的元素宽高, 需要先让页面完成渲染再执行
        window.setTimeout(() => {
            this.initialize()
        }, 0)
    }

    componentDidUpdate() {

        const { memoWidth, memoHeight } = this
        const { width, height } = this.context

        if (width !== memoWidth || height !== memoHeight) {
            this.memoWidth = width
            this.memoHeight = height
            this.resetContainerTranslate()
        }
    }

    componentWillUnmount() {

        this.containerRef.current.removeEventListener('mousewheel', this.onMouseWheel)

        window.removeEventListener('resize', this.onResize)
        window.removeEventListener('keydown', this.onKeydown)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
    }

    initialize() {

        this.resetContainerTranslate()

        this.updateContainerSize()

        this.initShortCutEvents()
    }

    resetContainerTranslate() {
        const { width, height } = this.context
        this.setState((prevState) => ({
            translateX: (width - 1) * -1 * prevState.scale + 20,
            translateY: (height - 1) * -1 * prevState.scale + 20
        }))
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
        const { selectedMeshes } = this.context

        const ctrlDown = isCtrlDown()
        const shiftDown = isShiftDown()

        this.mouseDownCtrlDown = ctrlDown // 记录当前ctrl键是否按下
        this.mouseDownShiftDown = shiftDown // 记录当前shift键是否按下
        this.mouseDownSelectedMeshIds = selectedMeshes // 记住当前已选中的组件
        this.mouseDownTime = new Date().getTime()

        if (!this.mouseCapture) {
            this.doContainerMouseDown()
        }

        const x = e.clientX
        const y = e.clientY

        this.setState((prevState) => {
            return {
                mouse: {
                    ...prevState.mouse,
                    down: true,
                    downPosition: { x: x, y: y },
                    moved: false,
                    movedPosition: null
                }
            }
        })
    }

    /**鼠标移动 */
    onMouseMove(e) {

        const { mouse } = this.state

        if (!mouse.down) {
            return
        }

        const { mouseCapture, mouseDownTime } = this

        const x = e.clientX
        const y = e.clientY

        const movedPosition = { x, y }

        const currentTime = new Date().getTime()

        // 体验改进1: 鼠标按下的前200毫秒，作为点击容错判定阶段，不移动组件
        const allowDrag = (currentTime - mouseDownTime) >= 200

        if (mouseCapture && mouseCapture.type === "mesh" && allowDrag) {
            this.dragMesh(mouseCapture.data, mouse.downPosition, movedPosition)
        }

        this.setState((prevState) => ({
            mouse: {
                ...prevState.mouse,
                moved: true,
                movedPosition: movedPosition
            }
        }), () => {
            this.doMouseAreaSelect()
        })
    }

    /**鼠标松开 */
    onMouseUp(e) {

        const { mouse } = this.state

        if (!mouse.down) {
            return
        }

        const isContainerClick = !this.mouseCapture && mouse.down && !mouse.moved

        if (isContainerClick) {
            this.doContainerMouseClick()
        }

        this.setState({
            mouse: this.buildDefaultMouse()
        }, () => {
            this.mouseCapture = null
        })
    }

    // 拖动组件
    dragMesh(downProperties, downPosition, movedPosition) {

        const { meshes, setMeshes } = this.context
        const { scale } = this.state

        const newMeshes = meshes.map((mesh) => {

            const { properties } = mesh.specs

            if (properties.$id === downProperties.$id) {

                // 修改组件坐标
                const dx = Math.round((movedPosition.x - downPosition.x) / scale)
                const dy = Math.round((movedPosition.y - downPosition.y) / scale)

                const newMesh = lodash.cloneDeep(mesh)
                const newProperties = newMesh.specs.properties

                newProperties.$x = downProperties.$x + dx
                newProperties.$y = downProperties.$y + dy

                return newMesh
            } else {
                return mesh
            }
        })

        setMeshes(newMeshes)
    }

    moveSelectedMeshes(dx, dy) {

        const { meshes, setMeshes, selectedMeshes } = this.context

        if (!selectedMeshes.size) {
            return
        }

        const newMeshes = meshes.map((mesh) => {

            const { properties } = mesh.specs

            if (selectedMeshes.has(properties.$id)) {

                const newMesh = lodash.cloneDeep(mesh)
                const newProperties = newMesh.specs.properties

                newProperties.$x = properties.$x + dx
                newProperties.$y = properties.$y + dy

                return newMesh
            } else {
                return mesh
            }
        })

        setMeshes(newMeshes)
    }


    doContainerMouseDown() {
        const ctrlDown = isCtrlDown()
        const shiftDown = isShiftDown()

        const ctrlOrShiftDown = ctrlDown || shiftDown

        if (!ctrlOrShiftDown) {
            const { setSelectedMeshes } = this.context
            setSelectedMeshes([])
        }
    }

    doContainerMouseClick() {
        // nothing
    }

    isMouseAreaSelect() {
        const { mouse } = this.state

        const isMouseAreaSelect = !this.mouseCapture && mouse.down && mouse.moved && mouse.downPosition && mouse.movedPosition

        return isMouseAreaSelect
    }

    doMouseAreaSelect() {

        const isMouseAreaSelect = this.isMouseAreaSelect()
        if (!isMouseAreaSelect) {
            return
        }

        const { mouse } = this.state

        const ctrlDown = this.mouseDownCtrlDown
        const shiftDown = this.mouseDownShiftDown

        const area = this.calculateStageMouseArea(mouse.downPosition, mouse.movedPosition)

        const { meshes, selectedMeshes, setSelectedMeshes } = this.context
        const filterMeshes = meshes.filter(mesh => this.isMeshInArea(mesh, area))
        const areaMeshIds = filterMeshes.map(mesh => mesh.specs.properties.$id)

        if (shiftDown) { // shift追加

            const { mouseDownSelectedMeshIds } = this

            const nowSelectMeshIds = lodash.union(Array.from(mouseDownSelectedMeshIds), areaMeshIds)

            setSelectedMeshes(nowSelectMeshIds)

        } else if (ctrlDown) { // ctrl反选

            const { mouseDownSelectedMeshIds } = this

            const nowSelectMeshIds = lodash.xor(Array.from(mouseDownSelectedMeshIds), areaMeshIds)

            setSelectedMeshes(nowSelectMeshIds)

        } else {
            if (areaMeshIds.length) {
                setSelectedMeshes(areaMeshIds)
            } else if (selectedMeshes.size) {
                setSelectedMeshes([])
            }
        }
    }

    isContainerMouseDown() {
        const { mouse } = this.state
        const isMouseDown = mouse.down && !this.mouseCapture

        return isMouseDown
    }

    undoContainerMouseDown() {

        const isContainerMouseDown = this.isContainerMouseDown()
        if (!isContainerMouseDown) {
            return
        }

        const { setSelectedMeshes } = this.context

        // 如果ctrl或者shift是按下状态，则恢复鼠标按下之前的状态，否则清空
        if (this.mouseDownCtrlDown || this.mouseDownShiftDown) {
            setSelectedMeshes(Array.from(this.mouseDownSelectedMeshIds))
        } else {
            setSelectedMeshes([])
        }

        this.setState({
            mouse: this.buildDefaultMouse()
        })
    }

    setMouseCapture(captureData) {
        this.mouseCapture = captureData
    }

    calculateStageMouseArea(downPosition, movedPosition) {
        const s1Position = this.calculateStagePosition(downPosition.x, downPosition.y)
        const s2Position = this.calculateStagePosition(movedPosition.x, movedPosition.y)

        const [left, right] = [s1Position.x, s2Position.x].sort((a, b) => a - b)
        const [top, bottom] = [s1Position.y, s2Position.y].sort((a, b) => a - b)

        const area = { left, right, top, bottom }

        return area
    }

    isMeshInArea(mesh, area) {

        const { $x, $y, $width, $height } = mesh.specs.properties

        // 2020.02.09 优化框选判定，只要元素的任意两个角上的点被框住，即认为元素被选中
        const left = $x
        const right = $x + $width
        const top = $y
        const bottom = $y + $height

        const testCases = [
            [left, top],
            [left, bottom],
            [right, top],
            [right, bottom]
        ]

        let fitCount = 0

        testCases.forEach(([x, y]) => {
            const fitX = area.left <= x && area.right >= x
            const fitY = area.top <= y && area.bottom >= y

            if (fitX && fitY) {
                fitCount += 1
            }
        })

        return fitCount >= 2
    }

    initShortCutEvents() {

        this.shortCutEvents = {}

        this.registerShortCut("esc", () => this.undoContainerMouseDown())

        this.registerShortCut("ctrl+c", () => console.log("ctrl+c"))
        this.registerShortCut("ctrl+v", () => console.log("ctrl+v"))

        this.registerShortCut("left", () => this.moveSelectedMeshes(-10, 0))
        this.registerShortCut("right", () => this.moveSelectedMeshes(10, 0))
        this.registerShortCut("up", () => this.moveSelectedMeshes(0, -10))
        this.registerShortCut("down", () => this.moveSelectedMeshes(0, 10))
        this.registerShortCut("ctrl+left", () => this.moveSelectedMeshes(-1, 0))
        this.registerShortCut("ctrl+right", () => this.moveSelectedMeshes(1, 0))
        this.registerShortCut("ctrl+up", () => this.moveSelectedMeshes(0, -1))
        this.registerShortCut("ctrl+down", () => this.moveSelectedMeshes(0, 1))
        this.registerShortCut("shift+left", () => this.moveSelectedMeshes(-100, 0))
        this.registerShortCut("shift+right", () => this.moveSelectedMeshes(100, 0))
        this.registerShortCut("shift+up", () => this.moveSelectedMeshes(0, -100))
        this.registerShortCut("shift+down", () => this.moveSelectedMeshes(0, 100))
    }

    registerShortCut(shortCutString, handleEvent) {
        const shortCut = parseShortCut(shortCutString)
        const eventKey = shortCut.join("_")

        this.shortCutEvents[eventKey] = handleEvent
    }

    invokeShortCutEvent() {

        const events = this.shortCutEvents
        if (!events) {
            return
        }

        const shortCut = getShortCut()
        // console.log("shortCut", shortCut)

        const eventKey = shortCut.join("_")

        const event = events[eventKey]

        if (event) {
            event.call()
        }
    }

    onKeydown() {
        this.invokeShortCutEvent()
    }

    onResize() {
        this.updateContainerSize()
    }

    onMouseWheel(event) {

        event.stopPropagation()
        event.preventDefault()

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

        const x = Math.round((clientX - areaRect.x) / scale)
        const y = Math.round((clientY - areaRect.y) / scale)

        return { x, y }
    }

    renderMouseArea() {

        const { mouse } = this.state

        const toRender = mouse.down && mouse.moved && !this.mouseCapture
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
            backgroundColor: 'rgba(0,0,0,0.1)',
            border: "1px dotted rgb(102,102,102)",
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

        const { containerReady, translateX, translateY, scale, mouse } = this.state

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
                            <StageMask hoverable={!mouse.down} setMouseCapture={this.setMouseCapture} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {

        // console.log("render: stageContainer")

        const containerStyle = {
            width: "100%",
            height: "100%",
            overflow: "hidden",
            touchAction: "none"
        }

        const containerProps = {
            style: containerStyle,
            onMouseDown: this.onMouseDown
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