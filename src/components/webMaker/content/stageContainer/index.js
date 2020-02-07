
import React from "react"
import lodash from "lodash"

import WebMakerContext from "../../context"
import Stage from "../stage"
import StageMask from "../stageMask"

import { isCtrlDown, isShiftDown, getShortCut, matchShortCut } from "../../../../utils/KeyboardWatch"

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
            mouseCapture: null
        }

        // 记录鼠标按下瞬间的一些状态
        this.mouseDownSelectedMeshIds = new Set([])
        this.mouseDownCtrlDown = false
        this.mouseDownShiftDown = false

        this.containerRef = React.createRef()
        this.stageAreaRef = React.createRef()

        this.setMouseCapture = this.setMouseCapture.bind(this)

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
        window.addEventListener('mousemove', this.onMouseMove)
        window.addEventListener('mouseup', this.onMouseUp)

        // initialize依赖container的元素宽高, 需要先让页面完成渲染再执行
        window.setTimeout(() => {
            this.initialize()
        }, 0)
    }

    componentWillUnmount() {
        this.containerRef.current.removeEventListener('mousewheel', this.handleWheel)

        window.removeEventListener('resize', this.handleResize)
        window.removeEventListener('keydown', this.handleKeydown)
        window.removeEventListener('mousemove', this.onMouseMove)
        window.removeEventListener('mouseup', this.onMouseUp)
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

        const { selectedMeshes } = this.context

        this.mouseDownSelectedMeshIds = selectedMeshes // 鼠标按下时，记录当前组件选中的组件
        this.mouseDownCtrlDown = isCtrlDown() // 鼠标按下时，记录当前ctrl键是否按下
        this.mouseDownShiftDown = isShiftDown() // 鼠标按下时，记录当前shift键是否按下

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

        const { mouse, mouseCapture } = this.state

        if (!mouse.down) {
            return
        }

        const x = e.clientX
        const y = e.clientY

        const movedPosition = { x, y }

        if (mouseCapture && mouseCapture.type === "mesh") {
            this.moveMesh(mouseCapture.data, mouse.downPosition, movedPosition)
        }

        this.setState((prevState) => ({
            mouse: {
                ...prevState.mouse,
                moved: true,
                movedPosition: movedPosition
            }
        }), () => {
            this.checkMouseAreaSelect()
        })
    }

    /**鼠标松开 */
    onMouseUp(e) {

        this.checkMouseClick()

        this.setState({
            mouse: this.buildDefaultMouse(),
            mouseCapture: null
        })
    }

    // 拖动组件
    moveMesh(downProperties, downPosition, movedPosition) {

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

    checkMouseClick() {

        const { mouseCapture } = this.state

        if (mouseCapture) { // 鼠标点到内部元素时不执行
            return
        }

        const { mouse } = this.state

        const isClick = mouse.down && !mouse.moved

        if (!isClick) {
            return
        }

        const ctrlDown = isCtrlDown()
        const shiftDown = isShiftDown()

        const ctrlOrShiftDown = ctrlDown || shiftDown

        if (!ctrlOrShiftDown) {
            const { setSelectedMeshes } = this.context
            setSelectedMeshes([])
        }
    }

    checkMouseAreaSelect() {

        const { mouseCapture } = this.state

        if (mouseCapture) { // 当鼠标点到内部元素时不执行这个方法
            return
        }

        const { mouse } = this.state

        const isAreaSelect = mouse.down && mouse.moved && mouse.downPosition && mouse.movedPosition

        const ctrlDown = this.mouseDownCtrlDown
        const shiftDown = this.mouseDownShiftDown

        if (isAreaSelect) {

            const area = this.calculateStageMouseArea(mouse.downPosition, mouse.movedPosition)

            const { meshes, selectedMeshes, addSelectedMeshes, setSelectedMeshes, deleteSelectedMeshes } = this.context
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
    }

    setMouseCapture(captureData) {
        this.setState({
            mouseCapture: captureData
        })
    }

    calculateStageMouseArea(downPosition, movedPosition) {
        const s1Position = this.calculateStagePosition(downPosition.x, downPosition.y)
        const s2Position = this.calculateStagePosition(movedPosition.x, movedPosition.y)

        const [left, right] = [s1Position.x, s2Position.x].sort((i, j) => i <= j)
        const [top, bottom] = [s1Position.y, s2Position.y].sort((i, j) => i <= j)

        const area = { left, right, top, bottom }

        return area
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

        const { mouse, mouseCapture } = this.state

        const toRender = mouse.down && mouse.moved && !mouseCapture
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
                            <StageMask setMouseCapture={this.setMouseCapture} />
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